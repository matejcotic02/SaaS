import { Link } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockUsage } from "@/data/dashboardMockData";

type ProgressProps = {
  label: string;
  used: number;
  limit: number;
};

function UsageProgress({ label, used, limit }: ProgressProps) {
  const percent = limit === 0 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const danger = percent >= 90;
  const warning = percent >= 75 && percent < 90;
  const fill = danger
    ? "from-red-500 to-red-400"
    : warning
      ? "from-amber-500 to-amber-400"
      : "from-primary to-primary/70";

  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-neutral-400">{label}</span>
        <span className="tabular-nums text-neutral-300">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div
        className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={`${label} usage`}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fill} transition-[width] duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function UsageCard() {
  const u = mockUsage;

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6"
      aria-labelledby="usage-title"
    >
      <header className="flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          <CreditCard className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="usage-title"
            className="text-base font-semibold text-foreground"
          >
            Plan & Usage
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            {u.periodStart} – {u.periodEnd}
          </p>
        </div>
        <StatusBadge variant={u.status === "Active" ? "success" : "warning"} dot>
          {u.status}
        </StatusBadge>
      </header>

      <div className="mt-4 flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-foreground">{u.plan}</p>
        <span className="text-xs text-neutral-400">plan</span>
      </div>

      <div className="mt-5 space-y-4">
        <UsageProgress
          label="Calls used"
          used={u.callsUsed}
          limit={u.callsLimit}
        />
        <UsageProgress label="SMS used" used={u.smsUsed} limit={u.smsLimit} />
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full sm:flex-1"
        >
          <Link to="/billing">Manage Billing</Link>
        </Button>
        <Button
          asChild
          variant="default"
          size="sm"
          className="w-full sm:flex-1"
        >
          <Link to="/billing">Upgrade Plan</Link>
        </Button>
      </div>
    </section>
  );
}
