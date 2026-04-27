import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { StatusBadge, type StatusVariant } from "@/components/shared/StatusBadge";
import {
  mockAppointments,
  type AppointmentSource,
  type AppointmentStatus,
} from "@/data/dashboardMockData";

const statusVariant: Record<AppointmentStatus, StatusVariant> = {
  Confirmed: "success",
  Pending: "warning",
  Cancelled: "danger",
};

const sourceVariant: Record<AppointmentSource, StatusVariant> = {
  "AI Call": "info",
  "Lead Follow-up": "info",
  Manual: "neutral",
};

type UpcomingAppointmentsProps = {
  compact?: boolean;
};

export function UpcomingAppointments({ compact = false }: UpcomingAppointmentsProps) {
  const rows = mockAppointments;
  const visibleRows = compact ? rows.slice(0, 3) : rows;

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      aria-labelledby="appts-title"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/5 px-5 py-4 sm:px-6">
        <div>
          <h2
            id="appts-title"
            className="text-base font-semibold text-foreground"
          >
            Upcoming Bookings
          </h2>
          <p className="mt-0.5 text-xs text-neutral-400">
            Confirmed and pending appointments coming up
          </p>
        </div>
        <Link
          to="/appointments"
          className="group hidden items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover sm:inline-flex"
        >
          {compact ? "View All" : "Manage appointments"}
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={
            compact
              ? "hidden"
              : "hidden min-h-0 flex-1 overflow-x-auto md:block"
          }
        >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Service</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visibleRows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-white/[0.02]"
              >
                <td className="whitespace-nowrap px-6 py-3 font-medium text-foreground">
                  {row.customer}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-neutral-300">
                  {row.service}
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-neutral-300">
                  {row.date}
                </td>
                <td className="whitespace-nowrap px-6 py-3 tabular-nums text-neutral-300">
                  {row.time}
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <StatusBadge variant={statusVariant[row.status]} dot>
                    {row.status}
                  </StatusBadge>
                </td>
                <td className="whitespace-nowrap px-6 py-3">
                  <StatusBadge variant={sourceVariant[row.source]}>
                    {row.source}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <ul
          className={
            compact
              ? "flex-1 divide-y divide-white/5"
              : "flex-1 divide-y divide-white/5 md:hidden"
          }
        >
        {visibleRows.map((row) => (
          <li key={row.id} className="space-y-1.5 px-5 py-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-foreground">
                {row.customer}
              </p>
              <span className="text-xs tabular-nums text-neutral-400">
                {row.date} · {row.time}
              </span>
            </div>
            <p className="text-xs text-neutral-400">{row.service}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <StatusBadge variant={statusVariant[row.status]} dot>
                {row.status}
              </StatusBadge>
              <StatusBadge variant={sourceVariant[row.source]}>
                {row.source}
              </StatusBadge>
            </div>
          </li>
        ))}
        </ul>
      </div>

      <footer
        className={
          compact
            ? "shrink-0 border-t border-white/5 px-5 py-3"
            : "shrink-0 border-t border-white/5 px-5 py-3 sm:hidden"
        }
      >
        <Link
          to="/appointments"
          className="group inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
        >
          {compact ? "View All" : "Manage appointments"}
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </footer>
    </section>
  );
}
