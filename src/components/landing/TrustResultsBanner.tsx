import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

const chips = [
  "Never miss another inbound lead",
  "Book more jobs automatically",
  "Reduce no-shows with reminders",
  "Keep your team focused on the work",
];

export function TrustResultsBanner() {
  return (
    <section
      id="trust"
      className="border-b border-[var(--border)] bg-background py-6 sm:py-8"
      aria-label="Key outcomes"
    >
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {chips.map((t) => (
            <div
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-card/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-[0_0_24px_-8px_rgba(194,61,72,0.35)] sm:text-sm"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Check className="h-3 w-3" aria-hidden />
              </span>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
