import { NextRequest, NextResponse } from "next/server";
import { generateReport } from "@/lib/gemini/report-generator";
import { VariantInfo } from "@/lib/civic/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { civicData, variantInfo } = body;

    if (!civicData || !variantInfo) {
      return NextResponse.json(
        { error: "Missing required data: civicData and variantInfo are required" },
        { status: 400 }
      );
    }

    if (!variantInfo.gene) {
      return NextResponse.json(
        { error: "Gene name is required in variantInfo" },
        { status: 400 }
      );
    }

    const report = await generateReport(civicData, variantInfo as VariantInfo);

    return NextResponse.json({ report });
  } catch (error: any) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      {
        error: "Failed to generate report",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

