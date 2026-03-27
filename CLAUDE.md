# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Docker (full stack: vLLM + Next.js)
docker compose up -d --build
docker compose down
docker compose --profile tunnel up -d   # Include Cloudflare Tunnel
```

No test suite is configured.

## Architecture

**OncoQuery Assistant** is a clinical genomic variant interpretation tool. It queries the [CIViC database](https://civicdb.org) for variant evidence, converts that data to Markdown, and sends it to a local vLLM server to generate a structured clinical report.

```
Browser → Next.js API Routes → CIViC GraphQL API (external)
                             → Local vLLM Server (port 8000, OpenAI-compatible)
Browser SessionStorage ← Report Data (no backend database)
```

### Data Flow

1. User inputs gene + variant on the home page (`src/app/page.tsx`)
2. `/api/query-civic` normalizes the variant (HGVS → CIViC format via `src/lib/civic/normalizer.ts`) and queries CIViC's GraphQL API
3. The JSON response is converted to Markdown (`src/lib/civic/markdown-converter.ts`) and stored in `sessionStorage`
4. The report page (`src/app/report/[id]/page.tsx`) calls `/api/generate-report`, which sends the CIViC Markdown to the vLLM server with a structured clinical prompt
5. Follow-up questions go through `/api/chat`, which maintains conversation context per request

### Key Directories

- `src/app/api/` — API routes: `query-civic`, `generate-report`, `chat`, `health`
- `src/lib/civic/` — CIViC GraphQL client, queries, variant normalizer, Markdown converter
- `src/lib/llm/` — vLLM client (OpenAI-compatible), report generator with retry/timeout logic, prompt templates, thinking-tag stripper
- `src/components/` — React UI: `VariantInput`, `ReportDisplay`, `ChatInterface`, `Navigation`

### LLM Integration

- Uses Vercel AI SDK (`@ai-sdk/openai`, `ai`) pointed at the local vLLM server
- Report generation: 4 retries with exponential backoff, 600s timeout, temperature 0.3, max 8192 tokens
- Chat: 300s timeout, temperature 0.5, max 2048 tokens
- Reasoning model output is stripped of `<thinking>` tags (`src/lib/llm/strip-thinking.ts`)

### Environment Variables

Key vars (see `.env.example`):

```
LOCAL_LLM_URL=http://vllm-backend:8000/v1
LOCAL_LLM_MODEL=nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8
LOCAL_LLM_API_KEY=local-no-key-required
HF_TOKEN=                         # Required for gated Hugging Face models
CIVIC_GRAPHQL_URL=https://civicdb.org/api/graphql
CLOUDFLARE_TUNNEL_TOKEN=          # Optional
GOOGLE_GEMINI_API_KEY=            # Legacy/experimental, not in active use
```

For local dev without Docker, run vLLM separately and set `LOCAL_LLM_URL=http://localhost:8000/v1`.

### Docker Stack

`docker-compose.yml` defines:
- **vllm-backend** (port 8000) — `vllm/vllm-openai:v0.17.1`, GPU-accelerated, tensor parallelism across 2 GPUs, max 16,384 context length
- **nextjs-frontend** (port 3000) — waits for vllm-backend healthcheck
- **cloudflared** (optional `--profile tunnel`) — Cloudflare Tunnel for external access

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
