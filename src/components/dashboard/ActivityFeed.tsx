import type { ComponentType } from "react";
import {
  CalendarCheck,
  MessageSquare,
  PhoneOutgoing,
  Settings,
  UserCheck,
  ArrowRightLeft,
  type LucideProps,
} from "lucide-react";
import { mockActivity, type ActivityKind } from "@/data/dashboardMockData";
import { cn } from "@/lib/utils";

const kindIcon: Record<ActivityKind, ComponentType<LucideProps>> = {
  booking: CalendarCheck,
  outbound: PhoneOutgoing,
  sms: MessageSquare,
  lead: UserCheck,
  transfer: ArrowRightLeft,
  settings: Settings,
};

const kindColor: Record<ActivityKind, string> = {
  booking: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  outbound: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  sms: "bg-primary/10 text-primary ring-primary/20",
  lead: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  transfer: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
  settings: "bg-white/5 text-neutral-300 ring-white/10",
};

export function ActivityFeed() {
  const items = mockActivity;

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6"
      aria-labelledby="activity-title"
    >
      <header className="shrink-0">
        <h2
          id="activity-title"
          className="text-base font-semibold text-foreground"
        >
          Recent Activity
        </h2>
        <p className="mt-0.5 text-xs text-neutral-400">
          Latest events across your CallBay workspace
        </p>
      </header>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <ol className="flex-1 space-y-3">
        {items.map((item) => {
          const Icon = kindIcon[item.kind];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset",
                  kindColor[item.kind],
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-neutral-200">
                  {item.text}
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {item.timestamp}
                </p>
              </div>
            </li>
          );
        })}
        </ol>
      </div>
    </section>
  );
}
