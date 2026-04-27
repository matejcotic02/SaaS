import { Link } from "react-router-dom";
import { Play, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusVariant } from "@/components/shared/StatusBadge";
import { toast } from "@/components/shared/Toaster";
import {
  mockOutboundCampaign,
  type OutboundCampaign,
} from "@/data/dashboardMockData";

const statusVariant: Record<OutboundCampaign["status"], StatusVariant> = {
  Ready: "info",
  Paused: "warning",
  Running: "success",
};

type Kpi = { label: string; value: string };

export function OutboundCampaignCard() {
  const c = mockOutboundCampaign;

  const kpis: Kpi[] = [
    { label: "Calls queued", value: String(c.queued) },
    { label: "Calls completed", value: String(c.completed) },
    { label: "Answer rate", value: c.answerRate },
    { label: "Bookings created", value: String(c.bookings) },
  ];

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6"
      aria-labelledby="campaign-title"
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            Outbound Campaign
          </p>
          <h2
            id="campaign-title"
            className="mt-0.5 truncate text-base font-semibold text-foreground sm:text-lg"
          >
            {c.name}
          </h2>
        </div>
        <StatusBadge variant={statusVariant[c.status]} dot>
          {c.status}
        </StatusBadge>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3"
          >
            <p className="text-[11px] uppercase tracking-wide text-neutral-500">
              {k.label}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
              {k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            toast("Outbound campaign controls will be connected later.", {
              description: "Hooking up the dialer is coming next.",
            })
          }
          className="w-full sm:w-auto"
        >
          <Play className="h-4 w-4 shrink-0" aria-hidden />
          Start Campaign
        </Button>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          <Link to="/dashboard?view=outbound-calls">
            <ListChecks className="h-4 w-4 shrink-0" aria-hidden />
            View Outbound Queue
          </Link>
        </Button>
      </div>
    </section>
  );
}
