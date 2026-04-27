import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { mockLeads } from "@/data/dashboardMockData";

export function LeadSummary() {
  const { stats, priority } = mockLeads;

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6"
      aria-labelledby="leads-title"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2
            id="leads-title"
            className="text-base font-semibold text-foreground"
          >
            Lead Follow-Up
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Snapshot of incoming and prioritized leads
          </p>
        </div>
        <Link
          to="/leads"
          className="group hidden items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover sm:inline-flex"
        >
          Open leads
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3"
          >
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">
              {s.label}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          High-priority leads
        </p>
        <ul className="mt-2 flex-1 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
          {priority.map((lead) => (
            <li
              key={lead.id}
              className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-white/[0.04]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {lead.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {lead.name}
                </p>
                <p className="truncate text-xs text-neutral-400">
                  {lead.reason}
                </p>
              </div>
              <span className="hidden text-xs text-neutral-300 sm:inline">
                {lead.action}
              </span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-neutral-500"
                aria-hidden
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-5 sm:hidden">
        <Link
          to="/leads"
          className="group inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
        >
          Open leads
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
