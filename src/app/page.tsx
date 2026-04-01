"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Zap, Upload, Loader2 } from "lucide-react";
import VariantInput, { Variant } from "@/components/VariantInput";

export default function HomePage() {
  const [variants, setVariants] = useState<Variant[]>([
    { gene: "", variant: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validVariants = variants.filter((v) => v.gene.trim());
      if (validVariants.length === 0) {
        setError("Please enter at least one gene name");
        setLoading(false);
        return;
      }

      const firstVariant = validVariants[0];

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

      const { civicData, civicMarkdown } = await civicResponse.json();

      const reportId = Date.now().toString();
      const reportData = {
        variantInfo: firstVariant,
        civicData,
        civicMarkdown,
        report: null,
      };

      sessionStorage.setItem(`report-${reportId}`, JSON.stringify(reportData));
      router.push(`/report/${reportId}`);
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const exampleQueries = [
    { gene: "EGFR", variant: "T790M", description: "Non-small cell lung cancer" },
    { gene: "MET", variant: "Exon 14 Skipping", description: "NSCLC — MET exon 14" },
    { gene: "KRAS", variant: "p.Gly12Ser", description: "Colorectal / lung cancer" },
    { gene: "TP53", variant: "R248W", description: "Pan-cancer tumor suppressor" },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-0">
        <div>
          <h1 className="text-[18px] font-semibold text-foreground">
            Variant Query
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            AI-powered genomic interpretation via{" "}
            <a
              href="https://civicdb.org"
              className="text-primary hover:underline"
            >
              CIViC
            </a>
          </p>
        </div>
        <Link href="/infographic">
          <Button size="sm" variant="outline">
            Workflow Guide
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Left: Input form */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="pdf">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Report
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Manual Entry */}
                <TabsContent value="manual" className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Variant Information
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Provide genomic or protein-level variant details
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <VariantInput variants={variants} onChange={setVariants} />

                    {error && (
                      <div className="bg-destructive/8 border border-destructive/20 text-destructive text-sm px-3 py-2.5 rounded-md">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 text-sm font-semibold"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Querying CIViC...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Tab 2: PDF Upload */}
                <TabsContent value="pdf" className="space-y-5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Upload Report
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Upload a genetic test report PDF for analysis
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-[rgba(0,0,0,0.10)] rounded-lg p-10 text-center bg-surface-alt hover:bg-[#eaeff3] transition-colors">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <Label htmlFor="pdf-upload" className="cursor-pointer">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Drop your PDF here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accepted format: PDF
                      </p>
                    </Label>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-white border border-[rgba(0,0,0,0.07)] rounded-md inline-block">
                        <p className="text-xs text-foreground font-medium">
                          ✓ {uploadedFile.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    disabled
                    className="w-full h-10 text-sm font-semibold"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadedFile ? "Analyze Report (Coming Soon)" : "Upload PDF to Continue"}
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right: Example queries */}
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Example Queries
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {exampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setVariants([
                      {
                        gene: query.gene,
                        variant: query.variant,
                        exon: "",
                        nucleotideChange: "",
                        aminoAcidChange: "",
                      },
                    ])
                  }
                  className="flex items-center justify-between p-3 bg-white border border-[rgba(0,0,0,0.07)] rounded-lg hover:bg-surface-alt shadow-card transition-colors text-left group"
                >
                  <div>
                    <p className="meta-value-bold">{query.gene} {query.variant}</p>
                    <p className="meta-label mt-0.5">{query.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Accepts HGVS format (p.Arg361Cys) or CIViC format (R361C) —
              normalized automatically.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
