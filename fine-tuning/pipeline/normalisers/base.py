from pydantic import BaseModel
from typing import Optional
import uuid


class Message(BaseModel):
    from_name: str
    from_email: str
    to_name: str
    to_email: str
    body: str
    timestamp: str = ""


class Thread(BaseModel):
    thread_id: str
    source: str          # "enron" | "aeslc" | "classifier" | "synthetic"
    subject: str
    messages: list[Message]
    has_attachment: bool = False
    attachment_summary: Optional[str] = None
    thread_depth: int = 1
    industry_hint: Optional[str] = None
    hint_category: Optional[str] = None  # from pre-labeled datasets


class Label(BaseModel):
    priority_score: int
    category: str        # action_required | waiting | fyi | noise
    summary: str
    action_items: list[str]
    scheduling_intent: bool
    suggested_replies: dict
    tone_of_sender: str
    follow_up_needed: bool
    follow_up_days: Optional[int] = None


class LabeledExample(BaseModel):
    thread: Thread
    label: Label


def make_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}"


def passes_quality_gate(thread: Thread) -> tuple[bool, str]:
    """
    Returns (passes, reason).
    Run this before sending any thread to the label generator.
    """
    if not thread.messages:
        return False, "no messages"

    body = thread.messages[0].body

    if len(body) < 50:
        return False, "body too short"

    if len(body) > 8000:
        return False, "body too long"

    if not thread.subject.strip():
        return False, "empty subject"

    # Mostly non-ASCII — likely foreign language
    if len(body) > 0:
        ascii_ratio = sum(c.isascii() for c in body) / len(body)
        if ascii_ratio < 0.85:
            return False, "non-ascii content"

    # Only a forwarding chain artifact
    if body.strip().startswith(">") and len(body) < 200:
        return False, "forwarding artifact only"

    # Legal footer dominates
    footer_kws = ["confidential", "privileged", "intended recipient"]
    if sum(1 for kw in footer_kws if kw in body.lower()) >= 2 and len(body) < 300:
        return False, "legal footer only"

    return True, "ok"
