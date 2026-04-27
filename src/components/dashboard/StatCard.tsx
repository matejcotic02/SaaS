import type { ComponentType } from "react";
import {
  Phone,
  CalendarCheck,
  Users,
  PhoneOutgoing,
  MessageSquare,
  ArrowRightLeft,
  type LucideProps,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatIconKey, StatItem } from "@/data/dashboardMockData";

const iconMap: Record<StatIconKey, ComponentType<LucideProps>> = {
  phone: Phone,
  calendarCheck: CalendarCheck,
  users: Users,
  phoneOutgoing: PhoneOutgoing,
  messageSquare: MessageSquare,
  arrowRightLeft: ArrowRightLeft,
};

type StatCardProps = {
  stat: StatItem;
  className?: string;
  compact?: boolean;
};

export function StatCard({ stat, className, compact = false }: StatCardProps) {
  const Icon = iconMap[stat.icon];

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        compact ? "gap-2 p-3 sm:p-4" : "gap-3 p-5",
        "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <p className="min-w-0 flex-1 text-[10px] font-medium uppercase leading-snug tracking-wide text-neutral-400 sm:text-xs">
          {stat.label}
        </p>
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
            compact ? "h-7 w-7" : "h-9 w-9",
          )}
        >
          <Icon className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden />
        </span>
      </div>
      <div>
        <p
          className={cn(
            "font-semibold tabular-nums text-foreground",
            compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl",
          )}
        >
          {stat.value}
        </p>
        <p className="mt-1 text-xs text-neutral-400">{stat.change}</p>
      </div>
      <span
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity duration-300 group-hover:bg-primary/10"
        aria-hidden
      />
    </div>
  );
}
