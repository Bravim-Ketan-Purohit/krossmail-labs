import json
import asyncio
from openai import AsyncAzureOpenAI
from ..config import settings

CATEGORY_DISTRIBUTION = [
    ("noise_newsletter", 5500),
    ("fyi_internal", 3500),
    ("action_internal", 2500),
    ("action_external", 2500),
    ("meeting_scheduling", 2500),
    ("document_thread", 2000),
    ("follow_up", 2000),
    ("client_external", 1500),
    ("multi_turn_long", 1500),
    ("escalation_urgent", 1000),
    ("tool_use_agentic", 1500),
    ("ambiguous_edge", 500),
]

SYSTEM_PROMPT = """
You generate realistic workplace email scenario parameters for AI training data.
Output valid JSON only. No preamble. No explanation.

Generate a scenario with exactly these fields:
{
  "sender_role": "specific job title",
  "sender_email_domain": "realistic company domain",
  "recipient_role": "specific job title",
  "relationship": "c-suite_to_report|manager_to_ic|peer_to_peer|client_to_account|vendor_to_procurement|automated_to_user|unknown|team_broadcast",
  "industry": "tech_saas|consulting|finance_legal|marketing_agency|healthcare_enterprise|other",
  "email_type": "the category passed to you",
  "urgency": "critical|high|medium|low|noise",
  "has_attachment": true or false,
  "attachment_type": "contract|invoice|brief|report|presentation|none",
  "contains_scheduling_intent": true or false,
  "days_since_last_contact": 0 to 365,
  "thread_depth": 1 to 12,
  "company_context": "2-3 words describing what the company does"
}
"""


async def generate_scenario(client: AsyncAzureOpenAI, category: str) -> dict | None:
    try:
        response = await client.chat.completions.create(
            model=settings.azure_openai_deployment,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Generate a scenario for email type: {category}"}
            ],
            temperature=settings.temperature_scenario,
            response_format={"type": "json_object"}
        )
        scenario = json.loads(response.choices[0].message.content)
        scenario["email_type"] = category
        return scenario
    except Exception as e:
        print(f"Scenario generation failed: {e}")
        return None


async def generate_batch(
    count: int,
    category: str,
    client: AsyncAzureOpenAI,
    semaphore: asyncio.Semaphore
) -> list[dict]:
    async def _one():
        async with semaphore:
            return await generate_scenario(client, category)

    tasks = [_one() for _ in range(count)]
    results = await asyncio.gather(*tasks)
    return [r for r in results if r is not None]
