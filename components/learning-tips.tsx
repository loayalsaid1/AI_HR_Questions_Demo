import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tips = [
  {
    title: "Active Recall",
    body: "Do not just read answers. Try to answer out loud first, then compare with the guidance.",
  },
  {
    title: "Focused vs. Diffuse Mode",
    body: "If you are stuck, step away. A short break often unlocks new angles.",
  },
  {
    title: "Spaced Repetition",
    body: "Review questions today, tomorrow, and again in a few days for stronger memory.",
  },
];

export function LearningTips() {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-foreground">Learning tips</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Short reminders to make your practice sessions more effective.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {tips.map((tip) => (
          <Card key={tip.title}>
            <CardHeader>
              <CardTitle className="text-sm">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{tip.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
