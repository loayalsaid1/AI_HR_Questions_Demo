import { RequestSchema, ResponseSchema } from "@/utils/schemas";
import { generateInterviewQuestions } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `You are an expert Hiring Manager and Lead Interviewer. Your task is to generate highly effective, practical interview questions based on a provided job title.

Return exactly 3 questions: one Behavioral, one Situational, and one Domain-Specific. For each, include purpose and whatToLookFor.

Respond with raw JSON only using this exact shape:
{
  "roleContext": "1-2 sentence summary of the role and assumed level",
  "questions": [
    {
      "type": "Behavioral | Situational | Domain-Specific",
      "question": "The interview question",
      "purpose": "What competency this tests",
      "whatToLookFor": "Signals of a strong answer"
    }
  ]
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.parse(body);

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rate = checkRateLimit(ip);
    const rateHeaders = {
      "content-type": "application/json",
      "x-ratelimit-limit": "5",
      "x-ratelimit-remaining": String(rate.remaining),
      "x-ratelimit-reset": String(Math.ceil(rate.reset / 1000)),
    };

    if (rate.limited) {
      return new Response(
        JSON.stringify({
          message: "Rate limit exceeded",
          retryAfterSeconds: Math.max(0, Math.ceil((rate.reset - Date.now()) / 1000)),
        }),
        {
          status: 429,
          headers: {
            ...rateHeaders,
            "retry-after": String(Math.max(0, Math.ceil((rate.reset - Date.now()) / 1000))),
          },
        }
      );
    }

    const aiResponse = await generateInterviewQuestions(SYSTEM_PROMPT, parsed.jobTitle);

    const validated = ResponseSchema.parse(aiResponse);

    return new Response(JSON.stringify(validated), { status: 200, headers: rateHeaders });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "content-type": "application/json" } });
  }
}
