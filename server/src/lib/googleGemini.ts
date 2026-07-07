import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/** Primary model — gemini-3.5-flash often returns 503 on free tier */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const FALLBACK_MODELS = [
  GEMINI_MODEL,
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
].filter((model, index, list) => list.indexOf(model) === index);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableGeminiError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("UNAVAILABLE") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("high demand")
  );
};

export async function generateGeminiContent(contents: string) {
  let lastError: unknown;

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await ai.models.generateContent({ model, contents });
      } catch (error) {
        lastError = error;
        if (!isRetryableGeminiError(error)) {
          break;
        }
        await sleep((attempt + 1) * 2000);
      }
    }
  }

  throw lastError;
}
