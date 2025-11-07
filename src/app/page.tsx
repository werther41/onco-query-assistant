"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VariantInput, { Variant } from "@/components/VariantInput";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [variants, setVariants] = useState<Variant[]>([
    { gene: "", variant: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate at least one variant with gene name
      const validVariants = variants.filter((v) => v.gene.trim());
      if (validVariants.length === 0) {
        setError("Please enter at least one gene name");
        setLoading(false);
        return;
      }

      // Process first variant (can extend to multiple later)
      const firstVariant = validVariants[0];

      // Step 1: Query CIViC
      const civicResponse = await fetch("/api/query-civic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gene: firstVariant.gene,
          variant: firstVariant.variant || undefined,
        }),
      });

      if (!civicResponse.ok) {
        const errorData = await civicResponse.json();
        throw new Error(errorData.error || "Failed to query CIViC database");
      }

      const civicData = await civicResponse.json();

      // Step 2: Generate Report
      const reportResponse = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          civicData,
          variantInfo: firstVariant,
        }),
      });

      if (!reportResponse.ok) {
        const errorData = await reportResponse.json();
        throw new Error(errorData.error || "Failed to generate report");
      }

      const { report } = await reportResponse.json();

      // Step 3: Navigate to report page with data
      const reportId = Date.now().toString();
      const reportData = {
        report,
        variantInfo: firstVariant,
        civicData,
      };

      // Store in sessionStorage for retrieval
      sessionStorage.setItem(`report-${reportId}`, JSON.stringify(reportData));

      router.push(`/report/${reportId}`);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            OncoQuery Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Genomic variant interpretation for oncology using <a href="https://civicdb.org" className="text-blue-600 hover:text-blue-800 underline">CIViC Database</a> and AI.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <VariantInput variants={variants} onChange={setVariants} />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                "Generate Report"
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">
              Example Queries:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>EGFR</strong> - T790M</li>
              <li>• <strong>MET</strong> - Exon 14 Skipping</li>
              <li>• <strong>KRAS</strong> - G12S (or p.Gly12Ser)</li>
              <li>• <strong>TP53</strong> - R248W (or p.Arg248Trp)</li>
            </ul>
            <p className="text-xs text-blue-700 mt-3">
              Note: You can enter variants in HGVS format (p.Arg361Cys) or CIViC format (R361C). The system will automatically normalize the format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

