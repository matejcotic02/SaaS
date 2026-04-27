import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  Phone,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockSetupChecklist } from "@/data/dashboardMockData";
import { cn } from "@/lib/utils";

export function SetupChecklist() {
  const items = mockSetupChecklist;
  const total = items.length;
  const completed = items.filter((i) => i.complete).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const currentStep = items.find((item) => !item.complete) ?? items[0];

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      aria-labelledby="setup-title"
    >
      <span
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 border-b border-white/5 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-6">
        <div className="min-w-0">
          <h2
            id="setup-title"
            className="text-base font-semibold text-foreground sm:text-lg"
          >
            Complete Your Setup
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Follow these steps to get your AI phone assistant up and running.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/25">
            {completed}/{total} complete
          </span>
          <button
            type="button"
            className="rounded-full px-2.5 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-300"
          >
            Hide
          </button>
        </div>
      </div>

      <div className="relative px-5 pt-4 sm:px-6">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/5"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Setup progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ul className="relative space-y-3 p-5 sm:p-6">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "rounded-xl border transition-colors",
              item.id === currentStep.id
                ? "border-primary/25 bg-primary/10 shadow-[0_0_30px_rgba(194,61,72,0.08)]"
                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]",
            )}
          >
            <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-inset",
                    item.complete
                      ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
                      : item.id === currentStep.id
                        ? "bg-primary text-white ring-primary/30"
                        : "bg-white/5 text-neutral-400 ring-white/10",
                  )}
                >
                  {item.complete ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  ) : (
                    item.step
                  )}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {item.step}. {item.label}
                    </h3>
                    {item.complete ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" aria-hidden />
                        Complete
                      </span>
                    ) : item.id === currentStep.id ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary ring-1 ring-inset ring-primary/25">
                        <Clock3 className="h-3 w-3" aria-hidden />
                        Current
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                    {item.description}
                  </p>
                  {item.secondaryNote ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
                      <Phone className="h-3.5 w-3.5" aria-hidden />
                      {item.secondaryNote}
                    </p>
                  ) : null}
                </div>
              </div>
              {item.href && item.ctaLabel ? (
                <Button
                  asChild
                  variant={item.complete ? "secondary" : "default"}
                  size="sm"
                  className={cn(
                    "w-full sm:w-auto",
                    !item.complete && "group",
                  )}
                >
                  <Link to={item.href}>
                    {item.complete ? (
                      <Settings2 className="h-4 w-4 shrink-0" aria-hidden />
                    ) : null}
                    {item.ctaLabel}
                    {!item.complete ? (
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                    ) : null}
                  </Link>
                </Button>
              ) : item.complete ? null : (
                <Circle className="h-5 w-5 shrink-0 text-neutral-500" aria-hidden />
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
