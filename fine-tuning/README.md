# Kross Fine-tuning Pipeline

Generates training data and fine-tunes Gemma 4 on Kross-specific email tasks.

## Setup

```bash
cd fine-tuning
uv sync

cp .env.example .env   # add your Azure OpenAI credentials
```

## Run the pipeline

```bash
# Step 1 — normalise and label all real datasets
uv run python -m pipeline.run --mode real

# Step 2 — label any generated synthetic emails
uv run python -m pipeline.run --mode label

# Step 3 — merge everything into final train/val/test splits
uv run python -m pipeline.run --mode merge
```

Each step saves checkpoints to `datasets/` so you can stop and resume without re-running API calls.

## Training (GPU required — run on RunPod / Lambda Labs A100)

```bash
uv sync --extra train
uv run python train.py \
  --data datasets/final/train_combined.jsonl \
  --val  datasets/final/validation_combined.jsonl \
  --output ./output/lora-v1
```

## Evaluation

```bash
uv run python eval.py \
  --adapter ./output/lora-v1 \
  --test    datasets/final/test_combined.jsonl
```

See `CLAUDE.md` at the repo root for the full fine-tuning strategy and training config reference.
