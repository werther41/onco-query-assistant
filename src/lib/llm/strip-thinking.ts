/**
 * Nemotron 3 Super may inline a thinking block before the closing think tag in text.
 * Prefer vLLM `--reasoning-parser nemotron_v3` so reasoning is split in the API instead
 * (see vLLM Nemotron 3 Super blog).
 */
const THINK_END = "\u003c/think\u003e";

/** Drop the model thinking block; keep only the text after the closing think tag. */
export function stripThinkingPrefix(text: string): string {
  const idx = text.lastIndexOf(THINK_END);
  if (idx === -1) {
    return text.trim();
  }
  return text.slice(idx + THINK_END.length).trim();
}

/** Split into reasoning (before the closing think tag) and final answer, for optional UI use. */
export function splitThinking(text: string): { reasoning: string; answer: string } {
  const idx = text.lastIndexOf(THINK_END);
  if (idx === -1) {
    return { reasoning: "", answer: text.trim() };
  }
  return {
    reasoning: text.slice(0, idx).trim(),
    answer: text.slice(idx + THINK_END.length).trim(),
  };
}
