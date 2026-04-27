import {
  Home,
  CalendarDays,
  ClipboardList,
  Users,
  Bot,
  Settings2,
  History,
  PhoneOutgoing,
  MessageSquare,
  CircleHelp,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

type SidebarItem = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
};

type SidebarGroup = {
  label: string;
  items: SidebarItem[];
};

const navSidebarGroups: SidebarGroup[] = [
  {
    label: "MAIN",
    items: [
      { icon: Home, label: "Overview", active: true },
      { icon: CalendarDays, label: "Calendar" },
      { icon: ClipboardList, label: "Bookings" },
      { icon: Users, label: "Customers" },
    ],
  },
  {
    label: "MY AGENT",
    items: [
      { icon: Bot, label: "Agent Settings" },
      { icon: Settings2, label: "Services & Pricing" },
      { icon: History, label: "Call History" },
      { icon: PhoneOutgoing, label: "Outbound Calls" },
      { icon: MessageSquare, label: "Reminders" },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { icon: CircleHelp, label: "Help & Info" },
      { icon: Settings2, label: "Settings" },
    ],
  },
];

const stats = [
  { label: "Calls Today", value: "24" },
  { label: "Bookings This Week", value: "18" },
  { label: "New Leads", value: "42" },
  { label: "Transfer Rate", value: "12%" },
];

const appointments = [
  {
    name: "Sarah M.",
    service: "Window Tint",
    time: "Today 2:00 PM",
    status: "Confirmed",
  },
  {
    name: "James R.",
    service: "Ceramic Coating",
    time: "Tomorrow 10:30 AM",
    status: "Confirmed",
  },
  {
    name: "Alex P.",
    service: "Paint Protection Film",
    time: "Friday 1:00 PM",
    status: "Pending",
  },
];

const calls = [
  { direction: "Inbound", outcome: "Booked", duration: "4m 12s" },
  { direction: "Outbound", outcome: "Follow-up", duration: "2m 48s" },
  { direction: "Inbound", outcome: "Transferred", duration: "1m 35s" },
];

const checklist = [
  "AI agent active",
  "Phone number assigned",
  "Business hours configured",
  "SMS reminders enabled",
];

export function DashboardPreviewSection() {
  return (
    <section id="dashboard" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <SectionHeader
          title="A complete command center for calls, leads, and bookings"
          subtitle="CallBay gives you visibility into every customer interaction."
        />

        <div className="relative mt-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-card shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-transparent pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:min-h-[420px]">
            <aside className="border-b border-[var(--border)] bg-secondary/40 p-3 lg:w-52 lg:shrink-0 lg:border-b-0 lg:border-r">
              {navSidebarGroups.map((group, groupIndex) => (
                <div key={group.label} className={cn(groupIndex > 0 && "mt-3 border-t border-[var(--border)] pt-3")}>
                  <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  <nav className="flex flex-wrap gap-1 lg:flex-col" aria-label={group.label}>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className={cn(
                            "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium",
                            item.active ? "bg-primary/15 text-primary" : "text-muted-foreground",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                          <span className="truncate">{item.label}</span>
                        </div>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </aside>

            <div className="min-w-0 flex-1 p-4 sm:p-5">
              <header className="mb-4 flex flex-col gap-2 border-b border-[var(--border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">CallBay Dashboard</p>
                  <p className="text-xs text-muted-foreground">Service business overview</p>
                </div>
                <div className="h-2 w-32 max-w-full rounded-full bg-secondary">
                  <div className="h-full w-3/4 rounded-full bg-primary/50" />
                </div>
              </header>

              <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-[var(--radius)] border border-[var(--border)] bg-background/60 px-3 py-2"
                  >
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-semibold tabular-nums text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-background/40">
                  <p className="border-b border-[var(--border)] px-3 py-2 text-xs font-semibold text-foreground">
                    Upcoming appointments
                  </p>
                  <div className="hidden sm:block">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] uppercase text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 font-medium">Customer</th>
                          <th className="px-2 py-2 font-medium">Service</th>
                          <th className="px-2 py-2 font-medium">Time</th>
                          <th className="px-2 py-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((a) => (
                          <tr key={a.name} className="border-t border-[var(--border)]">
                            <td className="px-3 py-2 font-medium text-foreground">{a.name}</td>
                            <td className="px-2 py-2 text-muted-foreground">{a.service}</td>
                            <td className="px-2 py-2 text-muted-foreground whitespace-nowrap">
                              {a.time}
                            </td>
                            <td className="px-2 py-2">
                              <span
                                className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                  a.status === "Confirmed"
                                    ? "bg-primary/15 text-primary"
                                    : "bg-white/5 text-muted-foreground"
                                }`}
                              >
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ul className="sm:hidden">
                    {appointments.map((a) => (
                      <li
                        key={a.name}
                        className="border-t border-[var(--border)] px-3 py-2 text-xs"
                      >
                        <p className="font-medium text-foreground">{a.name}</p>
                        <p className="text-muted-foreground">
                          {a.service} · {a.time} · {a.status}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-background/40">
                  <p className="border-b border-[var(--border)] px-3 py-2 text-xs font-semibold text-foreground">
                    Recent calls
                  </p>
                  <div className="hidden sm:block">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] uppercase text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 font-medium">Type</th>
                          <th className="px-2 py-2 font-medium">Outcome</th>
                          <th className="px-2 py-2 font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calls.map((c) => (
                          <tr
                            key={`${c.direction}-${c.duration}`}
                            className="border-t border-[var(--border)]"
                          >
                            <td className="px-3 py-2 text-foreground">{c.direction}</td>
                            <td className="px-2 py-2 text-muted-foreground">{c.outcome}</td>
                            <td className="px-2 py-2 text-muted-foreground tabular-nums">
                              {c.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ul className="sm:hidden">
                    {calls.map((c) => (
                      <li
                        key={`${c.direction}-${c.duration}`}
                        className="border-t border-[var(--border)] px-3 py-2 text-xs"
                      >
                        <p className="text-foreground">
                          {c.direction} · {c.outcome}
                        </p>
                        <p className="text-muted-foreground tabular-nums">{c.duration}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-[var(--radius)] border border-[var(--border)] bg-background/40 p-3">
                <p className="text-xs font-semibold text-foreground">Setup checklist</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {checklist.map((line) => (
                    <li key={line} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Check className="h-3 w-3" aria-hidden />
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
