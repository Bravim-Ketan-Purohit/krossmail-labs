# Agent 4 — Quality Gate
# Validates that a Label produced by Agent 3 is internally consistent
# and meets the minimum bar before it enters the training set.
from ..normalisers.base import Thread, Label

VALID_CATEGORIES = {"action_required", "waiting", "fyi", "noise"}
VALID_TONES = {"urgent", "professional", "casual", "frustrated", "friendly", "formal"}

# Category ↔ priority score ranges that must be consistent
_CATEGORY_SCORE_FLOOR = {
    "action_required": 30,
    "waiting": 20,
    "fyi": 10,
    "noise": 0,
}
_CATEGORY_SCORE_CEILING = {
    "action_required": 100,
    "waiting": 80,
    "fyi": 60,
    "noise": 29,
}


def passes_label_quality(thread: Thread, label: Label) -> bool:
    """
    Returns True if the label is valid and internally consistent.
    Rejects silently — caller decides whether to log or skip.
    """
    # Required fields present
    if not label.summary or len(label.summary.strip()) < 20:
        return False

    if label.category not in VALID_CATEGORIES:
        return False

    if label.tone_of_sender not in VALID_TONES:
        return False

    if not (0 <= label.priority_score <= 100):
        return False

    # Category ↔ priority consistency
    floor = _CATEGORY_SCORE_FLOOR[label.category]
    ceiling = _CATEGORY_SCORE_CEILING[label.category]
    if not (floor <= label.priority_score <= ceiling):
        return False

    # If follow_up_needed is True, follow_up_days must be set
    if label.follow_up_needed and label.follow_up_days is None:
        return False

    # follow_up_days must be positive when set
    if label.follow_up_days is not None and label.follow_up_days < 1:
        return False

    # suggested_replies must have at least one non-empty key
    if not label.suggested_replies or not any(
        v and str(v).strip() for v in label.suggested_replies.values()
    ):
        return False

    # Noise emails should not have action items
    if label.category == "noise" and label.action_items:
        return False

    return True
