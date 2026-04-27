import { Link } from "react-router-dom";
import {
  ArrowRight,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";
import { StatusBadge, type StatusVariant } from "@/components/shared/StatusBadge";
import {
  mockCallActivity,
  type CallActivityRow,
  type CallOutcome,
  type CallStatus,
} from "@/data/dashboardMockData";

const outcomeVariant: Record<CallOutcome, StatusVariant> = {
  Booked: "success",
  "Follow-up": "info",
  Transferred: "warning",
  "No answer": "danger",
  Voicemail: "neutral",
};

const statusVariant: Record<CallStatus, StatusVariant> = {
  Completed: "success",
  Failed: "danger",
  "In Progress": "info",
};

function DirectionPill({ direction }: { direction: CallActivityRow["direction"] }) {
  const Icon = direction === "Inbound" ? PhoneIncoming : PhoneOutgoing;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-neutral-200 ring-1 ring-inset ring-white/10">
      <Icon className="h-3 w-3" aria-hidden />
      {direction}
    </span>
  );
}

export function CallActivityTable() {
  const rows = mockCallActivity;

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      aria-labelledby="calls-title"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/5 px-5 py-4 sm:px-6">
        <div>
          <h2
            id="calls-title"
            className="text-base font-semibold text-foreground"
          >
            Today’s Call Activity
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Inbound and outbound calls handled by your AI agent
          </p>
        </div>
        <Link
          to="/calls"
          className="group hidden items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover sm:inline-flex"
        >
          View all calls
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="hidden min-h-0 flex-1 overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Direction</th>
              <th className="px-6 py-3 font-medium">Customer / Lead</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Outcome</th>
              <th className="px-6 py-3 font-medium">Duration</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-white/[0.02]"
              >
                <td className="whitespace-nowrap px-6 py-3 text-neutral-300">
                  {row.time}
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <DirectionPill direction={row.direction} />
                </td>
                <td className="whitespace-nowrap px-6 py-3 font-medium text-foreground">
                  {row.customer}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-neutral-300">
                  {row.phone}
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <StatusBadge variant={outcomeVariant[row.outcome]}>
                    {row.outcome}
                  </StatusBadge>
                </td>
                <td className="whitespace-nowrap px-6 py-3 tabular-nums text-neutral-300">
                  {row.duration}
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <StatusBadge variant={statusVariant[row.status]} dot>
                    {row.status}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <ul className="flex-1 divide-y divide-white/5 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="space-y-2 px-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-neutral-400">{row.time}</span>
              <DirectionPill direction={row.direction} />
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                {row.customer}
              </p>
              <span className="text-xs tabular-nums text-neutral-400">
                {row.duration}
              </span>
            </div>
            <p className="text-xs text-neutral-400">{row.phone}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <StatusBadge variant={outcomeVariant[row.outcome]}>
                {row.outcome}
              </StatusBadge>
              <StatusBadge variant={statusVariant[row.status]} dot>
                {row.status}
              </StatusBadge>
            </div>
          </li>
        ))}
        </ul>
      </div>

      <footer className="shrink-0 border-t border-white/5 px-5 py-3 sm:hidden">
        <Link
          to="/calls"
          className="group inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
        >
          View all calls
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </footer>
    </section>
  );
}
