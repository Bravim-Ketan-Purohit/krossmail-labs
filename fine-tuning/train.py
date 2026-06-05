"""
LoRA fine-tuning for Gemma 4 on Kross email data.
Requires GPU — run on RunPod or Lambda Labs with an A100.

Install train deps first:
  uv sync --extra train

Usage:
  uv run python train.py --data datasets/final/train_combined.jsonl \
                         --val  datasets/final/validation_combined.jsonl \
                         --output ./output/lora-v1
"""
import argparse
import json
from pathlib import Path


def load_jsonl(path: Path) -> list[dict]:
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def main(args):
    # Import here so the file is importable without GPU deps installed
    from unsloth import FastLanguageModel
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name="google/gemma-4-27b-it",
        max_seq_length=4096,
        load_in_4bit=True,
    )

    model = FastLanguageModel.get_peft_model(
        model,
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        bias="none",
    )

    train_data = load_jsonl(Path(args.data))
    val_data = load_jsonl(Path(args.val))

    train_ds = Dataset.from_list(train_data)
    val_ds = Dataset.from_list(val_data)

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        args=SFTConfig(
            output_dir=args.output,
            num_train_epochs=3,
            per_device_train_batch_size=4,
            gradient_accumulation_steps=4,
            learning_rate=2e-4,
            warmup_ratio=0.05,
            evaluation_strategy="steps",
            eval_steps=200,
            save_steps=200,
            logging_steps=50,
            bf16=True,
        ),
    )

    trainer.train()
    model.save_pretrained(args.output)
    tokenizer.save_pretrained(args.output)
    print(f"Adapter saved to {args.output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Path to train_combined.jsonl")
    parser.add_argument("--val", required=True, help="Path to validation_combined.jsonl")
    parser.add_argument("--output", default="./output/lora-v1")
    main(parser.parse_args())
