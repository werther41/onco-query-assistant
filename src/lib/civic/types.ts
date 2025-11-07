// CIViC GraphQL API Types

export type EvidenceLevel = "A" | "B" | "C" | "D" | "E";
export type EvidenceType = "PREDICTIVE" | "PROGNOSTIC" | "DIAGNOSTIC" | "PREDISPOSING" | "FUNCTIONAL" | "ONCOGENIC";
export type Significance = "SENSITIVITYRESPONSE" | "RESISTANCE" | "POSITIVE" | "NEGATIVE" | "BETTER_OUTCOME" | "POOR_OUTCOME" | "PATHOGENIC" | "BENIGN";
export type AssertionType = "PREDICTIVE" | "PROGNOSTIC" | "DIAGNOSTIC";
export type TherapyInteractionType = "COMBINATION" | "SEQUENTIAL" | "SUBSTITUTES" | null;

export interface Disease {
  id: number;
  name: string;
  diseaseAliases?: string[];
}

export interface Therapy {
  id: number;
  name: string;
  ncitId?: string;
}

export interface Source {
  id: number;
  citation: string;
  sourceUrl?: string;
  publicationDate?: string;
}

export interface EvidenceItem {
  id: number;
  name: string;
  description: string;
  status: string;
  evidenceLevel: EvidenceLevel;
  evidenceType: EvidenceType;
  significance: Significance;
  therapyInteractionType: TherapyInteractionType;
  disease: Disease;
  therapies: Therapy[];
  source: Source;
}

export interface Assertion {
  id: number;
  name: string;
  summary: string;
  description: string;
  status: string;
  significance: Significance;
  assertionType: AssertionType;
  therapyInteractionType: TherapyInteractionType;
  ampLevel?: string;
  nccnGuidelineVersion?: string;
  fdaCompanionTest?: boolean;
  disease: Disease;
  therapies: Therapy[];
  phenotypes?: Array<{ name: string }>;
}

export interface VariantType {
  id: number;
  name: string;
}

export interface Variant {
  id: number;
  name: string;
  variantAliases?: string[];
  variantTypes?: VariantType[];
  singleVariantMolecularProfile?: MolecularProfile;
}

export interface MolecularProfile {
  id: number;
  molecularProfileScore?: number;
  description?: string;
  evidenceItems: {
    nodes: EvidenceItem[];
  };
  assertions: {
    nodes: Assertion[];
  };
}

export interface Gene {
  id: number;
  name: string;
  description?: string;
  variants: {
    nodes: Variant[];
  };
}

export interface CIViCQueryResponse {
  gene?: Gene;
  variant?: Variant;
}

export interface VariantInfo {
  gene: string;
  variant?: string;
  exon?: string;
  nucleotideChange?: string;
  aminoAcidChange?: string;
}

