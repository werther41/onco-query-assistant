import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/gemini/report-generator";
import { VariantInfo } from "@/lib/civic/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { civicMarkdown, variantInfo } = body;

    if (!civicMarkdown || !variantInfo) {
      return NextResponse.json(
        { error: "Missing required data: civicMarkdown and variantInfo are required" },
        { status: 400 }
      );
    }

    if (!variantInfo.gene) {
      return NextResponse.json(
        { error: "Gene name is required in variantInfo" },
        { status: 400 }
      );
    }

    const report = await generateReport(civicMarkdown, variantInfo as VariantInfo);

    return NextResponse.json({ report });
  } catch (error: unknown) {
    console.error("Error generating report:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate report",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

