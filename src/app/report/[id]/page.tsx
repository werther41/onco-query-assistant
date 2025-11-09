"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReportDisplay from "@/components/ReportDisplay";
import ChatInterface from "@/components/ChatInterface";
import { ChevronLeft, Loader2, Share2, Download } from "lucide-react";

interface ReportData {
  report: string | null;
  variantInfo: {
    gene: string;
    variant?: string;
    exon?: string;
    nucleotideChange?: string;
    aminoAcidChange?: string;
  };
  civicData?: unknown;
  civicMarkdown?: string;
}

export default function ReportPage() {
  const params = useParams();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (data: ReportData, reportId: string) => {
    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          civicMarkdown: data.civicMarkdown,
          variantInfo: data.variantInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate report");
      }

      const { report } = await response.json();
      
      // Update report data
      const updatedData = {
        ...data,
        report,
      };
      
      setReportData(updatedData);
      
      // Update sessionStorage
      sessionStorage.setItem(`report-${reportId}`, JSON.stringify(updatedData));
    } catch (err: unknown) {
      console.error("Error generating report:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate report";
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    const reportId = params.id as string;
    if (!reportId) {
      setError("Invalid report ID");
      setLoading(false);
      return;
    }

    // Retrieve report data from sessionStorage
    const stored = sessionStorage.getItem(`report-${reportId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setReportData(data);
        
        // If report doesn't exist, generate it
        if (!data.report && data.civicMarkdown && data.variantInfo) {
          generateReport(data, reportId);
        }
      } catch {
        setError("Failed to load report data");
      }
    } else {
      setError("Report not found. Please generate a new report.");
    }
    setLoading(false);
  }, [params.id, generateReport]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-4 rounded-lg mb-4">
            {error || "Report not found"}
          </div>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Main Content and Sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Report Content */}
          <div className="lg:col-span-2 space-y-6">
            <ReportDisplay
              report={reportData.report}
              variantInfo={reportData.variantInfo}
              civicMarkdown={reportData.civicMarkdown}
            />
          </div>

          {/* Sidebar - Chat Interface */}
          <div>
            {reportData && (
              <ChatInterface
                reportContext={{
                  variantInfo: reportData.variantInfo,
                  report: reportData.report || "",
                  civicMarkdown: reportData.civicMarkdown,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
