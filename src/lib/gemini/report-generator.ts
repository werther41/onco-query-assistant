import { geminiProModel, geminiFlashModel } from "./client";
import { buildReportPrompt, buildChatPrompt } from "./prompts";
import { VariantInfo } from "@/lib/civic/types";

/**
 * Generates a clinical report using Gemini Pro
 */
export async function generateReport(
  civicMarkdown: string,
  variantInfo: VariantInfo
): Promise<string> {
  try {
    const prompt = buildReportPrompt(civicMarkdown, variantInfo);
    const result = await geminiProModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate report. Please try again.");
  }
}

/**
 * Generates a chat response using Gemini Flash
 */
export async function chatWithGemini(
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>,
  question: string,
  reportContext: {
    variantInfo: VariantInfo;
    report: string;
    civicMarkdown?: string;
  }
): Promise<string> {
  try {
    const prompt = buildChatPrompt(conversationHistory, question, reportContext);
    const result = await geminiFlashModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate response. Please try again.");
  }
}

