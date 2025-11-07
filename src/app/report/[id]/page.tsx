"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReportDisplay from "@/components/ReportDisplay";
import ChatInterface from "@/components/ChatInterface";
import { ArrowLeft, Loader2 } from "lucide-react";

interface ReportData {
  report: string;
  variantInfo: {
    gene: string;
    variant?: string;
    exon?: string;
    nucleotideChange?: string;
    aminoAcidChange?: string;
  };
  civicData?: any;
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError("Failed to load report data");
      }
    } else {
      setError("Report not found. Please generate a new report.");
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
            {error || "Report not found"}
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="space-y-6">
          <ReportDisplay
            report={reportData.report}
            variantInfo={reportData.variantInfo}
          />

          <ChatInterface reportContext={reportData} />
        </div>
      </div>
    </div>
  );
}

