import * as React from "react";
import { cn } from "@/lib/utils";

const Accordion = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props} />
  )
);
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDetailsElement,
  React.ComponentPropsWithoutRef<"details">
>(({ className, ...props }, ref) => (
  <details
    ref={ref}
    className={cn(
      "group rounded-2xl border border-border/60 bg-card/80 p-4",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLMapElement,
  React.ComponentPropsWithoutRef<"summary">
>(({ className, ...props }, ref) => (
  <summary
    ref={ref}
    className={cn(
      "cursor-pointer list-none text-sm font-semibold text-foreground",
      className
    )}
    {...props}
  />
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
