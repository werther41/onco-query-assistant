import { generateText } from "ai";
import { getLocalLlmModelId, getLocalLlmProvider } from "./client";
import { buildReportPrompt, buildChatPrompt } from "./prompts";
import { VariantInfo } from "@/lib/civic/types";

const LLM_ATTEMPTS = 4;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateLlmText(
  prompt: string,
  options: {
    maxOutputTokens: number;
    temperature: number;
    topP?: number;
    timeoutMs: number;
  }
): Promise<string> {
  const provider = getLocalLlmProvider();
  const model = provider(getLocalLlmModelId());

  let lastError: unknown;
  for (let attempt = 0; attempt < LLM_ATTEMPTS; attempt++) {
    try {
      const { text } = await generateText({
        model,
        prompt,
        maxOutputTokens: options.maxOutputTokens,
        temperature: options.temperature,
        topP: options.topP,
        maxRetries: 0,
        timeout: options.timeoutMs,
      });
      return text;
    } catch (e) {
      lastError = e;
      if (attempt < LLM_ATTEMPTS - 1) {
        await delay(2000 * 2 ** attempt);
      }
    }
  }
  throw lastError;
}

/**
 * Generates a clinical report using the local OpenAI-compatible (vLLM) endpoint.
 */
export async function generateReport(
  civicMarkdown: string,
  variantInfo: VariantInfo
): Promise<string> {
  try {
    const prompt = buildReportPrompt(civicMarkdown, variantInfo);
    return await generateLlmText(prompt, {
      maxOutputTokens: 8192,
      temperature: 0.3,
      topP: 0.8,
      timeoutMs: 600_000,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate report. Please try again.");
  }
}

/**
 * Chat follow-up using the local OpenAI-compatible (vLLM) endpoint.
 */
export async function chatWithReportContext(
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
    return await generateLlmText(prompt, {
      maxOutputTokens: 2048,
      temperature: 0.5,
      topP: 0.9,
      timeoutMs: 300_000,
    });
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate response. Please try again.");
  }
}
