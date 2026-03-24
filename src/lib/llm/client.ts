import { createOpenAI } from "@ai-sdk/openai";

export function getLocalLlmProvider() {
  const baseURL = process.env.LOCAL_LLM_URL ?? "http://localhost:8000/v1";
  const apiKey = process.env.LOCAL_LLM_API_KEY ?? "local-no-key-required";
  return createOpenAI({
    baseURL,
    apiKey,
  });
}

export function getLocalLlmModelId(): string {
  return (
    process.env.LOCAL_LLM_MODEL ??
    "nvidia/Nemotron-3-Super-120B-A12B-FP8"
  );
}
