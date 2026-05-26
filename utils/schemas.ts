import { z } from "zod";

export const RequestSchema = z.object({
  jobTitle: z.string().min(2).max(100).transform((s) => s.trim()),
});

export const QuestionSchema = z.object({
  type: z.string(),
  question: z.string(),
  purpose: z.string(),
  whatToLookFor: z.string(),
});

export const ResponseSchema = z.object({
  roleContext: z.string(),
  questions: z.array(QuestionSchema).length(3),
});

export type RequestType = z.infer<typeof RequestSchema>;
export type ResponseType = z.infer<typeof ResponseSchema>;
