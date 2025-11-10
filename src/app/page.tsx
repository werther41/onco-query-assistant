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

      const { civicData, civicMarkdown } = await civicResponse.json();

      // Step 2: Navigate to report page immediately (before report generation)
      const reportId = Date.now().toString();
      const reportData = {
        variantInfo: firstVariant,
        civicData,
        civicMarkdown,
        // Report will be generated on the report page
        report: null,
      };

      // Store in sessionStorage for retrieval
      sessionStorage.setItem(`report-${reportId}`, JSON.stringify(reportData));

      router.push(`/report/${reportId}`);
    } catch (err: unknown) {
      console.error("Error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
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
    { gene: "EGFR", variant: "T790M", description: "EGFR T790M" },
    {
      gene: "MET",
      variant: "Exon 14 Skipping",
      description: "MET Exon 14 Skipping",
    },
    {
      gene: "KRAS",
      variant: "p.Gly12Ser",
      description: "KRAS G12S (or p.Gly12Ser)",
    },
    {
      gene: "TP53",
      variant: "R248W",
      description: "TP53 R248W (or p.Arg248Trp)",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-3xl text-foreground font-semibold">
                OncoQuery Assistant
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              Genomic variant interpretation for oncology using{" "}
              <a
                href="https://civicdb.org"
                className="text-primary hover:underline"
              >
                CIViC Database
              </a>{" "}
              and AI
            </p>
            <p className="text-sm text-muted-foreground">
              Analyze cancer-related genetic variants and explore treatment
              options
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-8 shadow-lg border-0">
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-auto">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <span>Manual Entry</span>
                </TabsTrigger>
                <TabsTrigger value="pdf" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Report</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Manual Variant Entry */}
              <TabsContent value="manual" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Enter Variant Information
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Provide genomic or protein-level variant details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <VariantInput variants={variants} onChange={setVariants} />

                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-base font-semibold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </form>

                {/* Example Queries */}
                <div className="mt-8 p-6 bg-secondary rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      Example Queries
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {exampleQueries.map((query, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setVariants([
                            {
                              gene: query.gene,
                              variant: query.variant,
                              exon: "",
                              nucleotideChange: "",
                              aminoAcidChange: "",
                            },
                          ]);
                        }}
                        className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-muted border border-border transition-colors text-left"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {query.gene}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {query.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                    <span className="font-medium">Note:</span> You can enter
                    variants in HGVS format (p.Arg361Cys) or CIViC format
                    (R361C). The system will automatically normalize the format.
                  </p>
                </div>
              </TabsContent>

              {/* Tab 2: PDF Report Upload */}
              <TabsContent value="pdf" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Upload Report
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Upload a genetic test report PDF for analysis
                  </p>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-card hover:bg-muted/50 transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <Label htmlFor="pdf-upload" className="cursor-pointer">
                    <p className="font-semibold text-foreground mb-1">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
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
                    <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
                      <p className="text-sm text-foreground font-medium">
                        ✓ File selected
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {uploadedFile.name}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Our system will automatically extract variant information
                    from your report and generate a comprehensive
                    interpretation.
                  </p>
                </div>

                {uploadedFile && (
                  <Button
                    disabled
                    className="w-full h-11 text-base font-semibold"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Analyze Report (Coming Soon)
                  </Button>
                )}

                {!uploadedFile && (
                  <Button
                    disabled
                    className="w-full h-11 text-base font-semibold opacity-50"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload PDF to Continue
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Link to infographic */}
          <div className="mt-8 text-center">
            <Link href="/infographic">
              <Button variant="outline" className="text-base font-semibold">
                View Genomic Interpretation Workflow Infographic
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
