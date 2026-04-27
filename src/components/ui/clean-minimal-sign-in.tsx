import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AuthIconBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-secondary/90 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** CallBay wordmark link; use above the feature icon inside auth cards. */
export function AuthBrandLink() {
  return (
    <Link
      to="/"
      className="mb-6 flex items-center justify-center gap-2"
      aria-label="CallBay home"
    >
      <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(194,61,72,0.55)]" />
      <span className="text-base font-semibold tracking-tight">
        <span className="text-foreground">Call</span>
        <span className="text-primary">Bay</span>
      </span>
    </Link>
  );
}

type CleanMinimalAuthCardProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Extra class on the outer card */
  className?: string;
  /** Override default primary color on the header icon (e.g. success state) */
  iconClassName?: string;
};

/**
 * Dark, CallBay-styled shell inspired by clean-minimal sign-in layouts
 * (icon badge, headline, subcopy, form area). No demo auth logic.
 */
export function CleanMinimalAuthCard({
  icon: Icon,
  title,
  subtitle,
  children,
  className,
  iconClassName,
}: CleanMinimalAuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-3xl border border-[var(--border)] bg-gradient-to-b from-primary/[0.08] via-card to-card p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)]",
        className
      )}
    >
      <AuthBrandLink />
      <AuthIconBadge>
        <Icon
          className={cn("h-7 w-7 text-primary", iconClassName)}
          strokeWidth={1.75}
        />
      </AuthIconBadge>
      <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {subtitle}
      </p>
      {children}
    </div>
  );
}

type AuthInputWithIconProps = {
  icon: LucideIcon;
  inputClassName?: string;
  children: ReactNode;
};

/**
 * Wraps an Input (or password field) with a leading lucide icon.
 * Place the Input as child; add pl-10 on the Input or use className here.
 */
export function AuthInputWithIcon({
  icon: Icon,
  inputClassName,
  children,
}: AuthInputWithIconProps) {
  return (
    <div className={cn("relative", inputClassName)}>
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </div>
  );
}
