import { useMutation } from "@tanstack/react-query";
import { ResponseSchema } from "@/utils/schemas";
import type { z } from "zod";

export type InterviewResponse = z.infer<typeof ResponseSchema>;

export type RateLimitInfo = {
  limit: number;
  remaining: number;
  reset: number;
};

export type ApiError = Error & {
  status?: number;
  retryAfterSeconds?: number;
  rateLimit?: RateLimitInfo;
};

type ApiResult = {
  data: InterviewResponse;
  rateLimit: RateLimitInfo | null;
};

// Convert header values to numbers; return 0 for empty/invalid.
const toNumber = (value: string | null) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

// Pull rate-limit headers into a single typed object.
const parseRateLimit = (headers: Headers): RateLimitInfo | null => {
  const limit = toNumber(headers.get("x-ratelimit-limit"));
  const remaining = toNumber(headers.get("x-ratelimit-remaining"));
  const reset = toNumber(headers.get("x-ratelimit-reset"));

  if (!limit && !remaining && !reset) {
    return null;
  }

  return { limit, remaining, reset };
};

// POST to the interview endpoint, normalize errors, and validate the response shape.
async function fetchInterviewQuestions(jobTitle: string): Promise<ApiResult> {
  const response = await fetch("/api/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobTitle }),
  });

  const rateLimit = parseRateLimit(response.headers);

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  // Normalize API errors into a single Error shape for the UI.
  if (!response.ok) {
    const errorMessage =
      (payload as { message?: string; error?: string })?.message ||
      (payload as { error?: string })?.error ||
      "Request failed";

    const retryAfterSeconds =
      (payload as { retryAfterSeconds?: number })?.retryAfterSeconds ||
      toNumber(response.headers.get("retry-after")) ||
      undefined;

    const error = new Error(errorMessage) as ApiError;
    error.status = response.status;
    error.retryAfterSeconds = retryAfterSeconds;
    error.rateLimit = rateLimit || undefined;
    throw error;
  }

  // Ensure the response matches our expected contract.
  const parsed = ResponseSchema.parse(payload);
  return { data: parsed, rateLimit };
}

export function useInterviewQuestions() {
  // Mutation fits a user-triggered POST (generate on submit, not on mount).
  return useMutation({
    mutationFn: fetchInterviewQuestions,
  });
}
