import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const primarySurface = {
  background: "linear-gradient(to bottom, rgb(222, 95, 105), rgb(150, 42, 52))",
  boxShadow:
    "0 2px 8px 0 rgba(194, 61, 72, 0.4), 0 1.5px 0 0 rgba(255,255,255,0.22) inset, 0 -2px 8px 0 rgba(100, 28, 36, 0.55) inset",
} as const;

const secondarySurface = {
  background: "linear-gradient(to bottom, rgb(45, 45, 45), rgb(20, 20, 20))",
  boxShadow:
    "0 2px 8px 0 rgba(0, 0, 0, 0.45), 0 1.5px 0 0 rgba(255,255,255,0.12) inset, 0 -2px 8px 0 rgba(0, 0, 0, 0.35) inset",
} as const;

const primaryInnerRing =
  "0 0 0 2px rgba(255,255,255,0.08) inset, 0 1.5px 0 0 rgba(255,255,255,0.16) inset, 0 -2px 8px 0 rgba(194, 61, 72, 0.15) inset";

const secondaryInnerRing =
  "0 0 0 2px rgba(255,255,255,0.07) inset, 0 1.5px 0 0 rgba(255,255,255,0.1) inset, 0 -2px 8px 0 rgba(0,0,0,0.25) inset";

type PlasticButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  shape?: "pill" | "rounded";
  size?: "sm" | "md" | "lg";
  /** Space between for accordion-style rows */
  align?: "center" | "between";
  /** Render as `span` inside `<Link>` (avoids nested buttons) */
  asChild?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

const sizeClasses = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
} as const;

const shapeRadius = {
  pill: "rounded-full",
  rounded: "rounded-[var(--radius)]",
} as const;

function PlasticLayers({
  variant,
  shape,
}: {
  variant: "primary" | "secondary";
  shape: "pill" | "rounded";
}) {
  const isPrimary = variant === "primary";
  const topGloss = isPrimary
    ? "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 80%, transparent 100%)"
    : "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 80%, transparent 100%)";
  return (
    <>
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-0 z-20 h-[38%] w-[78%] -translate-x-1/2",
          shape === "pill" ? "rounded-t-full" : "rounded-t-[calc(var(--radius)-3px)]"
        )}
        style={{
          background: topGloss,
          filter: "blur(1.5px)",
        }}
      />
      <span
        className={cn("pointer-events-none absolute inset-0 z-0", shapeRadius[shape])}
        style={{
          boxShadow: isPrimary ? primaryInnerRing : secondaryInnerRing,
        }}
      />
    </>
  );
}

export function PlasticButton({
  children,
  variant = "primary",
  shape = "pill",
  size = "md",
  align = "center",
  asChild = false,
  className,
  type = "button",
  ...buttonProps
}: PlasticButtonProps) {
  const surface = variant === "primary" ? primarySurface : secondarySurface;
  const variantInteractive =
    variant === "primary"
      ? cn(
          "text-white",
          "hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-105 hover:drop-shadow-[0_0_30px_rgba(248,113,113,0.35)]",
          "active:translate-y-0 active:scale-[0.99]",
          "disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:brightness-100 disabled:hover:drop-shadow-none",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:hover:brightness-100 motion-reduce:hover:drop-shadow-none motion-reduce:active:scale-100"
        )
      : cn(
          "border border-white/10 text-white",
          "hover:-translate-y-0.5 hover:border-white/25 hover:text-white hover:brightness-110 hover:drop-shadow-[0_0_24px_rgba(255,255,255,0.08)]",
          "active:translate-y-0 active:scale-[0.99]",
          "disabled:hover:translate-y-0 disabled:hover:brightness-100 disabled:hover:drop-shadow-none disabled:hover:border-white/10",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:brightness-100 motion-reduce:hover:drop-shadow-none motion-reduce:hover:border-white/10 motion-reduce:active:scale-100"
        );

  const baseClass = cn(
    "group relative inline-flex w-full max-w-full items-center font-semibold transition-all duration-300 ease-out",
    variantInteractive,
    shapeRadius[shape],
    sizeClasses[size],
    align === "between" ? "justify-stretch py-3" : "justify-center",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  );

  const innerClass = cn(
    "relative z-10 flex w-full min-w-0 items-center gap-2",
    align === "between" ? "justify-between text-left" : "justify-center text-center"
  );

  if (asChild) {
    return (
      <span className={cn(baseClass, "cursor-inherit select-none", className)} style={surface}>
        <span className={innerClass}>{children}</span>
        <PlasticLayers variant={variant} shape={shape} />
      </span>
    );
  }

  return (
    <button
      type={type}
      className={cn(
        "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:active:translate-y-0",
        baseClass,
        className
      )}
      style={surface}
      {...buttonProps}
    >
      <span className={innerClass}>{children}</span>
      <PlasticLayers variant={variant} shape={shape} />
    </button>
  );
}
