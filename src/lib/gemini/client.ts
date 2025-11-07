import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// For complex report generation
export const geminiProModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
  generationConfig: {
    temperature: 0.3, // Lower for more factual medical content
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 8192,
  },
});

// For chat/follow-up questions
export const geminiFlashModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

