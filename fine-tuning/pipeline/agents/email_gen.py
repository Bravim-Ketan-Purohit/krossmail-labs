# Agent 2 — Email Generator
# Takes a scenario dict from Agent 1 and generates a realistic email thread.
import json
import asyncio
from openai import AsyncAzureOpenAI
from ..config import settings
from ..normalisers.base import Thread, Message, make_id, passes_quality_gate

SYSTEM_PROMPT = """
You generate realistic workplace email threads for AI training data.
Output valid JSON only. No preamble. No explanation.

Given a scenario, generate an email thread with exactly these fields:
{
  "subject": "realistic email subject line",
  "messages": [
    {
      "from_name": "Full Name",
      "from_email": "name@domain.com",
      "to_name": "Full Name",
      "to_email": "name@domain.com",
      "body": "email body text",
      "timestamp": "2024-03-15T09:30:00Z"
    }
  ]
}

Rules:
- thread_depth in the scenario controls how many messages to generate
- Make the content match the email_type, urgency, and relationship exactly
- If has_attachment is true, mention the attachment naturally in the body
- If contains_scheduling_intent is true, include a clear request to meet or schedule
- Write naturally — vary sentence length, include real workplace vocabulary
- Do NOT include placeholder text like [Name] or <insert>
- Bodies should be 80–600 words depending on email_type
"""


async def generate_email(
    scenario: dict,
    client: AsyncAzureOpenAI,
    semaphore: asyncio.Semaphore
) -> Thread | None:
    async with semaphore:
        try:
            response = await client.chat.completions.create(
                model=settings.azure_openai_deployment,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Generate an email thread for this scenario:\n{json.dumps(scenario, indent=2)}"}
                ],
                temperature=settings.temperature_email,
                response_format={"type": "json_object"}
            )
            data = json.loads(response.choices[0].message.content)

            messages = [Message(**m) for m in data.get("messages", [])]
            if not messages:
                return None

            thread = Thread(
                thread_id=make_id("synthetic"),
                source="synthetic",
                subject=data.get("subject", ""),
                messages=messages,
                has_attachment=scenario.get("has_attachment", False),
                thread_depth=len(messages),
                industry_hint=scenario.get("industry"),
                hint_category=scenario.get("email_type"),
            )

            passes, reason = passes_quality_gate(thread)
            if not passes:
                return None
            return thread

        except Exception as e:
            print(f"Email generation failed: {e}")
            return None


async def generate_batch(
    scenarios: list[dict],
    client: AsyncAzureOpenAI,
    semaphore: asyncio.Semaphore
) -> list[Thread]:
    tasks = [generate_email(s, client, semaphore) for s in scenarios]
    results = await asyncio.gather(*tasks)
    return [r for r in results if r is not None]
