import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

const variantClass: Record<StatusVariant, string> = {
  success:
    "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  danger: "bg-red-500/10 text-red-300 ring-red-500/20",
  info: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  neutral: "bg-white/5 text-neutral-300 ring-white/10",
};

type StatusBadgeProps = {
  variant?: StatusVariant;
  className?: string;
  children: ReactNode;
  dot?: boolean;
};

const dotClass: Record<StatusVariant, string> = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-sky-400",
  neutral: "bg-neutral-400",
};

export function StatusBadge({
  variant = "neutral",
  className,
  children,
  dot = false,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantClass[variant],
        className,
      )}
    >
      {dot ? (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotClass[variant])} />
      ) : null}
      {children}
    </span>
  );
}
