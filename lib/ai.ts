import { GoogleGenAI } from "@google/genai";
import { env } from "../utils/env";
import type { ResponseType } from "../utils/schemas";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export async function generateInterviewQuestions(systemPrompt: string, jobTitle: string) {
  const prompt = `${systemPrompt}\n\nUser: ${jobTitle}`;

  const response = await ai.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(response.text) as ResponseType;
}
