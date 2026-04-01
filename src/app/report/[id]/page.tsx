"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorkflowStepper, type StepStatus } from "@/components/ui/workflow-stepper";
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
  const [generating, setGenerating] = useState(false);

  const generateReport = useCallback(
    async (data: ReportData, reportId: string) => {
      setGenerating(true);
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
        const updatedData = { ...data, report };
        setReportData(updatedData);
        sessionStorage.setItem(`report-${reportId}`, JSON.stringify(updatedData));
      } catch (err: unknown) {
        console.error("Error generating report:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate report";
        setError(errorMessage);
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  useEffect(() => {
    const reportId = params.id as string;
    if (!reportId) {
      setError("Invalid report ID");
      setLoading(false);
      return;
    }

    const stored = sessionStorage.getItem(`report-${reportId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setReportData(data);
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

  // Derive stepper state
  const civicDone = !!(reportData?.civicMarkdown);
  const reportDone = !!(reportData?.report);
  const stepStatuses: StepStatus[] = [
    civicDone ? "completed" : loading ? "in-progress" : "pending",
    civicDone && !reportDone ? "in-progress" : reportDone ? "completed" : "pending",
    reportDone ? "completed" : "pending",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-destructive/8 border border-destructive/20 text-destructive text-sm px-5 py-4 rounded-lg mb-4">
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
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-0">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-[18px] font-semibold text-foreground">
              {reportData.variantInfo.gene}
              {reportData.variantInfo.variant && (
                <span className="text-muted-foreground font-normal ml-1.5">
                  {reportData.variantInfo.variant}
                </span>
              )}
            </h1>
            <p className="meta-label mt-0.5">Variant Interpretation Report</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Workflow stepper */}
          <WorkflowStepper
            steps={[
              { label: "CIViC Query", status: stepStatuses[0] },
              { label: "AI Analysis", status: stepStatuses[1] },
              { label: "Report Ready", status: stepStatuses[2] },
            ]}
          />
          <div className="w-px h-5 bg-[rgba(0,0,0,0.10)]" />
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReportDisplay
              report={reportData.report}
              generating={generating}
              variantInfo={reportData.variantInfo}
              civicMarkdown={reportData.civicMarkdown}
            />
          </div>
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
