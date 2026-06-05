# Kross — Fine-Tuning Dataset Pipeline

Reference document for the Gemma 4 LoRA fine-tuning pipeline.
All statistics sourced and verified June 2026.

---

## Why Fine-Tune

Base Gemma 4 does not know Kross tool signatures, output schemas, or email-domain
behaviour. Fine-tuning using LoRA trains a small adapter on top of frozen base weights.
The base model is unchanged. Only the adapter learns Kross-specific behaviour.
Training cost is low. The adapter is swappable without full retraining.

Problems with base model on email tasks:

- Writes replies in generic uniform tone regardless of contact relationship
- Does not know Kross output schemas (JSON priority scores, action item arrays, tool calls)
- Hallucinates email details — inventing names, dates, attachments not in the thread
- Cannot distinguish a 97-priority CEO escalation from a 4-priority SaaS newsletter
- Has no concept of Kross tools like calendar.findSlot() or documents.summarize()

---

## Email Landscape — Research Basis for Dataset Distribution

| Statistic                                             | Number           | Source                                  |
| ----------------------------------------------------- | ---------------- | --------------------------------------- |
| Average emails received per day (knowledge worker)    | 121 emails/day   | cloudHQ Workplace Email Statistics 2025 |
| Average emails received per day (Microsoft telemetry) | 117 emails/day   | Microsoft Work Trend Index 2025         |
| Percentage of workweek spent on email                 | 28% (~11.2 hrs)  | McKinsey Global Institute               |
| Times per hour the average employee checks email      | 11-36 times/hour | cloudHQ 2025                            |
| Emails sent globally per day in 2025                  | 376.4 billion    | Radicati Group / Statista 2025          |
| Emails that require no action from recipient          | 88%              | Unboxd Analysis 2026                    |
| Emails containing actual action items                 | 12%              | Unboxd Analysis 2026                    |
| Time to refocus after an email interruption           | 23 min 15 sec    | Dr. Gloria Mark, UC Irvine              |

### Real Inbox Composition (basis for category distribution)

| Email Category                                 | % of Inbox | Requires Action | Kross Feature                    |
| ---------------------------------------------- | ---------- | --------------- | -------------------------------- |
| Newsletters / marketing / promotions           | ~35%       | No — Noise      | Noise detection                  |
| Automated notifications (GitHub, Stripe, SaaS) | ~20%       | No — FYI        | Noise / FYI categorization       |
| Internal team updates, CC chains               | ~15%       | Rarely — FYI    | Smart categorization             |
| Client / external communications               | ~12%       | Yes             | Priority scoring, reply drafting |
| Meeting requests and scheduling                | ~8%        | Yes             | Scheduling agent                 |
| Documents needing review                       | ~5%        | Yes             | Document agent                   |
| Follow-ups and pending approvals               | ~3%        | Yes             | Follow-up agent                  |
| Direct 1:1 critical communications             | ~2%        | Yes — Critical  | Top priority scoring             |

---

## Dataset Size — 25,000 Examples

| Size    | What It Achieves                                                     | Verdict    |
| ------- | -------------------------------------------------------------------- | ---------- |
| 5,000   | Learns basic patterns. High variance. Inconsistent on edge cases.    | Too small  |
| 10,000  | Decent baseline. Struggles with nuanced tone and edge cases.         | Borderline |
| 25,000  | Solid domain understanding. Handles tone, tools, nuance, edge cases. | Target     |
| 50,000+ | Production grade. Handles rare edge cases reliably.                  | v2 goal    |

Kross handles simultaneous tasks: priority scoring, thread summarization, reply tone
matching, tool call generation, scheduling intent detection, document agent triggers,
and follow-up detection. Each task needs sufficient representation. At 25,000 examples
each major task gets 1,500–5,500 examples.

---

## Full Distribution — 25,000 Examples

### Primary Category Distribution

| #   | Category                              | Count | %   | Notes                                                                             |
| --- | ------------------------------------- | ----- | --- | --------------------------------------------------------------------------------- |
| 1   | Noise & newsletters                   | 5,500 | 22% | SaaS updates, LinkedIn digests, promo emails, auto-receipts, GitHub notifications |
| 2   | FYI / internal updates                | 3,500 | 14% | Team announcements, all-hands notes, CC chains                                    |
| 3   | Action required — internal            | 2,500 | 10% | Manager requests, code reviews, PR approvals                                      |
| 4   | Action required — external            | 2,500 | 10% | Client requests, vendor proposals, partner asks                                   |
| 5   | Meeting & scheduling                  | 2,500 | 10% | "Let's find a time", invites, reschedule requests                                 |
| 6   | Document threads                      | 2,000 | 8%  | Emails with PDF/docx/xlsx. Contracts, invoices                                    |
| 7   | Follow-up scenarios                   | 2,000 | 8%  | Sent emails with no reply                                                         |
| 8   | Client / external comms               | 1,500 | 6%  | Relationship-sensitive, tone matching critical                                    |
| 9   | Multi-turn long threads (5+ messages) | 1,500 | 6%  | Thread summarization quality training                                             |
| 10  | Escalations & urgent                  | 1,000 | 4%  | CEO escalations, client complaints, outages                                       |
| 11  | Tool-use / agentic tasks              | 1,500 | 6%  | Input is email, output is a Kross tool call                                       |
| 12  | Ambiguous / edge cases                | 500   | 2%  | Teaches uncertainty rather than confident guessing                                |

### Output Task Distribution

| Output Task                     | N Examples    | Primary Categories              |
| ------------------------------- | ------------- | ------------------------------- |
| Priority score + category label | 25,000 (100%) | All — mandatory                 |
| Thread summary                  | 18,000 (72%)  | All except pure noise           |
| Reply suggestions (3 tones)     | 15,000 (60%)  | Action + client + follow-up     |
| Tool call generation            | 4,500 (18%)   | Scheduling + document + agentic |
| Action item extraction          | 8,000 (32%)   | Action + document + escalation  |
| Follow-up draft generation      | 3,500 (14%)   | Follow-up + some action         |
| Scheduling intent detection     | 4,000 (16%)   | Meeting + some action           |
| Document trigger detection      | 3,500 (14%)   | Document + some action          |
| Tone classification of sender   | 20,000 (80%)  | All except noise and FYI        |

### Industry Distribution

| Industry                           | %   | Count |
| ---------------------------------- | --- | ----- |
| Tech / SaaS startups               | 30% | 7,500 |
| Consulting / professional services | 20% | 5,000 |
| Finance / legal                    | 20% | 5,000 |
| Marketing / agencies               | 15% | 3,750 |
| Healthcare / enterprise            | 10% | 2,500 |
| Other / general                    | 5%  | 1,250 |

### Sender-Recipient Persona Distribution

| Relationship Type         | %   | Count | Priority Implication                 |
| ------------------------- | --- | ----- | ------------------------------------ |
| C-suite to direct report  | 8%  | 2,000 | High priority by default (70-100)    |
| Manager to IC             | 12% | 3,000 | Action required, medium-high         |
| Peer to peer              | 18% | 4,500 | Collaborative, medium (40-70)        |
| Client to account manager | 15% | 3,750 | External, high stakes                |
| Vendor to procurement     | 10% | 2,500 | Proposals, invoices, lower urgency   |
| Automated system to user  | 20% | 5,000 | Noise / notification (0-20 priority) |
| Unknown sender            | 7%  | 1,750 | Spam detection                       |
| Internal team broadcast   | 10% | 2,500 | FYI, rarely requires action          |

### Thread Depth Distribution

| Depth         | %   | Count  | Purpose                                  |
| ------------- | --- | ------ | ---------------------------------------- |
| Single email  | 40% | 10,000 | Triage, priority scoring, reply drafting |
| 2-3 messages  | 30% | 7,500  | Basic back-and-forth, context awareness  |
| 4-6 messages  | 20% | 5,000  | Summarization of moderate threads        |
| 7-12 messages | 8%  | 2,000  | Complex summarization                    |
| 13+ messages  | 2%  | 500    | Extreme cases, reply-all chains          |

---

## Priority Scoring Schema

Every email gets a score 0-100. This schema must be consistent across all 25,000
training examples. Priority is NOT just urgency keywords — relationship context,
sender history, and content together determine the score.

| Score  | Label    | Definition                                                      | Examples                                                         |
| ------ | -------- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| 90-100 | CRITICAL | Immediate attention. Time sensitive. High stakes sender.        | CEO direct, client escalation, production outage, legal notice   |
| 70-89  | HIGH     | Same-day response. Clear action needed. Known important sender. | Manager request with deadline, client question, contract to sign |
| 50-69  | MEDIUM   | Response within 24-48 hours. Moderate stakes.                   | Peer collaboration, non-urgent client update, vendor proposal    |
| 30-49  | LOW      | Response optional. FYI with minor action.                       | FYI from known contact, internal announcement                    |
| 10-29  | NOISE    | No action required. Can be archived.                            | Newsletter, automated notification, digest                       |
| 0-9    | SPAM     | Unsubscribe or mark spam. No value.                             | Marketing spam, cold outreach                                    |

Key rule: "Quick question" from your CEO scores 95.
Same subject from unknown sender scores 20.

---

## Synthetic Data Generation Pipeline

### Four Agent Architecture

| Agent                       | Input                   | Output                                                         | Temp |
| --------------------------- | ----------------------- | -------------------------------------------------------------- | ---- |
| Agent 1: Scenario Generator | Category parameters     | JSON scenario (sender role, urgency, industry)                 | 0.9  |
| Agent 2: Email Generator    | Scenario JSON           | Full email thread with body text + attachment metadata         | 0.85 |
| Agent 3: Label Generator    | Email thread JSON       | Priority, category, summary, replies, tool calls, action items | 0.2  |
| Agent 4: Quality Filter     | Email + labels combined | Pass/fail verdict with specific issue flags                    | 0.1  |

### Cost Breakdown — 25,000 Examples (Azure OpenAI GPT-4o mini)

| Step                                | Calls       | Tokens     | Cost        |
| ----------------------------------- | ----------- | ---------- | ----------- |
| Agent 1: Scenario generation        | 25,000      | 5M         | ~$0.10      |
| Agent 2: Email generation           | 25,000      | 22.5M      | ~$18.00     |
| Agent 3: Label generation           | 25,000      | 12.5M      | ~$9.50      |
| Agent 4: Quality filtering          | 25,000      | 7.5M       | ~$5.70      |
| Regeneration buffer (15% rejection) | 3,750       | 2.6M       | ~$5.00      |
| **TOTAL**                           | **~78,750** | **~50.1M** | **~$38.30** |

$1,000 Azure credit covers this dataset 26 times.
Recommended: generate 3 versions at temperature 0.7, 0.85, 1.0. Merge the best examples.

### Quality Filter Rejection Rules (expect 15% rejection rate)

- Priority score does not match the actual urgency and sender relationship
- Summary contains information not present in the thread (hallucination)
- Suggested replies are generic — identical across different email types
- Category label is incorrect given the email content
- Email body reads as obviously AI-generated — too formal, too perfect
- Action items are invented and not extractable from the email text
- Tool calls reference tools not in the Kross tool registry
- Thread depth does not match the specified scenario parameters

### Negative Examples — 1,000 Additional Cases

Teach the model when NOT to make confident outputs.

| Case Type                                 | Count | Teaches                            |
| ----------------------------------------- | ----- | ---------------------------------- |
| Email in foreign language with no context | 150   | Output low confidence              |
| Only image attachment, no body text       | 150   | Trigger document agent only        |
| Completely empty email body               | 100   | Output: insufficient content       |
| Single word subject, no body              | 100   | Output: ambiguous, request context |
| Forwarded chain with no new message       | 150   | Summarize forwarded content only   |
| Out-of-office auto-reply                  | 150   | Mark automated, no action          |
| Truly ambiguous action vs FYI             | 200   | Medium confidence, flag for review |

---

## Real Data Sources

### Email Datasets

| Dataset                              | Size Used       | License      | HuggingFace URL                                                             |
| ------------------------------------ | --------------- | ------------ | --------------------------------------------------------------------------- |
| Enron Email Dataset (LLM-PBE)        | ~5,000 examples | Research use | huggingface.co/datasets/LLM-PBE/enron-email                                 |
| Yale AESLC                           | ~3,000 examples | Open         | huggingface.co/datasets/Yale-LILY/aeslc                                     |
| Enron labeled (LLaMA2 fine-tune)     | ~2,000 examples | Research use | huggingface.co/datasets/neelblabla/enron_labeled_email-llama2-7b_finetuning |
| High-accuracy email classifier (12K) | ~2,000 examples | Apache 2.0   | huggingface.co/datasets/jason23322/high-accuracy-email-classifier           |
| Email intent classification          | ~1,500 examples | Open         | huggingface.co/datasets/aadilsayad/email-intent-classification              |
| Enron email-reply pairs (Kaggle)     | ~2,000 examples | Research use | kaggle.com/datasets/oanannv/enron-email-reply-dataset                       |

### Tool-Use / Agentic Datasets

| Dataset                               | URL                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------- |
| Berkeley Function Calling Leaderboard | huggingface.co/datasets/gorilla-llm/Berkeley-Function-Calling-Leaderboard |
| Salesforce xLAM 60k                   | huggingface.co/datasets/Salesforce/xlam-function-calling-60k              |
| Trelis function calling extended      | huggingface.co/datasets/Trelis/function_calling_extended                  |
| Google FunctionGemma (reference)      | huggingface.co/google/functiongemma-270m-it                               |

### Final Mix Ratios

| Source                               | Examples | %            |
| ------------------------------------ | -------- | ------------ |
| Synthetic — generated by pipeline    | 17,500   | 70%          |
| Real — Enron, AESLC, public datasets | 7,500    | 30%          |
| Negative examples (separate pass)    | 1,000    | added on top |

70% synthetic teaches Kross-specific schemas and output formats.
30% real grounds the model in realistic email language — messiness, typos, abbreviations.

---

## File Structure

```
fine-tuning/
├── pipeline/
│   ├── config.py
│   ├── run.py                      ← orchestrator, entry point
│   ├── normalisers/
│   │   ├── base.py                 ← Thread schema + quality gate
│   │   ├── enron.py
│   │   ├── aeslc.py
│   │   ├── classifier.py
│   │   └── intent.py
│   └── agents/
│       ├── scenario.py             ← Agent 1
│       ├── email_gen.py            ← Agent 2
│       ├── labeler.py              ← Agent 3
│       └── quality.py             ← Agent 4
├── datasets/                       ← gitignored, all data here
│   ├── raw/                        ← Agent 1 output
│   ├── generated/                  ← Agent 2 output
│   ├── labeled/                    ← Agent 3 output + checkpoints
│   ├── filtered/                   ← quality-filtered, train/val/test split
│   ├── real/                       ← normalised real datasets
│   └── final/
│       ├── train_combined.jsonl    ← 20,000 examples (80%)
│       ├── validation_combined.jsonl ← 2,500 examples (10%)
│       └── test_combined.jsonl     ← 2,500 examples (10%) — never seen during training
├── train.py                        ← Unsloth + TRL
├── eval.py                         ← evaluation against test set
└── pyproject.toml                  ← uv dependencies
```

Split rule: 80% train / 10% validation / 10% test.
Shuffle before splitting so category distribution is even.
Never use test set during training or hyperparameter tuning.

---

## LoRA Training Configuration

| Parameter                   | Value                          | Notes                                      |
| --------------------------- | ------------------------------ | ------------------------------------------ |
| Base model                  | google/gemma-4-27b-it          | Instruction-tuned variant                  |
| Training framework          | Unsloth + TRL SFTTrainer       | 2x faster, 50% less VRAM                   |
| lora_r                      | 16                             | Rank of LoRA matrices                      |
| lora_alpha                  | 32                             | Scaling factor (convention: 2x lora_r)     |
| lora_dropout                | 0.05                           | Regularization                             |
| target_modules              | q_proj, v_proj, k_proj, o_proj | Attention layers                           |
| max_seq_length              | 4096                           | Increase to 8192 for multi-turn threads    |
| learning_rate               | 2e-4                           | Standard for LoRA fine-tuning              |
| num_train_epochs            | 3                              | Monitor validation loss — stop if it rises |
| per_device_train_batch_size | 4                              | For A100 40GB                              |
| gradient_accumulation_steps | 4                              | Effective batch size = 16                  |
| GPU                         | A100 40GB (Azure NC series)    | Covered by Azure Founders Hub credits      |
| Estimated training time     | 8-14 hours                     | 25,000 examples, 3 epochs, seq 4096        |

---

## Evaluation Metrics

| Metric                           | Target    | What It Tests                                 |
| -------------------------------- | --------- | --------------------------------------------- |
| Tool call accuracy (exact match) | >85%      | Right tool, correct argument structure        |
| Priority score MAE               | <8 points | How far off from ground truth on average      |
| Category accuracy                | >90%      | action/waiting/FYI/noise label correct        |
| Summary ROUGE-L                  | >0.42     | Summary captures key points                   |
| Reply tone accuracy (3-class)    | >88%      | Direct/friendly/diplomatic correctly assigned |
| Scheduling intent detection F1   | >0.92     | Correctly detected, no false triggers         |
| Action item precision            | >0.80     | Extracted items actually present in email     |

---

## Running the Pipeline

```bash
cd fine-tuning

# Normalise and label all real datasets
uv run python -m pipeline.run --mode real

# Label existing synthetic emails
uv run python -m pipeline.run --mode label

# Merge everything into final training files
uv run python -m pipeline.run --mode merge

# Run everything end to end
uv run python -m pipeline.run --mode all
```

Each step saves checkpoints — safe to stop and resume without re-running API calls.

---

## Kross Tool Registry

Agent 3 (Label Generator) must only generate tool calls from this list.
Any tool call referencing a tool not here must be rejected by Agent 4.

```
email.search(query, filters)          → Thread[]         — RAG/Search
email.read(thread_id)                 → Thread           — Core
email.send(to, subject, body)         → MessageID        — REQUIRES APPROVAL
email.draft(to, subject, body, tone)  → DraftID          — Core
email.label(thread_id, label)         → bool             — Core
email.archive(thread_id)              → bool             — REQUIRES APPROVAL

calendar.findSlot(contact, duration, preference)  → SlotList   — Calendar
calendar.createEvent(title, time, attendees)      → EventID    — REQUIRES APPROVAL
calendar.getUpcoming(days)                        → EventList  — Calendar
calendar.getContext(event_id)                     → EventContext

documents.summarize(attachment_id)               → Summary     — Document
documents.extractActions(attachment_id)          → ActionList  — Document
documents.compare(attachment_id_1, _2)           → DiffSummary — Document
documents.ask(attachment_id, question)           → Answer      — Document

rag.search(query, filters)            → ChunkList        — RAG
rag.getContactMemory(contact_email)   → MemorySummary    — RAG
rag.getThreadContext(thread_id)       → ContextSummary   — RAG

contacts.get(email)                   → Contact          — Contacts
contacts.updateMemory(email, note)    → bool             — Contacts
contacts.getSummary(email)            → RelationshipSummary

files.upload(content, filename)       → FileID           — Files
files.transcribeVideo(file_id)        → Transcript       — Files
files.compress(file_id)               → CompressedFileID — Files
```

---

## Data Normalisation — Unified Thread Schema

All real datasets must be normalised into this schema before labeling.
Synthetic data is generated directly into this schema.
This is what makes Agent 3 work identically for both sources.

```python
class Message(BaseModel):
    from_name: str
    from_email: str
    to_name: str
    to_email: str
    body: str
    timestamp: str = ""

class Thread(BaseModel):
    thread_id: str          # e.g. "enron_a3f9b2c1"
    source: str             # "enron" | "aeslc" | "synthetic"
    subject: str
    messages: list[Message]
    has_attachment: bool = False
    attachment_summary: str | None = None
    thread_depth: int = 1
    industry_hint: str | None = None
    hint_category: str | None = None  # from pre-labeled datasets
```

### Quality Gate (run before any thread reaches Agent 3)

Reject if:

- Body < 50 characters
- Body > 8,000 characters
- Empty subject
- Non-ASCII ratio > 15% (likely foreign language)
- Forwarding artifact only (starts with `>`, < 200 chars)
- Legal footer dominates (2+ confidentiality keywords, < 300 chars body)

---

## Sources

- McKinsey Global Institute. The Social Economy. July 2012. mckinsey.com
- Microsoft Work Trend Index 2025. microsoft.com/en-us/worklab/work-trend-index
- cloudHQ Workplace Email Statistics 2025. blog.cloudhq.net/workplace-email-statistics
- Radicati Group Email Statistics Report 2024-2028. radicati.com
- Mailbird 2024 Survey of 250+ Professionals. getmailbird.com/email-overload-survey
- Unboxd Email Statistics 2026. unboxd.ai/blog/email-statistics.html
- Readless Email Overload Statistics 2026. readless.app/blog/email-overload-statistics
- Dr. Gloria Mark, UC Irvine. Cost of Interrupted Work. CHI 2008.
- SellCell Most Popular Email Providers 2026. sellcell.com
- ElectroIQ Gmail Statistics 2026. electroiq.com/stats/gmail-statistics
- Clean Email Blog AI Productivity Report May 2026. clean.email/blog/insights/email-productivity-statistics-report
- Grand View Research AI Email Management Market 2026. grandviewresearch.com
- Salesforce State of Marketing 2025. salesforce.com
- Microsoft Copilot Pilot Study 2025. microsoft.com/en-us/worklab
