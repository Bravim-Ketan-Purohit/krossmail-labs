from .base import Thread, Message, make_id, passes_quality_gate

# Dataset: jason23322/high-accuracy-email-classifier
# 12k emails, 6 categories, Apache 2.0
# Run print(ds[0]) on first load to confirm exact column names.

CATEGORY_MAP = {
    # Map dataset's native label values → hint_category for the labeler
    # Populated after first load — check ds.features['label'].names
}


def normalise(record: dict) -> Thread | None:
    try:
        body = (record.get("text") or record.get("body") or record.get("email") or "").strip()
        subject = (record.get("subject") or "").strip()
        label_val = record.get("label")

        thread = Thread(
            thread_id=make_id("classifier"),
            source="classifier",
            subject=subject or "(no subject)",
            messages=[Message(
                from_name="Sender",
                from_email="sender@company.com",
                to_name="Recipient",
                to_email="recipient@company.com",
                body=body,
            )],
            thread_depth=1,
            hint_category=CATEGORY_MAP.get(str(label_val)) if label_val is not None else None,
        )

        passes, reason = passes_quality_gate(thread)
        if not passes:
            return None
        return thread

    except Exception:
        return None


def load_and_normalise(max_records: int = 5000) -> list[Thread]:
    from datasets import load_dataset
    print(f"Loading high-accuracy-email-classifier (max {max_records} records)...")
    ds = load_dataset("jason23322/high-accuracy-email-classifier", split="train")

    print("Columns:", ds.features)
    print("Sample:", ds[0])

    results = []
    for record in ds:
        if len(results) >= max_records:
            break
        thread = normalise(record)
        if thread:
            results.append(thread)

    print(f"Classifier: {len(ds)} raw → {len(results)} valid threads")
    return results
