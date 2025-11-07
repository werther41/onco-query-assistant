"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

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
    <div className="space-y-4">
      {variants.map((variant, index) => (
        <div
          key={index}
          className="border border-gray-300 rounded-lg p-4 bg-white"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Variant {index + 1}
            </h3>
            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gene Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={variant.gene}
                onChange={(e) => updateVariant(index, "gene", e.target.value)}
                placeholder="e.g., EGFR, MET, KRAS"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant
              </label>
              <input
                type="text"
                value={variant.variant}
                onChange={(e) => updateVariant(index, "variant", e.target.value)}
                placeholder="e.g., T790M, G12S, Exon 14 Skipping"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exon (Optional)
              </label>
              <input
                type="text"
                value={variant.exon || ""}
                onChange={(e) => updateVariant(index, "exon", e.target.value)}
                placeholder="e.g., 14, 19"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nucleotide Change (Optional)
              </label>
              <input
                type="text"
                value={variant.nucleotideChange || ""}
                onChange={(e) => updateVariant(index, "nucleotideChange", e.target.value)}
                placeholder="e.g., c.1081C>T"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amino Acid Change (Optional)
              </label>
              <input
                type="text"
                value={variant.aminoAcidChange || ""}
                onChange={(e) => updateVariant(index, "aminoAcidChange", e.target.value)}
                placeholder="e.g., p.Arg361Cys, p.Gly12Ser"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addVariant}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Another Variant
      </button>
    </div>
  );
}

