import re
from .base import Thread, Message, make_id, passes_quality_gate


def clean_body(body: str) -> str:
    body = re.sub(r'-{3,}.*?Original Message.*?-{3,}', '', body, flags=re.DOTALL)
    body = re.sub(r'\n{3,}', '\n\n', body)
    body = re.sub(
        r'(This e-mail|This email|CONFIDENTIAL|PRIVILEGED).*?(\.|\n)',
        '', body, flags=re.DOTALL | re.IGNORECASE
    )
    return body.strip()


def normalise(record: dict) -> Thread | None:
    """
    Enron HuggingFace columns vary by dataset version.
    Check print(dataset['train'][0]) first.
    Common columns: from, to, subject, body, date
    """
    try:
        body = clean_body(record.get("body", "") or "")
        subject = record.get("subject", "") or ""
        from_email = record.get("from", "") or ""
        to_email = record.get("to", "") or ""

        thread = Thread(
            thread_id=make_id("enron"),
            source="enron",
            subject=subject,
            messages=[Message(
                from_name=from_email.split("@")[0].replace(".", " ").title(),
                from_email=from_email,
                to_name=to_email.split("@")[0].replace(".", " ").title()
                        if "@" in to_email else "",
                to_email=to_email,
                body=body,
                timestamp=record.get("date", "") or ""
            )],
            thread_depth=1,
            industry_hint="energy/corporate"
        )

        passes, reason = passes_quality_gate(thread)
        if not passes:
            return None
        return thread

    except Exception:
        return None


def load_and_normalise(max_records: int = 5000) -> list[Thread]:
    from datasets import load_dataset
    print(f"Loading Enron dataset (max {max_records} records)...")
    ds = load_dataset("LLM-PBE/enron-email", split="train")

    # Inspect first record so you know the actual column names
    print("Columns:", ds.features)
    print("Sample:", ds[0])

    results = []
    for record in ds:
        if len(results) >= max_records:
            break
        thread = normalise(record)
        if thread:
            results.append(thread)

    print(f"Enron: {len(ds)} raw → {len(results)} valid threads")
    return results
