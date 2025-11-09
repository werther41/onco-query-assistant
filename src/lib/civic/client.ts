import { GraphQLClient } from "graphql-request";

const CIVIC_GRAPHQL_URL =
  process.env.CIVIC_GRAPHQL_URL || "https://civicdb.org/api/graphql";

export const civicClient = new GraphQLClient(CIVIC_GRAPHQL_URL, {
  headers: {
    "Content-Type": "application/json",
  },
});

export async function queryCivic<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const data = await civicClient.request<T>(query, variables);
    return data;
  } catch (error) {
    console.error("CIViC API Error:", error);
    throw error;
  }
}

