# Kross — Staged Development & Test Plan

## Context

`nexus-mail/CLAUDE.md` describes the target product — **Kross**, an AI email+calendar
app that wraps **Gmail and Outlook** as chat-style conversations, backed by Node.js
microservices on AWS EKS, self-hosted Gemma 4 (Ollama), RAG (pgvector), KMS encryption,
and **Terraform-managed infrastructure**. The repo today holds only a **frontend
prototype**: one Next.js 16 / React 19 / Tailwind v4 / shadcn app (`nexus-mail/`), 5
static screens on mock data, **no tests, no backend, no infra**. This plan closes that
gap in shippable stages, each gated by tests at **four levels** (unit, integration,
e2e, manual browser QA) and each producing a **demoable milestone**.

**Locked decisions**
1. **Scope** — full Kross across all CLAUDE.md phases + infra.
2. **Providers** — **Gmail + Outlook only. Apple Mail / iCloud is removed entirely**
   (drop CLAUDE.md Phase 6; scrub all Apple UI, clients, normalizers, fixtures).
3. **Design** — swappable **token layer**; Obsidian-dark now, Intercom-blue optional later.
4. **Structure** — restructure into the `frontend/` + `services/` monorepo.
5. **IaC** — **Terraform** is the single source of truth for all AWS resources
   (remote state, modules, per-env composition, validated in CI).
6. **Testing** — Vitest+RTL (unit/component), Supertest+LocalStack (integration),
   Playwright (e2e), manual QA checklists, plus IaC validation (tflint/tfsec/checkov).

---

## Guiding rules (from CLAUDE.md — enforced every stage)

- **Definition of Done (per feature):** works across **Gmail + Outlook**; loading
  state; user-friendly error state; doesn't break existing features; email content
  KMS-encrypted at rest; no cross-user leaks; responsive <768px; service `/health` green.
- **Never:** call provider APIs from frontend; store tokens as plaintext; heavy work in
  a webhook handler; send email content to an external AI API; wildcard IAM; commit
  secrets; standalone SMTP; out-of-phase features without asking.
- **Always:** normalize provider data to the shared `Thread` type before UI/logic;
  webhook = validate → SQS → 200; every AI call has loading + fallback; **every AWS
  resource is defined in Terraform** (nothing click-ops'd in the console).

---

## Target monorepo layout (end state)

```
kross/
├── frontend/                     # current nexus-mail app, moved here (Apple card removed)
│   ├── src/app/(main)/{inbox,calendar,...}
│   ├── src/components/{inbox,composer,calendar,documents,ai}
│   ├── src/lib/{gmail,outlook,storage}.ts        # API clients → call our BFF (no apple.ts)
│   ├── src/store/  src/hooks/  src/types/
│   └── tests/{unit,component,e2e}
├── packages/shared-types/        # unified Thread/Message/Attachment contract + Gmail/Outlook fixtures
├── services/                     # each: src/, test/, Dockerfile (multi-stage), /health
│   ├── auth-service/  sync-service/  ai-service/ (src/prompts/)
│   ├── rag-service/   calendar-service/  file-service/  notification-service/
├── terraform/
│   ├── modules/{vpc,eks,ecr,aurora,sqs,secrets,redis,s3,observability,waf}/
│   ├── envs/{staging,prod}/       # composition + tfvars; remote state per env
│   └── bootstrap/                 # S3 state bucket + DynamoDB lock table
├── kubernetes/                    # Helm charts per service
├── .github/workflows/             # CI/CD (tests, tf validate/plan/apply, image build)
└── docker-compose.yml             # local: services + postgres+pgvector + redis + localstack + ollama
```

**Reuse, don't recreate:** the 5 built screens, `components/sidebar.tsx`,
`top-nav.tsx`, `globals.css` (tokens) move into `frontend/` as-is **minus Apple**. The
CLAUDE.md DB schema, env vars, SQS event names, and sync sequence are the contract —
copy into `packages/shared-types`, don't reinvent.

---

## Global testing strategy

| Level | Tooling | Runs | Covers |
|---|---|---|---|
| Unit / component | Vitest + RTL + jsdom | every commit, CI | normalizers, mappers, hooks, prompt builders, RRF reranker, KMS wrappers, components in isolation |
| Integration / API | Vitest + Supertest; LocalStack; real Postgres+pgvector & Redis in Docker | CI | route handlers; webhook→SQS→store; per-user isolation |
| E2E | Playwright (available via MCP) | CI pre-merge + manual | full browser flows vs `docker-compose` with mocked providers/Ollama |
| Manual web QA | Human + the per-stage checklists below | end of each stage | the explicit "click-through with expected results" |
| **IaC** | `terraform fmt/validate`, **tflint**, **tfsec/checkov** | CI on `terraform/**` | module correctness, security posture, no wildcard IAM |

**Conventions**
- Unit tests beside code (`*.test.ts`); e2e in `frontend/tests/e2e/*.spec.ts`.
- **Mock the outside world:** providers + Ollama via MSW / nock fakes; AWS via
  **LocalStack** (SQS/S3/Secrets/KMS); Postgres+pgvector & Redis run real in Docker.
- **Canonical fixtures:** one set of Gmail + Outlook payloads → expected normalized
  `Thread` in `packages/shared-types/fixtures/`, reused at every layer.
- **Gates:** 80% lines on `services/*/src` and `frontend/src/{lib,store,hooks}`;
  components ≥ smoke-rendered. Any failing level or sub-threshold coverage blocks merge.
- **Standing regression guards (run every stage after introduced):** Stage 0 e2e smoke
  + Stage 2 cross-provider per-user isolation test.

---

## Infrastructure as Code — Terraform strategy

- **State:** S3 backend + DynamoDB lock table (provisioned by `terraform/bootstrap/`).
- **Layout:** reusable `modules/*`; environments composed in `envs/staging` and
  `envs/prod` (**directory-per-env**, not workspaces, for blast-radius isolation).
- **Security as code:** least-privilege IAM per service (no wildcards — enforced by
  tfsec/checkov); everything tagged; encryption (KMS/AES-256) defined, never default-off.
- **CI/CD (mirrors CLAUDE.md pipeline):** PR → `fmt -check` + `validate` + tflint +
  tfsec/checkov + `plan` (posted to PR). Merge → `apply` to **staging auto**, **prod
  manual gate** → post-deploy CloudWatch alarm check → auto-rollback on error spike.
  GitHub Actions assumes an IAM role via **OIDC** (no long-lived AWS secrets).
- **Local parity:** LocalStack stands in for AWS locally; Terraform remains the source
  of truth for staging/prod.

---

## Stage template (uniform across all stages)

> **Goal** · **App build** · **Infra (Terraform)** · **Tests** (Unit / Integration /
> E2E / Manual web QA) · **✅ Expected output & features** · **Definition of Done**

---

## Stage 0 — Foundation, IaC bootstrap & test harness

**Goal:** monorepo skeleton, token theming, Terraform baseline, CI, and the test rig
all stages plug into.

**App build**
1. Move `nexus-mail/*` → `frontend/`; init pnpm workspace. **Remove the Apple card from
   `/onboarding`, iCloud from the sidebar, and "Personal (iCloud)" from `/calendar`.**
2. `packages/shared-types`: CLAUDE.md types + **Gmail/Outlook** fixtures.
3. Scaffold 7 `services/*` (Fastify app + `/health` + multi-stage Dockerfile).
4. Confirm `globals.css` tokens are the only color source; add `data-theme`
   (obsidian|intercom) switch stub; assert no hardcoded hex in components.
5. Test rig: Vitest+RTL+MSW in `frontend`; Vitest+Supertest+LocalStack in a sample
   service; Playwright config vs compose.

**Infra (Terraform)**
- `terraform/bootstrap/`: state bucket + lock table.
- `modules/{vpc,ecr,eks}` + `envs/staging` baseline: VPC (private subnets), ECR repos
  (7), EKS cluster + base node group, GitHub OIDC IAM role.
- CI workflow runs unit+integration+Trivy+image build **and** tf fmt/validate/tflint/
  tfsec/plan.

**Tests**
- *Unit:* shared-types fixture round-trips; `cn()`/utils; theme-token resolver.
- *Integration:* each service `/health` → `{status:"ok"}`.
- *E2E (smoke):* Playwright loads `/onboarding`, `/inbox`, `/inbox/chat`,
  `/inbox/[id]`, `/calendar` → 200 + key heading.
- *IaC:* `terraform validate` + tfsec clean on the staging baseline.
- *Manual web QA:*
  - [ ] `/onboarding` shows **exactly two** cards (Google, Microsoft); Continue disabled
        until one selected; selection toggles the check badge + enables Continue.
  - [ ] Sidebar nav highlights active route; no iCloud entry anywhere.
  - [ ] Classic↔Conversations toggle switches `/inbox`↔`/inbox/chat`.
  - [ ] 375 / 768 / 1280px — no horizontal scroll, nothing clipped.

**✅ Expected output & features:** repo builds from `frontend/`; `docker-compose up` →
all 7 services healthy; the 5 screens render (Apple-free, 2 providers); `terraform plan`
yields a clean staging baseline (VPC+ECR+EKS+state); CI green. *Rails only — no new
user-facing behavior yet.*

**DoD:** monorepo builds; compose healthy; Terraform baseline applies to staging; CI
(code + IaC) green; screens pixel-equivalent to prototype minus Apple.

---

## Stage 1 — Auth (CLAUDE.md Phase 1 #1–2)

**Goal:** native Google + Microsoft OAuth; first provider connected = Kross identity;
tokens in Secrets Manager (never DB); short-lived Kross JWT session.

**App build**
1. `auth-service`: Google OAuth 2.0 code flow (consent→callback→exchange).
2. Encrypt + store provider tokens in **Secrets Manager**; persist only
   `account_connections` metadata (no plaintext token).
3. Kross session JWT (short TTL) + refresh; Redis session store.
4. Microsoft OAuth 2.0 (Azure AD) mirroring Google.
5. Frontend: `/onboarding` "Connect" → OAuth redirect → return to `/inbox`; sidebar
   shows connected-account chips.

**Infra (Terraform)**
- `modules/secrets` (Secrets Manager + KMS key for token encryption),
  `modules/redis` (ElastiCache), IAM role for `auth-service` (read/write only its
  secrets path). Helm release for `auth-service`.

**Tests**
- *Unit:* token-encryption round-trip; JWT issue/verify/expiry; provider-config
  selector; "first provider wins" identity rule.
- *Integration:* `GET /auth/google` → 302 with correct scopes/PKCE;
  `…/callback?code=` (mocked exchange) → creates `account_connections`, writes Secrets
  Manager, sets session; **token never in DB row**; refresh path on expiry; MS parity.
- *E2E (mocked IdP):* onboarding → Connect Google → stubbed consent → `/inbox` with
  Gmail chip.
- *IaC:* tfsec asserts the auth IAM role has no wildcard; secrets KMS-encrypted.
- *Manual web QA:*
  - [ ] Connect Google → real consent (test app) → return to `/inbox`, chip visible.
  - [ ] Reload → still logged in. Connect Outlook → both chips; identity unchanged.
  - [ ] Deny consent → friendly error, back on `/onboarding`.

**✅ Expected output & features:** a user can connect **Google and Microsoft** via real
OAuth, land in the inbox, and stay logged in across reloads; sidebar reflects connected
accounts; tokens exist only in Secrets Manager.

**DoD:** both providers connect; tokens only in Secrets Manager; session survives
reload; loading + error states present.

---

## Stage 2 — Sync & unified inbox (CLAUDE.md Phase 1 #3–8)

**Goal:** webhook→SQS→normalize→store pipeline; unified chat + classic inbox on **real
data**; 90-day backfill. The spine of the product.

**App build**
1. `sync-service` webhooks: Gmail (Pub/Sub) + Outlook (Graph). Handler **only**
   validates signature → publishes SQS → 200.
2. SQS consumers: fetch full content → **normalize to `Thread`** → KMS-encrypt body →
   store in Aurora → emit `thread.updated` → WS push.
3. Subscription auto-renewal cron (Gmail 6d / Outlook 2d).
4. Backfill job: 90 days on first connect, through the same SQS pipeline.
5. Frontend: replace mock arrays in `inbox/page.tsx`, `inbox/chat/page.tsx`,
   `inbox/[id]/page.tsx` with BFF data (`/api/threads`, `/api/threads/[id]`);
   add `store/` + data hooks; WebSocket client; toggle persists to localStorage.

**Infra (Terraform)**
- `modules/aurora` (PostgreSQL + pgvector, KMS-encrypted), `modules/sqs` (sync queue +
  DLQ), API Gateway (+ WebSocket), security groups (default-deny), IAM for
  `sync-service`. Helm release for `sync-service`. EventBridge rule for renewal cron.

**Tests**
- *Unit:* Gmail→`Thread` and Outlook→`Thread` normalizers (same shared fixtures →
  identical output); signature validators; chat/classic view mapper; localStorage
  toggle reducer; chunk-boundary splitter (prep for Stage 4).
- *Integration:* valid-signature webhook → exactly one SQS msg, schema-correct, 200 in
  <50ms; **invalid signature → 401, no publish**; consumer stores `threads`+`messages`
  with `encrypted_body` ciphertext; backfill idempotent on replay (dedupe by
  `provider_message_id`); `GET /api/threads?user=A` never returns B's rows.
- *E2E:* seed mock mailbox → webhook → thread appears in `/inbox/chat` w/o reload (WS);
  toggle to Classic → same data; open thread → bubbles right/left correct.
- *IaC:* checkov asserts Aurora encryption-at-rest + private subnet; SQS has a DLQ.
- *Manual web QA:*
  - [ ] New mail in test Gmail appears in seconds; my msgs right-aligned, theirs left;
        provider icon on each thread.
  - [ ] Toggle Classic↔Chat persists after reload.
  - [ ] Outlook threads appear in the same unified list (cross-provider).
  - [ ] Loading skeletons, empty state, error toast all reachable; <768px usable.

**✅ Expected output & features:** real **Gmail + Outlook** mail flows into one unified
inbox; chat and classic views work on live data with **live push updates**; threads
open and read correctly; view toggle persists; 90-day history is backfilled; everything
encrypted at rest.

**DoD:** real mail end-to-end for both providers; encrypted at rest; backfill
idempotent; toggle persists; WS live updates; responsive.

---

## Stage 3 — AI layer (CLAUDE.md Phase 2 #9–15)

**Goal:** Gemma 4 via Ollama on a GPU pool; summaries, priority/category, reply
suggestions, tone matching, follow-up + noise detection.

**App build**
1. `ai-service` consuming the SQS AI queue; Ollama client; all prompts in `src/prompts/`.
2. Jobs (each timeout + retry + fallback): streamed summarization; priority score +
   category (action|waiting|fyi|noise); replies (direct/friendly/diplomatic); tone
   matching per contact; follow-up detection; noise detection.
3. Frontend: AI sidebar, smart-reply chips, Daily Briefing, Focus Score wired to real
   outputs; every AI call shows loading + graceful fallback.

**Infra (Terraform)**
- `modules/eks` GPU managed node group (g5) + autoscaler keyed to SQS depth;
  `modules/sqs` AI queue + DLQ; IAM for `ai-service`. Helm release with GPU tolerations.

**Tests**
- *Unit:* prompt builders (snapshot each); response parsers (model JSON → typed);
  category enum guard; fallback-on-timeout; streaming chunk assembler.
- *Integration (Ollama mocked):* AI job writes `priority_score`/`category`; malformed
  output → fallback persisted, job retried not failed; per-user prompt isolation.
- *E2E:* open thread → summary streams into the insight card; click smart-reply →
  composer pre-fills; inbox row shows "Smart" badge when categorized.
- *IaC:* tfsec on GPU node IAM; autoscaling policy present.
- *Manual web QA:*
  - [ ] Long thread → sensible streamed summary; 3 tones differ visibly.
  - [ ] Important threads float with right badge; noise demoted.
  - [ ] Kill Ollama → fallback message, app still usable.
  - [ ] Follow-up nudge appears for a sent-but-unanswered thread.

**✅ Expected output & features:** threads gain **AI summaries, priority/category
badges, three-tone smart replies, and follow-up nudges**; the AI sidebar, Daily
Briefing, and Focus Score are real; the app degrades gracefully when AI is down; no
email content leaves AWS.

**DoD:** all listed AI jobs run via SQS with timeout/retry/fallback; every AI surface
has loading + error fallback.

---

## Stage 4 — RAG + natural-language search (CLAUDE.md Phase 3 #16–22)

**Goal:** embeddings + hybrid search (BM25 + vector + RRF) + NL "second brain" queries.

**App build**
1. `rag-service`: nomic-embed-text pipeline; 500-token boundary-aware chunking;
   vectors in pgvector, namespaced by `user_id`.
2. BM25 full-text index on `thread_chunks.content`; hybrid retrieval + RRF rerank →
   top chunks → Gemma 4 → NL answer.
3. Contact relationship memory (`contact_memory`).
4. Frontend: NL search UI (TopNav search → results + synthesized answer panel).

**Infra (Terraform)**
- `modules/sqs` RAG queue + DLQ; IAM for `rag-service`; pgvector already on Aurora
  (Stage 2). Helm release. (OpenSearch deferred to scale — noted, not built.)

**Tests**
- *Unit:* chunker (boundaries + token cap); RRF combiner (known inputs → known order);
  embedding wrapper; query router (BM25 + vector dispatch).
- *Integration (real pgvector):* embed→store→semantic query returns seeded chunk; BM25
  returns lexical match; RRF orders a hybrid case; **vectors user-namespaced** (A's
  query never retrieves B's chunk).
- *E2E:* "what did I agree to with Jordan?" → answer cites the right thread; results
  deep-link to source.
- *Manual web QA:*
  - [ ] Keyword search finds exact-term mail; conceptual query finds related threads.
  - [ ] NL question → synthesized answer + clickable sources.
  - [ ] As user A, never see user B content (two seeded accounts).

**✅ Expected output & features:** **natural-language and keyword search across all
mail**; second-brain questions return grounded, cited answers; contact memory accrues;
strict per-user vector isolation.

**DoD:** hybrid search returns relevant cited results; per-user isolation; answers
grounded in retrieved chunks.

---

## Stage 5 — Calendar (CLAUDE.md Phase 4 #23–28)

**Goal:** Google + Microsoft calendar sync; Calendly-style links; auto-scheduling
detection; meeting prep brief; smart buffers — replacing the static `/calendar` mock.

**App build**
1. `calendar-service`: read/write Google + Microsoft Calendar APIs.
2. Per-user scheduling-link generator (durations/approval configurable).
3. Auto-scheduling detection ("let's find a time") → draft / ghost slot (UI exists).
4. Meeting prep brief 10 min before events (relevant threads/docs/last convo).
5. Smart buffer learning. Wire `/calendar` + Intelligence panel to real data.

**Infra (Terraform)**
- IAM for `calendar-service`; EventBridge scheduled rules (prep-brief trigger); Helm
  release.

**Tests**
- *Unit:* event normalizer (Google/MS → unified); "find a time" intent detector
  (pos/neg); buffer calculator; booking-link slug/config.
- *Integration:* create event → appears via both provider APIs (mocked); booking →
  writes event + confirmation; prep-brief assembler pulls correct related threads.
- *E2E:* week grid renders real events; "Add to Calendar" on a thread → shows on
  `/calendar`; ghost "drafting meeting" slot resolves.
- *Manual web QA:*
  - [ ] Week grid shows real Google + Outlook events in correct slots.
  - [ ] "Add to Calendar" from a thread → appears on `/calendar`.
  - [ ] Copy booking link → working public scheduling page.
  - [ ] "let's find a time" thread surfaces a draft/ghost event.
  - [ ] Intelligence panel shows correct "Next Up" + relevant threads/docs.

**✅ Expected output & features:** **two-way calendar for Google + Outlook**; real
events in the week grid; Add-to-Calendar from threads; Calendly-style booking links;
auto-detected scheduling + 10-min prep briefs; smart buffers.

**DoD:** two-way sync across providers; booking links work; auto-scheduling + prep brief
functional; panel data real.

---

## Stage 6 — Documents & files (CLAUDE.md Phase 5 #29–33)

**Goal:** attachment preview, doc summarization, chat Q&A against attachments, large S3
transfers, video transcription.

**App build**
1. `file-service`: S3 upload (chunked >100MB), text extraction (PDF/docx/xlsx), Whisper
   transcription, compression suggestions.
2. Extracted text → embedded into RAG (reuse Stage 4) for doc Q&A.
3. Frontend: inline attachment viewer + doc Q&A panel (`components/documents`).

**Infra (Terraform)**
- `modules/s3` (buckets + AES-256 + lifecycle), IAM for `file-service`, optional
  transcription compute; Helm release.

**Tests**
- *Unit:* MIME router; chunked-upload part calculator; extractor output shape per type.
- *Integration (LocalStack S3):* upload → S3 object + `attachments` row +
  `extracted_text` + embedding queued; >100MB triggers multipart.
- *E2E:* open a PDF inline; ask a question → grounded answer.
- *IaC:* checkov asserts bucket encryption + no public access.
- *Manual web QA:*
  - [ ] PDF/docx preview inline (no download); ask a question → answer cites the doc.
  - [ ] Upload >100MB → completes (chunked), appears attached.
  - [ ] Video attachment → transcript available.

**✅ Expected output & features:** **inline preview + Q&A for PDF/docx/xlsx
attachments**; large (>100MB) S3 transfers; video transcription; all S3 objects
AES-256 at rest.

**DoD:** previews + doc Q&A work; large uploads succeed; transcription runs; S3
encrypted.

---

## Stage 7 — Hardening, compliance & launch  *(was Stage 8; Apple stage removed)*

**Goal:** production-safe per CLAUDE.md security / GDPR / SOC2.

**App build & checks**
1. KMS per-user CMK + envelope encryption verified end-to-end; "delete user → CMK
   delete → data unreadable" path.
2. GDPR data-export endpoint; EU/US data-residency routing.
3. Auto-rollback on error-rate spike (Helm/CodeDeploy).

**Infra (Terraform)**
- `modules/observability` (CloudTrail on all KMS ops, CloudWatch alarms, X-Ray),
  `modules/waf` (CloudFront WAF), Macie on S3, Inspector image scans, default-deny SGs,
  per-user CMK strategy. `envs/prod` finalized with manual approval gate.

**Tests**
- *Integration/security:* right-to-deletion makes content undecryptable; DB-only breach
  can't reveal plaintext (zero-knowledge assertion); WAF blocks a basic attack pattern.
- *IaC:* checkov/tfsec full pass; policy lint asserts **no wildcard IAM** anywhere.
- *E2E:* full journey — onboard → connect Gmail + Outlook → mail+AI+search+calendar →
  export data → delete account.
- *Manual web QA:* run all per-stage checklists on staging; induce errors → alarms fire
  → auto-rollback triggers.

**✅ Expected output & features:** **production-grade Kross** — per-user KMS encryption,
right-to-deletion, GDPR export, CloudTrail/alarms/auto-rollback, clean Trivy/Checkov/
tfsec scans; the full onboard→use→export→delete journey passes on staging.

**DoD:** every feature meets the CLAUDE.md DoD; CI/CD with manual prod gate +
post-deploy alarm check + auto-rollback is live; all IaC scans clean.

---

## Verification (any point)

- **Per service:** `docker-compose up` → `/health` 200; `pnpm test` + `pnpm
  test:integration` green vs LocalStack+Postgres+Redis.
- **Per frontend stage:** `next build` passes; Vitest + Playwright green; run the
  stage's **Manual web QA checklist** in the browser.
- **Per infra change:** `terraform validate` + tflint + tfsec/checkov clean; `plan`
  reviewed on PR; `apply` auto→staging, manual→prod.
- **Pre-merge:** CI runs unit+integration+IaC+Trivy+build+e2e; sub-threshold coverage or
  any failing level blocks merge.

---

## Follow-ups to confirm at Stage 0 kickoff

- **Update CLAUDE.md:** delete Phase 6 (Apple Mail) and all Apple/iCloud references;
  change the stale "Intercom design system" line to "pluggable theme tokens (Obsidian
  default)."
- Package manager — recommend **pnpm** workspaces.
- Keep `frontend` as **Next.js** (route handlers = the BFF that calls services) vs plain
  React+Vite — recommend **keep Next.js**.
- Provision real Google + Microsoft **test OAuth apps** + a test mailbox for manual QA.
