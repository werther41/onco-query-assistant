import { NextRequest, NextResponse } from "next/server";
import { queryCivic } from "@/lib/civic/client";
import { SEARCH_VARIANTS_QUERY } from "@/lib/civic/queries";
import { normalizeVariant } from "@/lib/civic/normalizer";

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
    const data = await queryCivic(SEARCH_VARIANTS_QUERY, {
      geneName: gene.toUpperCase(),
      variantName: normalizedVariant,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error querying CIViC:", error);
    return NextResponse.json(
      {
        error: "Failed to query CIViC database",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

