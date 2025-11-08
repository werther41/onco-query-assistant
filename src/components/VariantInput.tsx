"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Variant {
  gene: string;
  variant: string;
  exon?: string;
  nucleotideChange?: string;
  aminoAcidChange?: string;
}

interface VariantInputProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export default function VariantInput({ variants, onChange }: VariantInputProps) {
  const addVariant = () => {
    onChange([...variants, { gene: "", variant: "" }]);
  };

  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {variants.map((variant, index) => (
        <div
          key={index}
          className="border border-border rounded-lg p-4 bg-card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Variant {index + 1}
            </h3>
            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Required fields - compact 3 column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {/* Gene Name */}
            <div className="space-y-1">
              <Label htmlFor={`gene-${index}`} className="font-medium text-xs">
                Gene Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`gene-${index}`}
                placeholder="e.g., EGFR"
                value={variant.gene}
                onChange={(e) => updateVariant(index, "gene", e.target.value)}
                className="h-8 text-base"
                required
              />
            </div>

            {/* Variant */}
            <div className="space-y-1">
              <Label htmlFor={`variant-${index}`} className="text-xs font-medium">
                Variant <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`variant-${index}`}
                placeholder="e.g., T790M"
                value={variant.variant}
                onChange={(e) => updateVariant(index, "variant", e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            {/* Exon */}
            <div className="space-y-1">
              <Label
                htmlFor={`exon-${index}`}
                className="text-xs font-medium text-muted-foreground"
              >
                Exon
              </Label>
              <Input
                id={`exon-${index}`}
                placeholder="e.g., 14"
                value={variant.exon || ""}
                onChange={(e) => updateVariant(index, "exon", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Optional fields - 2 column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Nucleotide Change */}
            <div className="space-y-1">
              <Label
                htmlFor={`nucleotide-${index}`}
                className="text-xs font-medium text-muted-foreground"
              >
                Nucleotide Change
              </Label>
              <Input
                id={`nucleotide-${index}`}
                placeholder="e.g., c.1081C>T"
                value={variant.nucleotideChange || ""}
                onChange={(e) => updateVariant(index, "nucleotideChange", e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            {/* Amino Acid Change */}
            <div className="space-y-1">
              <Label
                htmlFor={`amino-${index}`}
                className="text-xs font-medium text-muted-foreground"
              >
                Amino Acid Change
              </Label>
              <Input
                id={`amino-${index}`}
                placeholder="e.g., p.Arg361Cys"
                value={variant.aminoAcidChange || ""}
                onChange={(e) => updateVariant(index, "aminoAcidChange", e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addVariant}
        className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
      >
        <span className="text-lg">+</span> Add Another Variant
      </button>
    </div>
  );
}
