import type { InterviewResponse } from "@/hooks/useInterviewQuestions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type QuestionsSectionProps = {
  data: InterviewResponse | undefined;
  isLoading: boolean;
};

export function QuestionsSection({ data, isLoading }: QuestionsSectionProps) {
  if (isLoading) {
    return (
      <section className="mt-10">
        <p className="mb-3 text-sm text-muted-foreground">
          Crafting tailored interview questions...
        </p>
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-20 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Role context</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{data.roleContext}</p>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Interview questions
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tailored prompts based on the role context above.
          </p>
        </div>
        <Badge variant="subtle">{data.questions.length} questions</Badge>
      </div>

      <Accordion className="mt-6">
        {data.questions.map((question, index) => (
          <AccordionItem key={`${question.type}-${index}`}>
            <AccordionTrigger>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {question.type}
              </span>
              <span className="mt-2 block text-base font-semibold text-foreground">
                {question.question}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Click to reveal purpose and what to look for.
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p>
                <span className="font-semibold text-foreground">Purpose:</span> {question.purpose}
              </p>
              <p>
                <span className="font-semibold text-foreground">What to look for:</span> {question.whatToLookFor}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
