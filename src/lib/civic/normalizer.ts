// HGVS to CIViC format normalizer
// Converts p.Arg361Cys to R361C format

const AMINO_ACID_MAP: Record<string, string> = {
  // Three-letter to single-letter amino acid codes
  Ala: "A",
  Arg: "R",
  Asn: "N",
  Asp: "D",
  Cys: "C",
  Gln: "Q",
  Glu: "E",
  Gly: "G",
  His: "H",
  Ile: "I",
  Leu: "L",
  Lys: "K",
  Met: "M",
  Phe: "F",
  Pro: "P",
  Ser: "S",
  Thr: "T",
  Trp: "W",
  Tyr: "Y",
  Val: "V",
  // Handle lowercase
  ala: "A",
  arg: "R",
  asn: "N",
  asp: "D",
  cys: "C",
  gln: "Q",
  glu: "E",
  gly: "G",
  his: "H",
  ile: "I",
  leu: "L",
  lys: "K",
  met: "M",
  phe: "F",
  pro: "P",
  ser: "S",
  thr: "T",
  trp: "W",
  tyr: "Y",
  val: "V",
};

/**
 * Converts HGVS protein notation (p.Arg361Cys) to CIViC format (R361C)
 * @param hgvsNotation - HGVS protein notation like "p.Arg361Cys" or "p.Gly12Ser"
 * @returns CIViC format like "R361C" or "G12S", or original string if conversion fails
 */
export function normalizeHGVS(hgvsNotation: string): string {
  if (!hgvsNotation) return hgvsNotation;

  // Remove whitespace
  const cleaned = hgvsNotation.trim();

  // Check if it's already in CIViC format (e.g., R361C, G12S)
  // CIViC format: single letter + number + single letter
  if (/^[A-Z]\d+[A-Z]$/.test(cleaned)) {
    return cleaned;
  }

  // Handle HGVS format: p.XXX###YYY
  // Pattern: p. followed by 3-letter code, number, 3-letter code
  const hgvsPattern = /^p\.([A-Za-z]{3})(\d+)([A-Za-z]{3})$/;
  const match = cleaned.match(hgvsPattern);

  if (match) {
    const [, originalAA, position, newAA] = match;
    const originalSingle = AMINO_ACID_MAP[originalAA];
    const newSingle = AMINO_ACID_MAP[newAA];

    if (originalSingle && newSingle) {
      return `${originalSingle}${position}${newSingle}`;
    }
  }

  // Handle special cases like "Exon 14 Skipping", "T790M" (already single letter)
  // If it contains "Exon" or is already a common variant format, return as-is
  if (cleaned.includes("Exon") || cleaned.includes("exon") || /^[A-Z]\d+[A-Z]$/.test(cleaned)) {
    return cleaned;
  }

  // If we can't convert, return original (might be a different format)
  return cleaned;
}

/**
 * Normalizes a variant string, handling multiple formats
 * @param variant - Variant string in various formats
 * @returns Normalized variant string
 */
export function normalizeVariant(variant: string): string {
  if (!variant) return variant;

  // Try HGVS normalization first
  const normalized = normalizeHGVS(variant);

  // Capitalize first letter if needed (e.g., "g12s" -> "G12S")
  if (normalized.length > 0 && /^[a-z]/.test(normalized)) {
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  return normalized;
}

