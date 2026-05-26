import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <header className="text-center sm:text-left">
      <Badge variant="subtle" className="uppercase tracking-[0.2em]">
        InnerPrep
      </Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Master Your Next Interview
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Enter a job title below to generate role-specific interview questions.
      </p>
    </header>
  );
}
