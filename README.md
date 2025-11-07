# OncoQuery Assistant

AI-powered genomic variant interpretation tool for oncologists, researchers, and students. Rapidly interpret genomic variants by querying the CIViC database and generating comprehensive clinical reports using Google Gemini AI.

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
- **AI**: Google Gemini 1.5 Pro (reports) and Flash (chat)
- **Data Source**: CIViC Database (GraphQL API)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (from GCP)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd oncoQuery
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
CIVIC_GRAPHQL_URL=https://civicdb.org/api/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   │   └── gemini/       # Gemini AI integration
│   └── types/            # TypeScript types
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
