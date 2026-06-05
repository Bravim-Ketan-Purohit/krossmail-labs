"""
Evaluate a trained LoRA adapter against the held-out test set.

Usage:
  uv run python eval.py --adapter ./output/lora-v1 \
                        --test   datasets/final/test_combined.jsonl
"""
import argparse
import json
from pathlib import Path
from collections import defaultdict


def load_jsonl(path: Path) -> list[dict]:
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def evaluate_category(predictions: list[dict], ground_truth: list[dict]) -> dict:
    correct = sum(
        p["category"] == g["category"]
        for p, g in zip(predictions, ground_truth)
    )
    return {"accuracy": correct / len(ground_truth) if ground_truth else 0}


def evaluate_priority(predictions: list[dict], ground_truth: list[dict]) -> dict:
    errors = [
        abs(p["priority_score"] - g["priority_score"])
        for p, g in zip(predictions, ground_truth)
    ]
    return {
        "mae": sum(errors) / len(errors) if errors else 0,
        "within_10": sum(1 for e in errors if e <= 10) / len(errors) if errors else 0,
    }


def main(args):
    # Import here so the file is importable without GPU deps installed
    from unsloth import FastLanguageModel
    from transformers import TextStreamer
    import evaluate as hf_evaluate

    rouge = hf_evaluate.load("rouge")

    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=args.adapter,
        max_seq_length=4096,
        load_in_4bit=True,
    )
    FastLanguageModel.for_inference(model)

    test_examples = load_jsonl(Path(args.test))
    predictions = []
    ground_truth = []

    for example in test_examples:
        messages = example["messages"]
        # Remove the assistant turn — that's what we're predicting
        prompt_messages = [m for m in messages if m["role"] != "assistant"]
        expected = next(m for m in messages if m["role"] == "assistant")

        inputs = tokenizer.apply_chat_template(
            prompt_messages, tokenize=True, return_tensors="pt"
        ).to(model.device)

        outputs = model.generate(inputs, max_new_tokens=512, temperature=0.0)
        decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)

        try:
            pred_json = json.loads(decoded.split("assistant")[-1].strip())
        except Exception:
            pred_json = {}

        try:
            truth_json = json.loads(expected["content"])
        except Exception:
            truth_json = {}

        predictions.append(pred_json)
        ground_truth.append(truth_json)

    cat_metrics = evaluate_category(predictions, ground_truth)
    priority_metrics = evaluate_priority(predictions, ground_truth)

    pred_summaries = [p.get("summary", "") for p in predictions]
    true_summaries = [g.get("summary", "") for g in ground_truth]
    rouge_scores = rouge.compute(predictions=pred_summaries, references=true_summaries)

    print("\n=== EVALUATION RESULTS ===")
    print(f"Category accuracy:   {cat_metrics['accuracy']:.3f}")
    print(f"Priority MAE:        {priority_metrics['mae']:.1f}")
    print(f"Priority within ±10: {priority_metrics['within_10']:.3f}")
    print(f"Summary ROUGE-1:     {rouge_scores['rouge1']:.3f}")
    print(f"Summary ROUGE-L:     {rouge_scores['rougeL']:.3f}")
    print(f"Test examples:       {len(test_examples)}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--adapter", required=True, help="Path to LoRA adapter or s3:// URI")
    parser.add_argument("--test", required=True, help="Path to test_combined.jsonl")
    main(parser.parse_args())
