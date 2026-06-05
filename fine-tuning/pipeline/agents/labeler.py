import json
import asyncio
from openai import AsyncAzureOpenAI
from ..config import settings
from ..normalisers.base import Thread, Label

SYSTEM_PROMPT = """
You label email threads for Kross, an AI email assistant.
Output valid JSON only. No preamble.

Priority scoring rules (be strict):
- 90-100: CEO/founder direct, client escalation, legal notice, production outage
- 70-89: manager request with deadline, client question, partner opportunity
- 50-69: peer collaboration, non-urgent client update, vendor proposal
- 30-49: FYI from known contact, internal announcement
- 10-29: newsletter, automated notification, digest, read receipt
- 0-9: spam, cold outreach, pure promotional

Category rules:
- action_required: needs a response or decision from the recipient
- waiting: sent by recipient, awaiting reply from someone else
- fyi: informational, no action needed
- noise: newsletters, automated notifications, no human action needed

Output JSON with exactly these fields:
{
  "priority_score": integer 0-100,
  "category": "action_required|waiting|fyi|noise",
  "summary": "2-3 sentence plain English summary",
  "action_items": ["list", "of", "specific", "actions"],
  "scheduling_intent": true or false,
  "suggested_replies": {
    "direct": "short direct reply",
    "friendly": "warm reply",
    "diplomatic": "careful reply"
  },
  "tone_of_sender": "urgent|professional|casual|frustrated|friendly|formal",
  "follow_up_needed": true or false,
  "follow_up_days": integer or null
}
"""


def thread_to_prompt(thread: Thread) -> str:
    messages_text = "\n\n---\n\n".join([
        f"From: {m.from_name} <{m.from_email}>\n"
        f"To: {m.to_name} <{m.to_email}>\n"
        f"Subject: {thread.subject}\n\n"
        f"{m.body}"
        for m in thread.messages
    ])
    return f"Label this email thread:\n\n{messages_text}"


async def label_thread(
    thread: Thread,
    client: AsyncAzureOpenAI,
    semaphore: asyncio.Semaphore
) -> Label | None:
    async with semaphore:
        try:
            response = await client.chat.completions.create(
                model=settings.azure_openai_deployment,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": thread_to_prompt(thread)}
                ],
                temperature=settings.temperature_label,
                response_format={"type": "json_object"}
            )
            data = json.loads(response.choices[0].message.content)
            return Label(**data)
        except Exception as e:
            print(f"Labeling failed for {thread.thread_id}: {e}")
            return None
