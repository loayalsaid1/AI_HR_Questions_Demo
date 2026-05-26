import { z } from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z.string(),
  GEMINI_MODEL: z.string().default("gemini-3.1-flash-lite"),
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
