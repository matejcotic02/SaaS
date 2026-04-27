import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockReminders } from "@/data/dashboardMockData";

export function ReminderStatusCard() {
  const r = mockReminders;

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6"
      aria-labelledby="reminders-title"
    >
      <header className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          <MessageSquare className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="reminders-title"
            className="text-base font-semibold text-foreground"
          >
            SMS Reminders
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Automatic appointment reminders
          </p>
        </div>
        <StatusBadge variant={r.enabled ? "success" : "neutral"} dot>
          {r.enabled ? "Enabled" : "Disabled"}
        </StatusBadge>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
          <dt className="text-[11px] uppercase tracking-wide text-neutral-500">
            24h reminders
          </dt>
          <dd className="mt-1">
            <StatusBadge variant={r.reminder24h ? "success" : "neutral"}>
              {r.reminder24h ? "Active" : "Inactive"}
            </StatusBadge>
          </dd>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
          <dt className="text-[11px] uppercase tracking-wide text-neutral-500">
            2h reminders
          </dt>
          <dd className="mt-1">
            <StatusBadge variant={r.reminder2h ? "success" : "neutral"}>
              {r.reminder2h ? "Active" : "Inactive"}
            </StatusBadge>
          </dd>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
          <dt className="text-[11px] uppercase tracking-wide text-neutral-500">
            Sent this week
          </dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            {r.weekly}
          </dd>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
          <dt className="text-[11px] uppercase tracking-wide text-neutral-500">
            Scheduled today
          </dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-foreground">
            {r.today}
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">
          Recent reminder
        </p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-300">
          “{r.recentPreview}”
        </p>
      </div>

      <div className="mt-auto pt-5">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="group w-full sm:w-auto"
        >
          <Link to="/reminders">
            Manage Reminders
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
