from .base import Thread, Message, make_id, passes_quality_gate


def normalise(record: dict) -> Thread | None:
    """
    AESLC columns: email_body, subject_line
    This is already clean — minimal processing needed.
    """
    try:
        body = (record.get("email_body") or "").strip()
        subject = (record.get("subject_line") or "").strip()

        thread = Thread(
            thread_id=make_id("aeslc"),
            source="aeslc",
            subject=subject,
            messages=[Message(
                from_name="Sender",
                from_email="sender@company.com",
                to_name="Recipient",
                to_email="recipient@company.com",
                body=body,
            )],
            thread_depth=1,
            industry_hint="corporate"
        )

        passes, reason = passes_quality_gate(thread)
        if not passes:
            return None
        return thread

    except Exception:
        return None


def load_and_normalise(max_records: int = 3000) -> list[Thread]:
    from datasets import load_dataset
    print(f"Loading AESLC dataset (max {max_records} records)...")
    ds = load_dataset("Yale-LILY/aeslc", split="train")

    print("Columns:", ds.features)
    print("Sample:", ds[0])

    results = []
    for record in ds:
        if len(results) >= max_records:
            break
        thread = normalise(record)
        if thread:
            results.append(thread)

    print(f"AESLC: {len(ds)} raw → {len(results)} valid threads")
    return results
