# OncoQuery Assistant

AI-powered genomic variant interpretation tool for oncologists, researchers, and students. Rapidly interpret genomic variants by querying the CIViC database and generating comprehensive clinical reports using a **local OpenAI-compatible LLM** (for example [vLLM](https://github.com/vllm-project/vllm) on bare metal).

🌐 **Live Demo**: [https://onco-query-assistant.vercel.app/](https://onco-query-assistant.vercel.app/)

## Features

- **Variant Input**: Enter gene names and variants manually (supports HGVS and CIViC formats)
- **CIViC Integration**: Direct GraphQL queries to the CIViC database for clinical evidence
- **AI Report Generation**: Generate structured clinical reports with:
  - Variant Significance
  - Clinical Relevance (Diagnostic, Prognostic, Predictive)
  - Treatment Options (FDA-approved, NCCN Category 1, investigational)
  - Evidence Summary
- **Interactive Chat**: Ask follow-up questions about variants, treatments, and terminology

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Vercel AI SDK (`@ai-sdk/openai`) targeting an OpenAI-compatible endpoint (local vLLM)
- **Data Source**: CIViC Database (GraphQL API)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A running OpenAI-compatible API (for local development, vLLM at `http://localhost:8000/v1` or set `LOCAL_LLM_URL`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/werther41/onco-query-assistant.git
cd onco-query-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from the example and adjust:
```bash
cp .env.example .env.local
```

Key variables:

- `LOCAL_LLM_URL` — Base URL for the OpenAI-compatible API (must include `/v1`, e.g. `http://localhost:8000/v1`)
- `LOCAL_LLM_MODEL` — Model id served by vLLM (must match `--model` on the server)
- `LOCAL_LLM_API_KEY` — Placeholder string if the server does not require a key

Optional:

- `CIVIC_GRAPHQL_URL` — Defaults to `https://civicdb.org/api/graphql` if unset
- `NEXT_PUBLIC_APP_URL` — App URL for client-side links

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker (full stack on GPU host)

See [docs/deploy-runbook.md](docs/deploy-runbook.md) for SSH deployment and validation commands.

```bash
cp .env.example .env
# Set HF_TOKEN if required; set LOCAL_LLM_MODEL to match vLLM

docker compose up -d --build
```

Optional Cloudflare Tunnel (requires `CLOUDFLARE_TUNNEL_TOKEN` in `.env`):

```bash
docker compose --profile tunnel up -d
```

## Usage

1. **Enter Variant Information**:
   - Enter a gene name (required)
   - Optionally enter variant information (e.g., T790M, G12S, or p.Arg361Cys)
   - The system automatically normalizes HGVS format to CIViC format

2. **Generate Report**:
   - Click "Generate Report"
   - The system queries CIViC and generates an AI-powered clinical report

3. **Ask Questions**:
   - After viewing the report, use the chat interface to ask follow-up questions
   - Examples: "What is a kinase inhibitor?", "Explain evidence level A"

## Example Queries

- **EGFR** - T790M
- **MET** - Exon 14 Skipping
- **KRAS** - G12S (or p.Gly12Ser)
- **TP53** - R248W (or p.Arg248Trp)

## Project Structure

```
oncoQuery/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── report/       # Report display page
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   ├── lib/              # Core logic
│   │   ├── civic/        # CIViC integration
│   │   └── llm/          # Local OpenAI-compatible LLM (vLLM)
│   └── types/            # TypeScript types
├── docs/                 # Deployment runbooks
└── content-source-reference/  # Reference documentation
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- Reports are stored in browser sessionStorage (not persisted to database)
- Chat history is maintained in component state during the session
- The app uses direct GraphQL queries to CIViC (not the MCP server)

## License

Private project - All rights reserved
