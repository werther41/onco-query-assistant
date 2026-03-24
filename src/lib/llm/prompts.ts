import { VariantInfo } from "@/lib/civic/types";

/**
 * Builds the prompt for generating a comprehensive variant interpretation report
 */
export function buildReportPrompt(
  civicMarkdown: string,
  variantInfo: VariantInfo
): string {
  return `You are an expert oncology AI assistant specializing in genomic variant interpretation. Generate a comprehensive, structured clinical report based on the provided CIViC database information.

**Variant Information:**
- Gene: ${variantInfo.gene}
- Variant: ${variantInfo.variant || "Not specified"}
${variantInfo.exon ? `- Exon: ${variantInfo.exon}` : ""}
${
  variantInfo.nucleotideChange
    ? `- Nucleotide Change: ${variantInfo.nucleotideChange}`
    : ""
}
${
  variantInfo.aminoAcidChange
    ? `- Amino Acid Change: ${variantInfo.aminoAcidChange}`
    : ""
}

**CIViC Database Information (Markdown format):**
${civicMarkdown}

**Instructions:**
Generate a structured clinical report in markdown format. Start directly with the report content - do not include any introductory text, conversational phrases, or acknowledgments. Begin immediately with the first section heading.

The report should include the following sections:

## 1. Variant Significance
- Biological description of the variant
- Molecular mechanism and functional impact
- Protein domain affected (if applicable)
- Oncogenic potential

## 2. Clinical Relevance
- **Diagnostic Implications**: How this variant aids in disease classification
- **Prognostic Significance**: Impact on disease outcome independent of therapy
- **Predictive Biomarker Status**: Value for treatment selection

## 3. Treatment Options
Organize treatments by evidence level:

### FDA-Approved Therapies
List therapies with Level A evidence and FDA approval for this variant/disease combination.

### NCCN Category 1 Recommendations
List therapies recommended by NCCN guidelines (Category 1).

### Clinical Trials and Investigational Therapies
List therapies with Level B/C evidence or in clinical trials.

### Resistance Patterns
Document any known resistance mechanisms or therapies to avoid.

## 4. Evidence Summary
- Key publications and sources
- Evidence levels (A-E) with brief descriptions
- Number of supporting studies
- Most recent evidence dates

**Important Guidelines:**
- Use clear, professional medical language appropriate for oncologists
- Cite specific evidence levels (A, B, C, D, E) when discussing treatments
- Distinguish between on-label and off-label use
- Highlight any FDA companion diagnostic approvals
- If no evidence is found, clearly state this
- Be precise about disease contexts (e.g., "in NSCLC" vs "in colorectal cancer")
- Format the output in clean, structured markdown with proper headings
- Start directly with the first section heading (e.g., "## 1. Variant Significance") - no introductory text or conversational phrases

**Source Citation and Grounding:**
- The CIViC Database Information above contains clickable links to specific evidence items, molecular profiles, genes, variants, diseases, therapies, and sources
- When referencing information from the CIViC database, include the relevant CIViC link as a citation using markdown link format: [descriptive text](https://civicdb.org/...)
- For example, when discussing an evidence item, cite it as: "Evidence suggests... [CIViC Evidence Item](https://civicdb.org/evidence/123)"
- When mentioning therapies, diseases, or other entities, include their CIViC links to provide readers with direct access to the source data
- Use these links throughout the report to ground your statements and improve credibility
- In the Evidence Summary section, include links to key evidence items and sources
- This allows readers to verify information and access the original CIViC database entries

Generate the report now, starting immediately with the first section:`;
}

/**
 * Builds the prompt for conversational chat with report context
 */
export function buildChatPrompt(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  question: string,
  reportContext: {
    variantInfo: VariantInfo;
    report: string;
    civicMarkdown?: string;
  }
): string {
  const history = conversationHistory
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
    )
    .join("\n\n");

  return `You are an expert oncology AI assistant helping interpret genomic variants. You have access to a previously generated clinical report and CIViC database information.

**Report Context:**
Variant: ${reportContext.variantInfo.gene} ${
    reportContext.variantInfo.variant || ""
  }

**Generated Report:**
${reportContext.report}

${
  reportContext.civicMarkdown
    ? `**CIViC Database Information (Markdown format):**\n${reportContext.civicMarkdown}`
    : ""
}

**Conversation History:**
${history || "No previous conversation."}

**User Question:** ${question}

**Instructions:**
- Provide a clear, concise answer to the user's question
- Use simple language when defining medical/genetic terms
- Cite evidence levels (A, B, C, D, E) when discussing treatments
- Reference specific information from the report when relevant
- If asked about something not in the report, acknowledge this and provide general guidance if appropriate
- Maintain a professional but approachable tone
- If the question is about a term or concept, provide a brief educational explanation

**Source Citation and Grounding:**
- When referencing information from the CIViC database, include the relevant CIViC link as a citation using markdown link format: [descriptive text](https://civicdb.org/...)
- Use the links from the CIViC Database Information to ground your answers and provide credibility
- For example, when discussing evidence items, therapies, or diseases, include their CIViC links so users can verify the information
- This helps users access the original source data and improves the trustworthiness of your responses

Provide your response:`;
}
