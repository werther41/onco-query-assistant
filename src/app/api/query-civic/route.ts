import { NextRequest, NextResponse } from "next/server";
import { queryCivic } from "@/lib/civic/client";
import { SEARCH_VARIANTS_QUERY } from "@/lib/civic/queries";
import { normalizeVariant } from "@/lib/civic/normalizer";
import { convertCivicToMarkdown } from "@/lib/civic/markdown-converter";
import { CIViCQueryResponse } from "@/lib/civic/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gene, variant } = body;

    if (!gene) {
      return NextResponse.json(
        { error: "Gene name is required" },
        { status: 400 }
      );
    }

    // Normalize variant format if provided
    const normalizedVariant = variant ? normalizeVariant(variant) : undefined;

    // Query CIViC GraphQL API
    const civicData = await queryCivic<CIViCQueryResponse>(SEARCH_VARIANTS_QUERY, {
      geneName: gene.toUpperCase(),
      variantName: normalizedVariant,
    });

    // Convert to Markdown
    const civicMarkdown = convertCivicToMarkdown(civicData);

    // Return both JSON and Markdown
    return NextResponse.json({
      civicData,
      civicMarkdown,
    });
  } catch (error: unknown) {
    console.error("Error querying CIViC:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to query CIViC database",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

