# Kross — Project Instructions

Kross is an AI-powered email and calendar web application. It wraps Gmail
and Outlook — it is NOT a standalone email service. Emails
display as chat-style conversations by default (like iMessage), with a
toggle to switch to classic email view. It includes AI-powered calendar
with Calendly-style scheduling, RAG-based natural language search, a
truly agentic AI layer, and a second brain layer for longitudinal
communication memory.

App meaning: Cross-connection of email applications with AI makes your
workflows easy.

---

## Behavioral Guidelines

### Think Before Coding

- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — do not pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what is confusing. Ask.

### Simplicity First

- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No flexibility or configurability that was not requested.
- If you write 200 lines and it could be 50, rewrite it.

### Surgical Changes

- Touch only what you must. Clean up only your own mess.
- Do not improve adjacent code, comments, or formatting.
- Do not refactor things that are not broken.
- Match existing style, even if you would do it differently.
- Every changed line should trace directly to the request.

### Goal-Driven Execution

Transform tasks into verifiable goals before implementing:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

---

## Tech Stack

### Frontend

- React + TypeScript + Tailwind CSS
- Design system: Intercom DESIGN.md (conversational UI, friendly blue palette)
- WebSocket client for real-time email push updates

### Backend — Microservices on AWS EKS

- Python + FastAPI for all services
- uv as package manager — dependencies declared in pyproject.toml per service
- Each service is an independent Docker container
- Kubernetes (EKS) for orchestration

### AI — Fine-tuned Gemma 4 + Agentic Layer

- Base model: Gemma 4 26B MoE via Ollama (self-hosted on AWS GPU nodes)
- Fine-tuning: LoRA adapter trained on email domain data (see Fine-tuning section)
- Embeddings: nomic-embed-text via Ollama
- No external AI API calls — all inference stays within AWS infra
- GPU node pool: AWS g5 instances, auto-scales based on SQS queue depth
- Agent framework: ReAct loop (Reason → Act → Observe) with tool registry
- Dynamic agent generation: users describe workflows in plain English,
  orchestrator generates and registers persistent agent specs at runtime

### Auth

- Native Google OAuth 2.0 (Google Cloud Console)
- Native Microsoft OAuth 2.0 (Azure AD / Microsoft Identity Platform)
- No Auth0 or third-party auth middleware
- First provider connected becomes the user's Kross identity
- OAuth tokens stored in AWS Secrets Manager — never in the database

### Databases

- AWS RDS Aurora PostgreSQL — primary data store
- pgvector extension on Aurora — vector storage for RAG (MVP)
- AWS ElastiCache Redis — sessions, caching, SQS result cache
- Migrate to AWS OpenSearch for RAG at scale

### Infrastructure

- AWS EKS (Kubernetes) — container orchestration
- AWS ECR — Docker image registry
- AWS S3 — file storage, large attachments
- AWS SQS — async job queues (email sync, AI processing, embeddings)
- AWS API Gateway — single entry point, routes to microservices
- AWS CloudFront + WAF — CDN and DDoS protection
- AWS KMS — encryption key management (envelope encryption)
- AWS Secrets Manager — OAuth tokens, API keys, credentials
- AWS CloudWatch + X-Ray — logs, tracing, alerts
- AWS CloudTrail — audit trail for all KMS and API operations
- Terraform — infrastructure as code

---

## Monorepo Structure

```
kross/
├── services/
│   ├── auth-service/          # OAuth flows, token management
│   │   ├── Dockerfile
│   │   ├── pyproject.toml     # uv dependencies
│   │   └── src/
│   │       └── main.py        # FastAPI app entrypoint
│   ├── sync-service/          # Webhook handlers, email fetching, normalization
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── src/
│   │       └── main.py
│   ├── ai-service/            # Gemma 4 LoRA via Ollama, agentic orchestrator
│   │   ├── Dockerfile         # includes Ollama + Gemma 4 + LoRA adapter
│   │   ├── pyproject.toml
│   │   └── src/
│   │       ├── main.py
│   │       ├── prompts/       # all system prompts live here, never inline
│   │       ├── agents/        # ReAct loop engine, tool registry, executor
│   │       └── tools/         # every Kross tool definition (email, cal, rag...)
│   ├── rag-service/           # Embedding pipeline, hybrid search, reranking
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── src/
│   │       └── main.py
│   ├── calendar-service/      # Google + Microsoft Calendar, scheduling links
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── src/
│   │       └── main.py
│   ├── file-service/          # S3 uploads, doc processing, video transcription
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── src/
│   │       └── main.py
│   └── notification-service/  # Follow-up reminders, meeting briefs, push
│       ├── Dockerfile
│       ├── pyproject.toml
│       └── src/
│           └── main.py
├── fine-tuning/               # LoRA training scripts, datasets, eval
│   ├── datasets/              # raw + synthetic training data
│   ├── train.py               # Unsloth + TRL training script
│   ├── eval.py                # evaluation against held-out email tasks
│   ├── pyproject.toml         # uv dependencies for training environment
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── inbox/         # Chat view, classic view, thread bubbles
│   │   │   ├── composer/      # Compose window, tone selector, attachments
│   │   │   ├── calendar/      # Calendar grid, scheduling links, meeting prep
│   │   │   ├── documents/     # Attachment viewer, doc Q&A panel
│   │   │   └── ai/            # AI sidebar, summaries, smart replies
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── gmail.ts
│   │   │   ├── outlook.ts
│   │   │   └── storage.ts
│   │   ├── store/
│   │   └── types/
│   └── Dockerfile
├── kubernetes/                # EKS Helm charts and manifests
├── terraform/                 # All AWS infrastructure as code
├── .github/
│   └── workflows/             # GitHub Actions CI/CD pipelines
└── docker-compose.yml         # Local dev — runs all services together
```

---

## Microservices

### Auth Service

- Handles Google and Microsoft OAuth 2.0 flows natively
- Stores and refreshes provider access tokens via AWS Secrets Manager
- Issues Kross session tokens (JWT, short-lived)
- First provider connected = user identity in Kross

### Sync Service (Observer Pattern)

- Receives webhooks from Gmail (Google Pub/Sub) and Outlook (MS Graph
  change notifications)
- Webhook handler does ONE thing only: validate signature → SQS → return 200
- Never do heavy processing in the webhook handler
- SQS event types: email.received, email.updated, email.deleted,
  thread.updated
- Auto-renewal cron job: renews Gmail subscriptions every 6 days
  (expire at 7), Outlook subscriptions every 2 days (expire at 3)
- Backfill job: on first account connect, paginate last 90 days of email
  history through the same SQS pipeline

### AI Service — Agentic Core

- Runs fine-tuned Gemma 4 26B MoE LoRA adapter via Ollama on GPU nodes
- Consumes from SQS AI job queue
- Contains the full agentic orchestrator (see Agentic AI Layer section)
- Reactive AI jobs: thread summarization, reply suggestions, priority
  scoring, noise detection, tone matching, follow-up detection, meeting
  prep briefs
- All system prompts in /src/prompts/ — never inline in handlers
- Every job has a timeout, a retry limit, and a fallback response
- Stream responses where latency matters (summaries, long replies)

### RAG Service

- Embedding pipeline: nomic-embed-text via Ollama
- Chunking: 500 token chunks, respects sentence/paragraph boundaries
- Storage: pgvector on Aurora (MVP) → OpenSearch (scale)
- Hybrid search: BM25 + semantic vector search combined via
  Reciprocal Rank Fusion (RRF) reranking
- All vectors namespaced by user_id — user data never mixed
- Index content: email body, subject lines, sender/recipient names,
  extracted attachment text, calendar event titles, contact memory notes
- Natural language query flow:
  1. Query processed by BM25 retrieval
  2. Query processed by semantic vector retrieval
  3. RRF combines and reranks both result sets
  4. Top chunks passed to Gemma 4 as context
  5. Gemma 4 generates natural language answer

### Calendar Service

- Reads and writes Google Calendar API and Microsoft Calendar API
- Calendly-style scheduling link generator (per user, configurable)
- Auto-scheduling detection: watches for "let's find a time" in threads
- Meeting prep brief: 10 min before a meeting, surfaces relevant email
  threads, shared docs, and last conversation with attendees
- Smart buffer management: learns user preferences for time between
  meetings

### File Service

- Large file uploads to S3, no size cap
- Chunked upload for files over 100MB
- Document text extraction (PDF, docx, xlsx)
- Video transcription via Whisper (self-hosted)
- Smart compression suggestions before sending

### Notification Service

- Follow-up reminders: if sent email gets no reply in X days,
  surface a drafted follow-up
- Meeting prep briefs: triggered 10 minutes before calendar events
- Real-time push to frontend via WebSocket

---

## Python + FastAPI Service Conventions

### Every service follows this structure

```
service-name/
├── Dockerfile
├── pyproject.toml          # uv-managed dependencies
├── uv.lock                 # committed lockfile — never edit manually
└── src/
    ├── main.py             # FastAPI app, router registration, lifespan
    ├── routers/            # one file per route group
    ├── models/             # Pydantic request/response models
    ├── services/           # business logic, never in routers
    ├── deps.py             # FastAPI dependency injection (db, auth, etc.)
    └── config.py           # settings loaded from env via pydantic-settings
```

### pyproject.toml reference (per service)

```toml
[project]
name = "kross-auth-service"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.30",
    "pydantic-settings>=2.0",
    "asyncpg>=0.29",
    "redis[hiredis]>=5.0",
    "boto3>=1.34",
    "httpx>=0.27",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

AI service additionally includes:

```toml
    "ollama>=0.3",
    "sentence-transformers>=3.0",
    "pgvector>=0.3",
    "rank-bm25>=0.2",
```

File service additionally includes:

```toml
    "pypdf>=4.0",
    "python-docx>=1.1",
    "openpyxl>=3.1",
    "openai-whisper>=20240930",
    "boto3>=1.34",
```

Fine-tuning environment:

```toml
    "unsloth>=2024.11",
    "trl>=0.12",
    "peft>=0.13",
    "datasets>=3.0",
    "transformers>=4.46",
    "torch>=2.4",
```

### FastAPI patterns to follow

- Use `async def` for all route handlers and service methods
- Use `lifespan` context manager for startup/shutdown (db pool, redis, ollama client)
- Use `pydantic-settings` for all config — no os.environ.get() scattered around
- Use dependency injection (`Depends`) for db sessions, auth, and shared clients
- Never put business logic directly in route handlers — always call a service function
- Use `asyncpg` connection pool, not SQLAlchemy ORM — keep queries explicit
- Background tasks via `BackgroundTasks` for lightweight work,
  SQS consumer workers for heavy async jobs

### Dockerfile pattern (multi-stage, uv-based)

```dockerfile
FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

FROM python:3.12-slim AS runtime
WORKDIR /app
COPY --from=builder /app/.venv .venv
COPY src/ src/
ENV PATH="/app/.venv/bin:$PATH"
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- Builder stage installs deps with uv into a venv
- Runtime stage copies only the venv and src — no build tools in production image
- Every image exposes /health for Kubernetes liveness probes

### SQS consumer pattern (for AI, RAG, sync workers)

Heavy async jobs are not handled by FastAPI routes. They run as separate
worker processes in the same container, consuming from SQS:

```python
# src/worker.py — runs alongside uvicorn in the same pod
async def consume():
    while True:
        messages = await sqs.receive_message(QueueUrl=QUEUE_URL, MaxNumberOfMessages=10)
        for msg in messages.get("Messages", []):
            await process(json.loads(msg["Body"]))
            await sqs.delete_message(ReceiptHandle=msg["ReceiptHandle"])
```

---

## Agentic AI Layer

### Architecture Overview

The AI service operates as a true agent, not a collection of isolated
functions. It uses a ReAct (Reason → Act → Observe) loop powered by the
fine-tuned Gemma 4 model.

```
Trigger (email / user request / schedule)
        ↓
Agent REASONS about the goal
        ↓
Agent ACTS by calling a tool from the tool registry
        ↓
Agent OBSERVES the tool result
        ↓
Loop until goal is complete or approval needed
        ↓
Output + human-in-the-loop queue (if irreversible)
```

### Two Levels of Agency

**Level 1 — Reactive agents (pre-coded workflows)**
Built-in agents for known Kross tasks. Each has defined tools, goals,
and success criteria:

- Email triage agent: reads inbox, categorizes, scores priority
- Reply drafting agent: reads thread context, drafts in correct tone
- Scheduling agent: detects scheduling intent, finds slots, sends invite
- Document agent: reads attachment, extracts actions, answers questions
- Follow-up agent: monitors sent mail, drafts follow-ups on silence
- Meeting prep agent: surfaces context 10 min before each event

**Level 2 — Dynamic agents (runtime generation)**
Users describe a workflow in plain English. The orchestrator generates
an agent spec, registers it as a persistent automation, and runs it
every time the trigger fires — without any code changes.

Examples of dynamic agents users can create:

- "When I get an email from a new vendor, research them and add a note"
- "When I receive an invoice, extract the amount and check against my PO"
- "If nobody replies to my email in 3 days, draft a follow-up for me"

Dynamic agent spec format:

```json
{
  "trigger": "email.received where body contains 'invoice'",
  "tools_needed": ["documents.extractInvoiceData", "rag.search"],
  "steps": [
    "extract invoice details from email",
    "search for matching PO in past emails",
    "compare amounts and flag discrepancy if found"
  ],
  "requires_approval": true
}
```

Dynamic agent specs are stored in Aurora under `user_agents` table and
loaded at runtime by the orchestrator.

### Tool Registry

Every Kross capability is exposed as a named tool the agent can call.
All tool definitions live in /src/tools/. Add new tools here to expand
agent capabilities without changing the orchestrator.

```
email tools:
  email.search(query, filters)
  email.read(thread_id)
  email.send(to, subject, body)        ← requires approval
  email.draft(to, subject, body, tone)
  email.label(thread_id, label)
  email.archive(thread_id)             ← requires approval

calendar tools:
  calendar.findSlot(contact, duration, preference)
  calendar.createEvent(title, time, attendees) ← requires approval
  calendar.getUpcoming(days)
  calendar.getContext(event_id)

document tools:
  documents.summarize(attachment_id)
  documents.extractActions(attachment_id)
  documents.compare(attachment_id_1, attachment_id_2)
  documents.ask(attachment_id, question)
  documents.extractInvoiceData(attachment_id)

rag tools:
  rag.search(query, filters)
  rag.getContactMemory(contact_email)
  rag.getThreadContext(thread_id)

contact tools:
  contacts.get(email)
  contacts.updateMemory(email, note)
  contacts.getSummary(email)

file tools:
  files.upload(content, filename)
  files.transcribeVideo(file_id)
  files.compress(file_id)
```

### Human-in-the-Loop

Some actions require explicit user approval before execution:

```
Autonomous (no approval needed):
  Summarizing, categorizing, labeling, drafting, reading, searching,
  calendar suggestions, contact memory updates

Requires approval:
  Sending an email, creating/deleting calendar events,
  archiving emails, any irreversible action

Always manual:
  Sending on behalf of user to external parties without showing
  the draft first
```

Approval requests are pushed to the frontend via WebSocket. The user
sees a card: "Kross wants to send this reply to Marcus — Approve / Edit
/ Reject". The agent waits in a paused state until resolved.

### Agent Execution Logs

Every ReAct step is logged to Aurora under `agent_logs` table:

- agent_id, user_id, trigger, step_number
- action (tool name + args)
- observation (tool result)
- reasoning (model's chain of thought)
- status (running / waiting_approval / complete / failed)
- created_at

This makes the agent fully auditable and debuggable.

---

## Fine-tuning Gemma 4 for Kross

### Why Fine-tune

Base Gemma 4 does not know Kross tool signatures, email-native output
schemas, or calendar scheduling language. Fine-tuning closes this gap
and makes the model significantly more reliable on domain tasks.

### Method: LoRA (Low-Rank Adaptation)

- Train a small adapter on top of frozen Gemma 4 base weights
- Adapter is swappable — update without full retraining
- Training stack: Unsloth + TRL (SFTTrainer) on a single A100 GPU
- Training location: RunPod or Lambda Labs GPU rental
- Output: LoRA adapter weights stored in S3, loaded by Ollama at runtime

### Training Data Strategy

Three types of training data, combined:

**1. Real email data (base understanding)**

- Enron Email Dataset (LLM-PBE processed):
  https://huggingface.co/datasets/LLM-PBE/enron-email
- Yale AESLC (email + subject line pairs, summarization):
  https://huggingface.co/datasets/Yale-LILY/aeslc
- Enron labeled email dataset (classification fine-tuned on LLaMA2,
  same approach applies to Gemma 4):
  https://huggingface.co/datasets/neelblabla/enron_labeled_email-llama2-7b_finetuning
- High-accuracy email classifier (12k emails, 6 categories, Apache 2.0):
  https://huggingface.co/datasets/jason23322/high-accuracy-email-classifier
- Email intent classification:
  https://huggingface.co/datasets/aadilsayad/email-intent-classification
- Enron email-reply pairs (Kaggle):
  https://www.kaggle.com/datasets/oanannv/enron-email-reply-dataset

**2. Agentic tool-use data (function calling)**

- Berkeley Function Calling Leaderboard (industry standard benchmark):
  https://huggingface.co/datasets/gorilla-llm/Berkeley-Function-Calling-Leaderboard
- Salesforce xLAM 60k (60k examples across 3,673 APIs, 21 categories):
  https://huggingface.co/datasets/Salesforce/xlam-function-calling-60k
- Trelis function calling extended (multi-turn tool use):
  https://huggingface.co/datasets/Trelis/function_calling_extended
- FunctionGemma reference (Google's own Gemma tool-use fine-tune,
  study the training approach — same base model):
  https://huggingface.co/google/functiongemma-270m-it

**3. Synthetic Kross-specific data (generated)**
No public dataset covers email + Kross tool signatures combined.
Generate ~3,000–5,000 examples using base Gemma 4 or GPT-4 as a
data generator, using Enron/AESLC emails as inputs:

Instruction tuning example:

```json
{
  "input": "Summarize this thread and extract action items:\n[email thread]",
  "output": "{\"summary\": \"...\", \"actions\": [...], \"priority\": \"high\"}"
}
```

Tool-use example:

```json
{
  "input": "Email: Can we meet Thursday at 2pm?\nAvailable tools: [calendar.findSlot]",
  "output": "[TOOL: calendar.findSlot({contact: \"sarah@...\", day: \"thursday\", time: \"14:00\", duration: 30})]"
}
```

DPO preference pair example:

```json
{
  "prompt": "Draft a reply declining this meeting request",
  "chosen": "Thanks for reaching out. Unfortunately I'm not available...",
  "rejected": "No I can't make it sorry"
}
```

Training data lives in /fine-tuning/datasets/. Keep raw, synthetic,
and DPO splits in separate files.

### LoRA Training Config (reference)

```python
# /fine-tuning/train.py
model = "google/gemma-4-27b-it"
lora_r = 16
lora_alpha = 32
lora_dropout = 0.05
target_modules = ["q_proj", "v_proj", "k_proj", "o_proj"]
max_seq_length = 4096
learning_rate = 2e-4
num_train_epochs = 3
per_device_train_batch_size = 4
gradient_accumulation_steps = 4
```

### Evaluation

After each training run, evaluate on a held-out set of email tasks:

- Tool call accuracy (did it call the right tool with right args?)
- Reply quality (tone match, length calibration)
- Summarization quality (ROUGE score vs human summaries)
- Priority classification accuracy (vs labeled Enron test set)

Run eval with: `python fine-tuning/eval.py --adapter s3://kross-models/lora-v{N}`

---

## Email Sync Architecture (Observer Pattern)

```
Gmail → Google Pub/Sub → /webhooks/gmail → validate → SQS
Outlook → MS Graph → /webhooks/outlook → validate → SQS

SQS consumers (sync-service):
  1. Fetch full email content via provider API
  2. Normalize to Kross Thread format
  3. Encrypt content via KMS (envelope encryption)
  4. Store in Aurora PostgreSQL
  5. Chunk + embed for RAG (SQS → rag-service)
  6. Run AI priority scoring (SQS → ai-service)
  7. Check agent triggers (SQS → ai-service orchestrator)
  8. Push real-time update to frontend via WebSocket
```

---

## Security & Encryption

### Envelope Encryption (AWS KMS)

- Every user has their own Customer Master Key (CMK) in AWS KMS
- Email content encrypted with per-user Data Encryption Key (DEK)
- DEK plaintext lives in memory only during encryption, then discarded
- Encrypted DEK stored alongside encrypted content in Aurora
- OAuth tokens in AWS Secrets Manager — never in the database
- TLS 1.3 everywhere in transit
- AES-256 at rest for all S3 objects and Aurora storage
- Zero-knowledge design: database breach alone cannot expose email content

### Network

- All services run in private VPC subnets
- Databases never directly internet-accessible
- API Gateway is the only public entry point
- Security groups: default-deny, only explicit allowlists
- CloudFront WAF on all public endpoints

### Access Control

- IAM least-privilege roles per service — no wildcard permissions
- OIDC federation for GitHub Actions → no long-lived AWS credentials
- Separate IAM roles for encryption vs decryption operations
- CloudTrail logs every KMS API call (audit trail for SOC2)

---

## GDPR + SOC2 Compliance

### GDPR

- Data residency: eu-west-1 for EU users, us-east-1 for US users
- Right to deletion: deleting a user triggers KMS CMK deletion,
  making all their data permanently unreadable
- No email content sent to any third-party API (Gemma 4 is self-hosted)
- Data Processing Agreement (DPA) with AWS is in place
- User data export endpoint required (download all my data)

### SOC2

- CloudTrail: all API and KMS operations logged, tamper-evident
- IAM: least-privilege enforced, quarterly access reviews
- Amazon Inspector: automated vulnerability scanning on Docker images
- AWS Macie: data classification on S3 buckets
- VPC: private subnets, no direct database internet access
- Monitoring: CloudWatch alarms on all critical service metrics

---

## Database Schema (Aurora PostgreSQL)

```sql
-- users
users (id, email, name, avatar_url, kross_identity_provider, created_at)

-- provider connections
account_connections (
  id, user_id, provider,
  encrypted_access_token, encrypted_refresh_token,
  token_expires_at, scopes, created_at
)

-- normalized email threads
threads (
  id, user_id, provider, provider_thread_id,
  subject, snippet, is_read, is_starred,
  priority_score, category,
  last_message_at, created_at
)

-- individual messages
messages (
  id, thread_id, user_id, provider_message_id,
  from_address, to_addresses, cc_addresses,
  encrypted_body, has_attachments, sent_at
)

-- RAG chunks
thread_chunks (
  id, thread_id, user_id,
  content,
  embedding vector(768),
  chunk_index, created_at
)

-- contact relationship memory
contact_memory (
  id, user_id, contact_email,
  summary,
  embedding vector(768),
  last_updated_at
)

-- attachments
attachments (
  id, message_id, user_id,
  filename, mime_type, s3_key,
  extracted_text,
  embedding vector(768),
  size_bytes, created_at
)

-- user-defined dynamic agents
user_agents (
  id, user_id, name, description,
  trigger_condition,
  tools_needed jsonb,
  steps jsonb,
  requires_approval boolean,
  is_active boolean,
  created_at, last_run_at
)

-- agent execution logs
agent_logs (
  id, agent_id, user_id,
  trigger, step_number,
  action jsonb,
  observation jsonb,
  reasoning text,
  status,
  created_at
)

-- human-in-the-loop approval queue
approval_queue (
  id, agent_log_id, user_id,
  action_type, action_payload jsonb,
  status,
  created_at, resolved_at
)
```

---

## CI/CD Pipeline (GitHub Actions)

### Branch Strategy

```
main        → production (manual approval gate)
staging     → staging environment (auto deploy)
feature/*   → runs tests only, no deploy
```

### Pipeline Steps

```
Push to GitHub
    ↓
GitHub Actions triggers
    ↓
1. Run unit + integration tests
2. Security scan (Trivy on Docker images)
3. Build Docker image (multi-stage — build separate from runtime)
4. Push to AWS ECR (tagged with git SHA + semver)
5. Deploy to staging via Helm (auto)
6. Manual approval gate
7. Deploy to production via Helm
8. CloudWatch alarm check post-deploy
9. Auto-rollback if error rate spikes
```

### Auth

- OIDC federation: GitHub Actions assumes IAM role temporarily
- No long-lived AWS credentials stored as GitHub secrets ever

---

## Environment Variables

```
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_PUBSUB_TOPIC=

# Microsoft OAuth
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=

# AWS
AWS_REGION=
AWS_KMS_KEY_ARN=
AWS_S3_BUCKET=
AWS_SQS_SYNC_QUEUE_URL=
AWS_SQS_AI_QUEUE_URL=
AWS_SQS_RAG_QUEUE_URL=

# Database
DATABASE_URL=
REDIS_URL=

# AI
OLLAMA_BASE_URL=
GEMMA_MODEL=gemma4:26b
GEMMA_LORA_ADAPTER=s3://kross-models/lora-latest
EMBED_MODEL=nomic-embed-text

# App
JWT_SECRET=
WEBHOOK_SECRET_GMAIL=
WEBHOOK_SECRET_OUTLOOK=
```

All values stored in AWS Secrets Manager. Never hardcoded. Never committed.

---

## Features Build Order

### Phase 1 — Foundation

1. Native Google OAuth flow (connect Gmail)
2. Native Microsoft OAuth flow (connect Outlook)
3. Gmail webhook (Google Pub/Sub) + SQS pipeline
4. Outlook webhook (MS Graph change notifications) + SQS pipeline
5. Email normalization to unified Thread type
6. Unified inbox — chat-style view
7. Classic email list view + toggle
8. Account backfill job (90 days on first connect)

### Phase 2 — AI Layer (base Gemma 4, no fine-tune yet)

9. Gemma 4 setup via Ollama on GPU nodes
10. Thread summarization
11. Priority scoring + smart categorization
12. Reply suggestions (direct / friendly / diplomatic)
13. Tone matching per contact
14. Follow-up reminder detection
15. Noise detection + auto-cleanup

### Phase 3 — RAG + Search

16. nomic-embed-text embedding pipeline
17. pgvector setup on Aurora
18. BM25 full text index
19. Hybrid search (BM25 + semantic + RRF reranking)
20. Natural language search UI
21. Contact relationship memory
22. Second brain queries ("what did I agree to with X?")

### Phase 4 — Agentic Layer

23. Tool registry implementation (all tools defined + tested)
24. ReAct loop engine
25. Human-in-the-loop approval queue
26. Built-in reactive agents (triage, reply, schedule, follow-up)
27. Dynamic agent spec generator
28. User-facing automation builder UI ("create a new agent")
29. Agent execution logs + audit UI

### Phase 4.5 — Fine-tuning

30. Collect and clean training data (Enron + AESLC + synthetic)
31. Generate synthetic Kross tool-use examples (~3k pairs)
32. LoRA training run (Unsloth + TRL)
33. Evaluate against held-out email task set
34. Deploy LoRA adapter, swap into Ollama, A/B test vs base model
35. Iterate on training data based on failure cases

### Phase 5 — Calendar

36. Google Calendar sync
37. Microsoft Calendar sync
38. Calendly-style scheduling link generator
39. Auto-scheduling detection from email
40. Meeting prep brief
41. Smart buffer management

### Phase 6 — Documents & Files

42. Inline attachment preview (PDF, docx)
43. Document summarization
44. Chat Q&A against attachments
45. Large file transfers via S3
46. Video transcription (Whisper)

---

## Key Conventions

### Never Do This

- Never call Gmail API or Microsoft Graph directly from frontend
- Never store OAuth tokens or secrets in the database as plaintext
- Never do heavy processing inside a webhook handler
- Never send email content to an external AI API
- Never use wildcard IAM permissions
- Never commit credentials or secrets to the repo
- Never build a standalone SMTP email server
- Never add features outside the current phase without asking first
- Never abstract a utility until it is used in at least two places
- Never let an agent execute an irreversible action without approval
- Never use os.environ.get() directly — always use pydantic-settings config
- Never put business logic in FastAPI route handlers — use service functions
- Never use synchronous blocking calls in async route handlers
- Never edit uv.lock manually — always use uv add / uv sync

### Always Do This

- Normalize all provider email data to the shared Thread Pydantic model
  before touching any UI or business logic
- Every webhook handler: validate signature → SQS → return 200
- Every AI call: loading state + error fallback
- Every agent action: log to agent_logs before and after execution
- Every feature: works across all connected providers, not just Gmail
- Every Docker image: multi-stage uv build, no FROM python:3.12 fat image
- Every service: has a health check at GET /health returning {"status": "ok"}
- Every tool in the tool registry: has unit tests with mock responses
- Every async route: uses async def and awaits all I/O
- Add new dependencies with uv add, never pip install

### UI Conventions

- Chat bubbles: sent right-aligned, received left-aligned (iMessage)
- Account indicator: Gmail / Outlook icon on every thread
- AI panel: collapsible right sidebar, never blocks main thread view
- Toggle: chat view ↔ classic view, state persists to localStorage
- Agent approval cards: appear inline in the inbox, not as popups
- All layouts must not break below 768px viewport width

---

## Definition of Done (per feature)

- Works across all connected accounts (Gmail + Outlook)
- Has a loading state
- Has an error state with user-friendly message
- Does not break existing features
- All email content encrypted at rest via KMS
- No provider data leaks between users
- Mobile-responsive (does not break below 768px)
- Service has a passing health check
- Agent actions are logged and auditable
