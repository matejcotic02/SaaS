import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
};

export function MetricCard({ icon: Icon, label, value, className = "" }: MetricCardProps) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-[var(--border)] bg-secondary/80 p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Icon className="h-4 w-4" aria-hidden />
        </div>
      </div>
    </div>
  );
}
