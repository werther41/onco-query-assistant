# Deployment & validation runbook (Ubuntu + Docker + Cloudflare Tunnel)

Use this from an SSH session on the bare-metal host. Adjust service names and paths if your `docker-compose.yml` differs.

## Prerequisites (one-time)

- NVIDIA drivers and [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) installed.
- Docker Engine and Docker Compose plugin.
- Hugging Face token available if the model requires gated download (set in `.env`, never commit it).

## 1. Deploy

```bash
cd /path/to/onco-query-assistant

cp .env.example .env
# Edit .env: HF_TOKEN (if required), LOCAL_LLM_MODEL (must match vLLM --model)

docker compose up -d --build
```

Optional Cloudflare Tunnel (set `CLOUDFLARE_TUNNEL_TOKEN` in `.env`):

```bash
docker compose --profile tunnel up -d
```

Watch startup (model load can take a long time):

```bash
docker compose logs -f vllm-backend
# other terminal:
docker compose logs -f nextjs-frontend
```

## 2. Validate GPU on the host

```bash
nvidia-smi
```

## 3. Validate vLLM (OpenAI-compatible API)

If vLLM is published on loopback only (`127.0.0.1:8000:8000`):

```bash
curl -sS http://127.0.0.1:8000/v1/models | head
```

Smoke test chat completion (adjust `model` to match what vLLM loaded):

```bash
curl -sS http://127.0.0.1:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nvidia/Nemotron-3-Super-120B-A12B-FP8",
    "messages": [{"role":"user","content":"Say hi in one sentence."}],
    "max_tokens": 32,
    "temperature": 0.2
  }'
```

Expect HTTP 200 and a `choices[0].message.content` (or equivalent) in the JSON.

## 4. Validate Next.js on the host

If Next.js is published on loopback only (`127.0.0.1:3000:3000`):

```bash
curl -i http://127.0.0.1:3000/
```

Liveness check:

```bash
curl -i http://127.0.0.1:3000/api/health
```

## 5. Validate Docker DNS: Next.js container → vLLM

From the Next.js service container (replace service name if different):

```bash
docker compose exec nextjs-frontend node -e "
fetch('http://vllm-backend:8000/v1/models')
  .then(r => console.log('models HTTP status', r.status))
  .catch(e => { console.error(e); process.exit(1); });
"
```

## 6. Validate app API (example: chat)

Current route in this repo: `POST /api/chat` (`src/app/api/chat/route.ts`). Minimal JSON body:

```bash
curl -sS -X POST http://127.0.0.1:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": [],
    "question": "Summarize the key takeaway in one short paragraph.",
    "reportContext": {
      "variantInfo": { "gene": "TP53" },
      "report": "Placeholder clinical report text for smoke testing.",
      "civicMarkdown": "## Placeholder CIViC context"
    }
  }'
```

The chat route returns JSON `{ "response": "..." }` (non-streaming).

## 7. Validate Cloudflare Tunnel (external)

In Cloudflare Zero Trust, route the public hostname to the origin you configured (commonly `http://localhost:3000` when using loopback binding + `cloudflared` on the host).

From your laptop or another network:

```bash
curl -I https://prototype.example.com/
```

## 8. Networking / IT checklist (loopback + tunnel)

- **Inbound:** With `127.0.0.1:3000:3000` and tunnel-only access, you typically **do not** need the internal network to **open inbound TCP 3000** for clients.
- **Outbound:** `cloudflared` needs **outbound HTTPS** to Cloudflare. Confirm with IT if this server has restricted egress.
- **Direct LAN access** to `:3000` without the tunnel requires publishing on `0.0.0.0` and appropriate firewall rules; that is a different threat model than tunnel-only.
