import { X, Check } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FadeInItem, FadeInStagger } from "./FadeIn";

const without = [
  "Missed calls during busy hours",
  "Leads go cold before anyone follows up",
  "Staff spends time on repetitive questions",
  "Booking happens slowly and inconsistently",
  "More no-shows without reminder workflows",
  "Less visibility into call outcomes",
];

const withoutMetrics = ["Calls missed", "Slow response", "Manual work", "No-show risk"];

const withItems = [
  "Calls answered automatically",
  "Lead follow-up happens consistently",
  "Booking happens faster",
  "SMS reminders reduce no-shows",
  "Staff focuses on real shop work",
  "Dashboard shows calls, leads, and appointments clearly",
];

const withMetrics = ["Faster response", "Fewer missed opps", "Consistent booking", "Better experience"];

export function ComparisonSection() {
  return (
    <section id="compare" className="border-b border-[var(--border)] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Why businesses perform better with CallBay"
          subtitle="See the difference between handling calls manually and letting CallBay manage your phone workflow."
        />
        <div className="relative mt-14">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--border)] bg-card text-lg font-bold text-foreground shadow-[0_8px_40px_rgba(0,0,0,0.5)] lg:flex"
            aria-hidden
          >
            VS
          </div>
          <div className="mb-6 flex justify-center lg:mb-0 lg:hidden">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--border)] bg-card text-sm font-bold text-foreground shadow-lg">
              VS
            </span>
          </div>

          <FadeInStagger className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:gap-x-24">
            <FadeInItem className="h-full min-h-0">
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-primary/50 bg-card p-6 shadow-[0_0_0_1px_rgba(194,61,72,0.3),0_0_50px_-12px_rgba(194,61,72,0.45)] sm:p-8">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <X className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">Without CallBay</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Missed calls, delayed responses, wasted staff time, and lower booking rates.
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-muted-foreground">
                  {without.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-[var(--border)] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Result</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">Lower booking rate</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {withoutMetrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-md border border-[var(--border)] bg-background/60 px-2 py-1 text-[11px] text-muted-foreground"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInItem>
            <FadeInItem className="h-full min-h-0">
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-emerald-500/40 bg-card p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_0_50px_-12px_rgba(16,185,129,0.2)] sm:p-8">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Check className="h-4 w-4" />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">With CallBay</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every call is answered, leads get followed up, and more jobs make it onto the calendar.
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-muted-foreground">
                  {withItems.map((t) => (
                    <li key={t} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500/80" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-[var(--border)] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">Result</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">More booked jobs</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {withMetrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-[11px] text-emerald-200/80"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInItem>
          </FadeInStagger>
        </div>
      </div>
    </section>
  );
}
