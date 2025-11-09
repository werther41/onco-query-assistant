import {
  CIViCQueryResponse,
  Gene,
  Variant,
  EvidenceItem,
  Assertion,
  MolecularProfile,
  Disease,
  Therapy,
  Source,
} from "./types";

/**
 * Converts CIViC GraphQL JSON response to Markdown format
 * All fields are included, and IDs are converted to browsable CIViC website URLs
 */
export function convertCivicToMarkdown(data: CIViCQueryResponse): string {
  const sections: string[] = [];

  if (data.gene) {
    sections.push(convertGeneToMarkdown(data.gene));
  }

  if (data.variant) {
    sections.push(convertVariantToMarkdown(data.variant));
  }

  return sections.join("\n\n");
}

function convertGeneToMarkdown(gene: Gene): string {
  const lines: string[] = [];

  lines.push(
    `# Gene: ${
      gene.id
        ? `[${gene.name}](https://civicdb.org/genes/${gene.id})`
        : gene.name
    }`
  );

  const details: string[] = [];
  if (gene.id) {
    details.push(`- **Gene ID:** ${gene.id}`);
  }

  if (gene.description) {
    details.push(`- **Description:** ${gene.description}`);
  }

  if (details.length > 0) {
    lines.push("\n" + details.join("\n"));
  }

  if (gene.variants && gene.variants.nodes && gene.variants.nodes.length > 0) {
    lines.push(`\n## Variants (${gene.variants.nodes.length})`);

    gene.variants.nodes.forEach((variant, index) => {
      lines.push(`\n### Variant ${index + 1}`);
      lines.push(convertVariantToMarkdown(variant, false));
    });
  }

  return lines.join("\n");
}

function convertVariantToMarkdown(
  variant: Variant,
  includeHeader: boolean = true
): string {
  const lines: string[] = [];

  if (includeHeader) {
    lines.push(
      `# Variant: ${
        variant.id
          ? `[${variant.name}](https://civicdb.org/variants/${variant.id})`
          : variant.name
      }`
    );
  } else {
    lines.push(
      `- **Name:** ${
        variant.id
          ? `[${variant.name}](https://civicdb.org/variants/${variant.id})`
          : variant.name
      }`
    );
  }

  const details: string[] = [];
  if (variant.id) {
    details.push(`- **Variant ID:** ${variant.id}`);
  }

  if (variant.variantAliases && variant.variantAliases.length > 0) {
    details.push(`- **Aliases:** ${variant.variantAliases.join(", ")}`);
  }

  if (variant.variantTypes && variant.variantTypes.length > 0) {
    const typeList = variant.variantTypes
      .map((type) => `${type.name} (ID: ${type.id})`)
      .join(", ");
    details.push(`- **Variant Types:** ${typeList}`);
  }

  if (details.length > 0) {
    lines.push("\n" + details.join("\n"));
  }

  if (variant.singleVariantMolecularProfile) {
    lines.push(
      `\n${convertMolecularProfileToMarkdown(
        variant.singleVariantMolecularProfile
      )}`
    );
  }

  return lines.join("\n");
}

function convertMolecularProfileToMarkdown(profile: MolecularProfile): string {
  const lines: string[] = [];

  lines.push(`## Molecular Profile`);

  const details: string[] = [];
  if (profile.id) {
    details.push(`- **Molecular Profile ID:** ${profile.id}`);
  }

  if (
    profile.molecularProfileScore !== undefined &&
    profile.molecularProfileScore !== null
  ) {
    details.push(
      `- **Molecular Profile Score:** ${profile.molecularProfileScore}`
    );
  }

  if (profile.description) {
    details.push(`- **Description:** ${profile.description}`);
  }

  if (details.length > 0) {
    lines.push("\n" + details.join("\n"));
  }

  if (
    profile.evidenceItems &&
    profile.evidenceItems.nodes &&
    profile.evidenceItems.nodes.length > 0
  ) {
    lines.push(`\n### Evidence Items (${profile.evidenceItems.nodes.length})`);

    profile.evidenceItems.nodes.forEach((item, index) => {
      lines.push(`\n#### Evidence Item ${index + 1}`);
      lines.push(convertEvidenceItemToMarkdown(item));
    });
  }

  if (
    profile.assertions &&
    profile.assertions.nodes &&
    profile.assertions.nodes.length > 0
  ) {
    lines.push(`\n### Assertions (${profile.assertions.nodes.length})`);

    profile.assertions.nodes.forEach((assertion, index) => {
      lines.push(`\n#### Assertion ${index + 1}`);
      lines.push(convertAssertionToMarkdown(assertion));
    });
  }

  return lines.join("\n");
}

function convertEvidenceItemToMarkdown(item: EvidenceItem): string {
  const lines: string[] = [];

  const details: string[] = [];
  if (item.id) {
    details.push(`- **Evidence Item ID:** ${item.id}`);
  }

  if (item.name) {
    details.push(
      `- **Name:** ${
        item.id
          ? `[${item.name}](https://civicdb.org/evidence/${item.id})`
          : item.name
      }`
    );
  }

  if (item.description) {
    details.push(`- **Description:** ${item.description}`);
  }

  if (item.status) {
    details.push(`- **Status:** ${item.status}`);
  }

  if (item.evidenceLevel) {
    details.push(`- **Evidence Level:** ${item.evidenceLevel}`);
  }

  if (item.evidenceType) {
    details.push(`- **Evidence Type:** ${item.evidenceType}`);
  }

  if (item.significance) {
    details.push(`- **Significance:** ${item.significance}`);
  }

  if (item.therapyInteractionType) {
    details.push(
      `- **Therapy Interaction Type:** ${item.therapyInteractionType}`
    );
  }

  if (details.length > 0) {
    lines.push(details.join("\n"));
  }

  if (item.disease) {
    lines.push(`\n- **Disease:**`);
    const diseaseMarkdown = convertDiseaseToMarkdown(item.disease);
    // Indent the disease details
    lines.push(
      diseaseMarkdown
        .split("\n")
        .map((line) => (line.startsWith("-") ? "  " + line : line))
        .join("\n")
    );
  }

  if (item.therapies && item.therapies.length > 0) {
    lines.push(`\n- **Therapies:**`);
    item.therapies.forEach((therapy) => {
      const therapyMarkdown = convertTherapyToMarkdown(therapy);
      // Indent the therapy details
      lines.push(
        therapyMarkdown
          .split("\n")
          .map((line) => (line.startsWith("-") ? "  " + line : line))
          .join("\n")
      );
    });
  }

  if (item.source) {
    lines.push(`\n- **Source:**`);
    const sourceMarkdown = convertSourceToMarkdown(item.source);
    // Indent the source details
    lines.push(
      sourceMarkdown
        .split("\n")
        .map((line) => (line.startsWith("-") ? "  " + line : line))
        .join("\n")
    );
  }

  return lines.join("\n");
}

function convertAssertionToMarkdown(assertion: Assertion): string {
  const lines: string[] = [];

  const details: string[] = [];
  if (assertion.id) {
    details.push(`- **Assertion ID:** ${assertion.id}`);
  }

  if (assertion.name) {
    details.push(
      `- **Name:** ${
        assertion.id
          ? `[${assertion.name}](https://civicdb.org/assertions/${assertion.id})`
          : assertion.name
      }`
    );
  }

  if (assertion.summary) {
    details.push(`- **Summary:** ${assertion.summary}`);
  }

  if (assertion.description) {
    details.push(`- **Description:** ${assertion.description}`);
  }

  if (assertion.status) {
    details.push(`- **Status:** ${assertion.status}`);
  }

  if (assertion.significance) {
    details.push(`- **Significance:** ${assertion.significance}`);
  }

  if (assertion.assertionType) {
    details.push(`- **Assertion Type:** ${assertion.assertionType}`);
  }

  if (assertion.therapyInteractionType) {
    details.push(
      `- **Therapy Interaction Type:** ${assertion.therapyInteractionType}`
    );
  }

  if (assertion.ampLevel) {
    details.push(`- **AMP Level:** ${assertion.ampLevel}`);
  }

  if (assertion.nccnGuidelineVersion) {
    details.push(
      `- **NCCN Guideline Version:** ${assertion.nccnGuidelineVersion}`
    );
  }

  if (
    assertion.fdaCompanionTest !== undefined &&
    assertion.fdaCompanionTest !== null
  ) {
    details.push(
      `- **FDA Companion Test:** ${assertion.fdaCompanionTest ? "Yes" : "No"}`
    );
  }

  if (details.length > 0) {
    lines.push(details.join("\n"));
  }

  if (assertion.disease) {
    lines.push(`\n- **Disease:**`);
    const diseaseMarkdown = convertDiseaseToMarkdown(assertion.disease);
    // Indent the disease details
    lines.push(
      diseaseMarkdown
        .split("\n")
        .map((line) => (line.startsWith("-") ? "  " + line : line))
        .join("\n")
    );
  }

  if (assertion.therapies && assertion.therapies.length > 0) {
    lines.push(`\n- **Therapies:**`);
    assertion.therapies.forEach((therapy) => {
      const therapyMarkdown = convertTherapyToMarkdown(therapy);
      // Indent the therapy details
      lines.push(
        therapyMarkdown
          .split("\n")
          .map((line) => (line.startsWith("-") ? "  " + line : line))
          .join("\n")
      );
    });
  }

  if (assertion.phenotypes && assertion.phenotypes.length > 0) {
    lines.push(`\n- **Phenotypes:**`);
    assertion.phenotypes.forEach((phenotype) => {
      lines.push(`  - ${phenotype.name}`);
    });
  }

  return lines.join("\n");
}

function convertDiseaseToMarkdown(disease: Disease): string {
  const lines: string[] = [];

  lines.push(
    `- **Name:** ${
      disease.id
        ? `[${disease.name}](https://civicdb.org/diseases/${disease.id})`
        : disease.name
    }`
  );

  if (disease.id) {
    lines.push(`  - **Disease ID:** ${disease.id}`);
  }

  if (disease.diseaseAliases && disease.diseaseAliases.length > 0) {
    lines.push(`  - **Aliases:** ${disease.diseaseAliases.join(", ")}`);
  }

  return lines.join("\n");
}

function convertTherapyToMarkdown(therapy: Therapy): string {
  const lines: string[] = [];

  lines.push(
    `- **Name:** ${
      therapy.id
        ? `[${therapy.name}](https://civicdb.org/therapies/${therapy.id})`
        : therapy.name
    }`
  );

  if (therapy.id) {
    lines.push(`  - **Therapy ID:** ${therapy.id}`);
  }

  if (therapy.ncitId) {
    lines.push(`  - **NCIT ID:** ${therapy.ncitId}`);
  }

  return lines.join("\n");
}

function convertSourceToMarkdown(source: Source): string {
  const lines: string[] = [];

  if (source.id) {
    lines.push(`- **Source ID:** ${source.id}`);
  }

  if (source.citation) {
    lines.push(
      `- **Citation:** ${
        source.id
          ? `[${source.citation}](https://civicdb.org/sources/${source.id})`
          : source.citation
      }`
    );
  }

  if (source.sourceUrl) {
    lines.push(`- **URL:** [${source.sourceUrl}](${source.sourceUrl})`);
  }

  if (source.publicationDate) {
    lines.push(`- **Publication Date:** ${source.publicationDate}`);
  }

  return lines.join("\n");
}
