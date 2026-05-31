Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

# Kross — Project Instructions

Kross is an AI-powered email and calendar web application. It wraps Gmail
and Outlook — it is NOT a standalone email service. Emails display as
chat-style conversations by default (like iMessage), with a toggle to
switch to classic email view. It includes AI-powered calendar with
Calendly-style scheduling, RAG-based natural language search, and a
second brain layer for longitudinal communication memory.

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

- Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui
- Design system: pluggable theme tokens in `globals.css` (Obsidian dark default;
  Intercom-blue optional later via `data-theme`). Tokens are the only color source.
- WebSocket client for real-time email push updates

### Backend — Microservices on AWS EKS

- Node.js + TypeScript for all services
- Each service is an independent Docker container
- Kubernetes (EKS) for orchestration

### AI

- Model: Gemma 4 26B MoE via Ollama (self-hosted on AWS GPU nodes)
- Embeddings: nomic-embed-text via Ollama
- No external AI API calls — all inference stays within AWS infra
- GPU node pool: AWS g5 instances, auto-scales based on SQS queue depth

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
│   │   └── src/
│   ├── sync-service/          # Webhook handlers, email fetching, normalization
│   │   ├── Dockerfile
│   │   └── src/
│   ├── ai-service/            # Gemma 4 via Ollama, summarization, replies
│   │   ├── Dockerfile         # includes Ollama + Gemma 4
│   │   └── src/
│   ├── rag-service/           # Embedding pipeline, hybrid search, reranking
│   │   ├── Dockerfile
│   │   └── src/
│   ├── calendar-service/      # Google + Microsoft Calendar, scheduling links
│   │   ├── Dockerfile
│   │   └── src/
│   ├── file-service/          # S3 uploads, doc processing, video transcription
│   │   ├── Dockerfile
│   │   └── src/
│   └── notification-service/  # Follow-up reminders, meeting briefs, push
│       ├── Dockerfile
│       └── src/
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

- Receives webhooks from Gmail (Google Pub/Sub) and Outlook (MS Graph change notifications)
- Webhook handler does ONE thing only: validate signature → publish to SQS → return 200
- Never do heavy processing in the webhook handler
- SQS event types: email.received, email.updated, email.deleted, thread.updated
- Auto-renewal cron job: renews Gmail subscriptions every 6 days (expire at 7),
  Outlook subscriptions every 2 days (expire at 3)
- Backfill job: on first account connect, paginate last 90 days of email history
  through the same SQS pipeline

### AI Service

- Runs Gemma 4 26B MoE via Ollama on GPU node pool
- Consumes from SQS AI job queue
- Jobs: thread summarization, reply suggestions, priority scoring,
  noise detection, tone matching, follow-up detection, meeting prep briefs
- All system prompts live in /src/prompts/ — never inline in handlers
- Every job has a timeout, a retry limit, and a fallback response
- Stream responses where latency matters (summaries, long replies)

### RAG Service

- Embedding pipeline: nomic-embed-text via Ollama
- Chunking: 500 token chunks, respects sentence/paragraph boundaries
- Storage: pgvector on Aurora (MVP) → OpenSearch (scale)
- Hybrid search: BM25 + semantic vector search combined via
  Reciprocal Rank Fusion (RRF) reranking
- All vectors are namespaced by user_id — user data is never mixed
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
- Auto-scheduling detection: watches for "let's find a time" in email threads
- Meeting prep brief: 10 minutes before a meeting, surfaces relevant email
  threads, shared docs, and last conversation with attendees
- Smart buffer management: learns user preferences for time between meetings

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

## Email Sync Architecture (Observer Pattern Detail)

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
  7. Push real-time update to frontend via WebSocket
```

---

## Security & Encryption

### Envelope Encryption (AWS KMS)

- Every user has their own Customer Master Key (CMK) in AWS KMS
- Email content encrypted with per-user Data Encryption Key (DEK)
- DEK plaintext lives in memory only during encryption, then discarded
- Encrypted DEK stored alongside encrypted content in Aurora
- OAuth tokens in AWS Secrets Manager — never in the database as plaintext
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
  stored as secrets
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
- Amazon Inspector: automated vulnerability scanning on all Docker images
- AWS Macie: data classification on S3 buckets
- VPC: private subnets, no direct database internet access
- Monitoring: CloudWatch alarms on all critical service metrics

---

## RAG Database Schema (Aurora PostgreSQL)

```sql
-- users
users (id, email, name, avatar_url, kross_identity_provider, created_at)

-- provider connections
account_connections (
  id, user_id, provider,        -- provider: gmail | outlook
  encrypted_access_token,
  encrypted_refresh_token,
  token_expires_at, scopes, created_at
)

-- normalized email threads
threads (
  id, user_id, provider, provider_thread_id,
  subject, snippet, is_read, is_starred,
  priority_score, category,     -- category: action|waiting|fyi|noise
  last_message_at, created_at
)

-- individual messages within threads
messages (
  id, thread_id, user_id, provider_message_id,
  from_address, to_addresses, cc_addresses,
  encrypted_body, has_attachments, sent_at
)

-- RAG chunks for hybrid search
thread_chunks (
  id, thread_id, user_id,
  content,                      -- plaintext chunk
  embedding vector(768),        -- nomic-embed-text output
  chunk_index, created_at
  -- BM25 full text index on content column
)

-- contact relationship memory
contact_memory (
  id, user_id, contact_email,
  summary,                      -- plain text relationship summary
  embedding vector(768),        -- for semantic memory search
  last_updated_at
)

-- attachments
attachments (
  id, message_id, user_id,
  filename, mime_type, s3_key,
  extracted_text,               -- for doc Q&A
  embedding vector(768),
  size_bytes, created_at
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
3. Build Docker image (multi-stage — build stage separate from runtime)
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

### Phase 2 — AI Layer

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

### Phase 4 — Calendar

23. Google Calendar sync
24. Microsoft Calendar sync
25. Calendly-style scheduling link generator
26. Auto-scheduling detection from email
27. Meeting prep brief
28. Smart buffer management

### Phase 5 — Documents & Files

29. Inline attachment preview (PDF, docx)
30. Document summarization
31. Chat Q&A against attachments
32. Large file transfers via S3
33. Video transcription (Whisper)

---

## Key Conventions

### Never Do This

- Never call Gmail API or Microsoft Graph directly from frontend components
- Never store OAuth tokens or secrets in the database as plaintext
- Never do heavy processing inside a webhook handler
- Never send email content to an external AI API
- Never use wildcard IAM permissions
- Never commit credentials or secrets to the repo
- Never build a standalone SMTP email server
- Never add features outside the current phase without asking first
- Never abstract a utility until it is used in at least two places

### Always Do This

- Normalize all provider email data to the shared Thread type before
  touching any UI or business logic
- Every webhook handler: validate signature → SQS → return 200
- Every AI call: loading state + error fallback
- Every feature: works across all connected providers (Gmail + Outlook), not just Gmail
- Every Docker image: multi-stage build, no FROM ubuntu:latest
- Every service: has a health check endpoint at /health

### UI Conventions

- Chat bubbles: sent right-aligned, received left-aligned (iMessage pattern)
- Account indicator: Gmail / Outlook icon on every thread
- AI panel: collapsible right sidebar, never blocks main thread view
- Toggle: chat view ↔ classic view, state persists to localStorage
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
