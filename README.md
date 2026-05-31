# Kross

AI-powered unified email + calendar that wraps **Gmail and Outlook** as chat-style
conversations (toggle to classic view), with AI summaries/replies, RAG search, and a
Calendly-style calendar. See [CLAUDE.md](./CLAUDE.md) for the full architecture and
[PLAN.md](./PLAN.md) for the staged development + test plan.

## Monorepo layout

```
frontend/              Next.js 16 app (App Router, Tailwind v4, shadcn/ui)
packages/shared-types/ Unified Thread/Message contract + Gmail/Outlook fixtures
services/              7 Fastify microservices (auth, sync, ai, rag, calendar, file, notification)
terraform/             IaC: bootstrap (remote state) + modules + envs/staging
.github/workflows/     CI (Node tests + build, Terraform validate)
docker-compose.yml     Local stack: services + postgres+pgvector + redis + localstack + ollama
```

## Develop

```bash
npm install                              # install all workspaces
npm run build --workspace @kross/frontend
npm run dev  --workspace @kross/frontend # http://localhost:3000

npm run test --workspaces --if-present   # all unit/integration tests
docker compose up                        # full local stack (every service exposes /health)
```

## Status

**Stage 0 (foundation) complete** — monorepo, theming token layer, shared-types,
service scaffolds with `/health`, Terraform baseline, CI, and the test harness.
Apple/iCloud is intentionally out of scope (Gmail + Outlook only). Stages 1–7
(auth → sync → AI → RAG → calendar → docs → hardening) per [PLAN.md](./PLAN.md).
