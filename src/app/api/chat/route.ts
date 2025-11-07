import { NextRequest, NextResponse } from "next/server";
import { chatWithGemini } from "@/lib/gemini/report-generator";
import { VariantInfo } from "@/lib/civic/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationHistory, question, reportContext } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (!reportContext || !reportContext.variantInfo || !reportContext.report) {
      return NextResponse.json(
        { error: "Report context with variantInfo and report is required" },
        { status: 400 }
      );
    }

    const history = conversationHistory || [];
    const response = await chatWithGemini(
      history,
      question,
      {
        variantInfo: reportContext.variantInfo as VariantInfo,
        report: reportContext.report,
        civicData: reportContext.civicData,
      }
    );

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Error generating chat response:", error);
    return NextResponse.json(
      {
        error: "Failed to generate chat response",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

