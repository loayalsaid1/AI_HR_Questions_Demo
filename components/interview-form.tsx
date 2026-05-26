"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InterviewFormProps = {
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  inputError?: string | null;
};

export function InterviewForm({
  jobTitle,
  onJobTitleChange,
  onSubmit,
  isLoading,
  inputError,
}: InterviewFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 w-full">
      <Label htmlFor="job-title">
        Job title
      </Label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Input
          id="job-title"
          value={jobTitle}
          onChange={(event) => onJobTitleChange(event.target.value)}
          placeholder="Customer Success Manager"
        />
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
      {inputError ? (
        <p className="mt-2 text-sm text-destructive">{inputError}</p>
      ) : null}
    </form>
  );
}
