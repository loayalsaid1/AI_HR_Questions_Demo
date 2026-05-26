"use client";

import { useState } from "react";
import { Hero } from "@/components/hero";
import { InterviewForm } from "@/components/interview-form";
import { LearningTips } from "@/components/learning-tips";
import { QuestionsSection } from "@/components/questions-section";
import { useInterviewQuestions } from "@/hooks/useInterviewQuestions";
import { RequestSchema } from "@/utils/schemas";
import type { ApiError } from "@/hooks/useInterviewQuestions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function InterviewPage() {
  const [jobTitle, setJobTitle] = useState("Customer Success Manager");
  const [inputError, setInputError] = useState<string | null>(null);
  const interviewMutation = useInterviewQuestions();

  const handleSubmit = () => {
    const parsed = RequestSchema.safeParse({ jobTitle });
    if (!parsed.success) {
      setInputError("Please enter a valid job title (2-100 characters).");
      return;
    }

    setInputError(null);
    interviewMutation.mutate(parsed.data.jobTitle);
  };

  const error = interviewMutation.error as ApiError | null;
  const rateLimit = interviewMutation.data?.rateLimit || error?.rateLimit || null;
  const retryAt = error?.retryAfterSeconds
    ? new Date(Date.now() + error.retryAfterSeconds * 1000)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pb-20 pt-16 sm:pt-20">
        <Hero />

        <InterviewForm
          jobTitle={jobTitle}
          onJobTitleChange={setJobTitle}
          onSubmit={handleSubmit}
          isLoading={interviewMutation.isPending}
          inputError={inputError}
        />

        {error ? (
          <Alert className="border-destructive/40 bg-destructive/10 text-destructive">
            <AlertTitle>{error.message}</AlertTitle>
            {retryAt ? (
              <AlertDescription>
                Try again at {retryAt.toLocaleTimeString()}.
              </AlertDescription>
            ) : null}
          </Alert>
        ) : null}

        <QuestionsSection
          data={interviewMutation.data?.data}
          isLoading={interviewMutation.isPending}
        />

        {rateLimit ? (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="subtle">
              {rateLimit.remaining} / {rateLimit.limit} remaining
            </Badge>
            <span>
              Resets at{" "}
              {rateLimit.reset ? new Date(rateLimit.reset * 1000).toLocaleTimeString() : "soon"}.
            </span>
          </div>
        ) : null}

        <LearningTips />
      </main>
    </div>
  );
}
