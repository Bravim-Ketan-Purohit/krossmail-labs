"""
Usage:
  uv run python -m pipeline.run --mode real      # normalise real datasets only
  uv run python -m pipeline.run --mode synthetic # generate synthetic data only
  uv run python -m pipeline.run --mode label     # label all normalised threads
  uv run python -m pipeline.run --mode merge     # merge real + synthetic into final
  uv run python -m pipeline.run --mode all       # run everything
"""
import argparse
import asyncio
import json
import random
import jsonlines
from pathlib import Path
from openai import AsyncAzureOpenAI
from tqdm import tqdm

from .config import settings
from .normalisers import enron, aeslc
from .normalisers.base import Thread, LabeledExample
from .agents import labeler
from .agents.scenario import CATEGORY_DISTRIBUTION, generate_batch
from .agents.quality import passes_label_quality


def save_jsonl(path: Path, records: list):
    path.parent.mkdir(parents=True, exist_ok=True)
    with jsonlines.open(path, mode='w') as w:
        w.write_all([r.model_dump() if hasattr(r, 'model_dump') else r for r in records])
    print(f"Saved {len(records)} records → {path}")


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with jsonlines.open(path) as r:
        return list(r)


def to_training_example(thread: Thread, label) -> dict:
    """Converts a labeled thread to the final chat format for Unsloth SFTTrainer."""
    messages_text = "\n\n".join([
        f"From: {m.from_name} <{m.from_email}>\n"
        f"Subject: {thread.subject}\n\n{m.body}"
        for m in thread.messages
    ])
    return {
        "messages": [
            {
                "role": "system",
                "content": "You are Kross, an AI email assistant. Analyze the email thread and produce structured output."
            },
            {
                "role": "user",
                "content": f"Analyze this email thread:\n\n{messages_text}"
            },
            {
                "role": "assistant",
                "content": json.dumps(
                    label.model_dump() if hasattr(label, 'model_dump') else label,
                    indent=2
                )
            }
        ],
        "_meta": {
            "source": thread.source,
            "thread_id": thread.thread_id,
            "category": label.category if hasattr(label, 'category') else label.get("category"),
            "priority_score": label.priority_score if hasattr(label, 'priority_score') else label.get("priority_score"),
        }
    }


async def run_real(client):
    print("\n=== STEP 1: Normalising real datasets ===")
    threads = []
    threads += enron.load_and_normalise(max_records=5000)
    threads += aeslc.load_and_normalise(max_records=3000)
    save_jsonl(settings.real_dir / "normalised.jsonl", threads)
    print(f"Total real threads normalised: {len(threads)}")
    return threads


async def run_label(client, threads: list[Thread]):
    print(f"\n=== LABELING {len(threads)} threads ===")
    semaphore = asyncio.Semaphore(20)  # max 20 concurrent API calls
    labeled = []

    for i in range(0, len(threads), settings.batch_size):
        batch = threads[i:i + settings.batch_size]
        tasks = [labeler.label_thread(t, client, semaphore) for t in batch]
        results = await asyncio.gather(*tasks)

        for thread, label in zip(batch, results):
            if label is None:
                continue
            if not passes_label_quality(thread, label):
                continue
            labeled.append({"thread": thread.model_dump(), "label": label.model_dump()})

        print(f"  Labeled batch {i//settings.batch_size + 1} | Total so far: {len(labeled)}")

        # Save progress after every batch — safe to stop and resume
        save_jsonl(settings.labeled_dir / "labeled_checkpoint.jsonl", labeled)

    return labeled


async def run_merge(labeled_synthetic: list, labeled_real: list):
    print("\n=== MERGING AND SPLITTING ===")
    all_examples = []

    for item in labeled_synthetic + labeled_real:
        thread = Thread(**item["thread"])
        label_data = item["label"]
        all_examples.append(to_training_example(thread, label_data))

    random.shuffle(all_examples)
    n = len(all_examples)
    train = all_examples[:int(n * 0.8)]
    val = all_examples[int(n * 0.8):int(n * 0.9)]
    test = all_examples[int(n * 0.9):]

    save_jsonl(settings.final_dir / "train_combined.jsonl", train)
    save_jsonl(settings.final_dir / "validation_combined.jsonl", val)
    save_jsonl(settings.final_dir / "test_combined.jsonl", test)

    print(f"\nFinal dataset:")
    print(f"  Train:      {len(train):,}")
    print(f"  Validation: {len(val):,}")
    print(f"  Test:       {len(test):,}")
    print(f"  Total:      {n:,}")


async def main(mode: str):
    client = AsyncAzureOpenAI(
        api_key=settings.azure_openai_api_key,
        azure_endpoint=settings.azure_openai_endpoint,
        api_version=settings.azure_openai_api_version
    )

    if mode in ("real", "all"):
        real_threads = await run_real(client)
        labeled_real = await run_label(client, real_threads)
        save_jsonl(settings.real_dir / "labeled_real.jsonl", labeled_real)
    else:
        labeled_real = load_jsonl(settings.real_dir / "labeled_real.jsonl")

    if mode in ("label", "all"):
        # Load any existing normalised synthetic threads
        synthetic_raw = load_jsonl(settings.generated_dir / "emails_raw.jsonl")
        synthetic_threads = [Thread(**r) for r in synthetic_raw]
        labeled_synthetic = await run_label(client, synthetic_threads)
        save_jsonl(settings.filtered_dir / "labeled_synthetic.jsonl", labeled_synthetic)
    else:
        labeled_synthetic = load_jsonl(settings.filtered_dir / "labeled_synthetic.jsonl")

    if mode in ("merge", "all"):
        await run_merge(labeled_synthetic, labeled_real)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mode",
        choices=["real", "synthetic", "label", "merge", "all"],
        default="all"
    )
    args = parser.parse_args()
    asyncio.run(main(args.mode))
