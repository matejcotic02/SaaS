import type { ReactNode } from "react";
import { AuthBackgroundPattern } from "@/components/auth/AuthBackgroundPattern";

type AuthLayoutProps = {
  children: ReactNode;
};

/**
 * Full-viewport auth shell: white-squares grid, soft glows, centered content.
 * Page content (e.g. CleanMinimalAuthCard) is passed as children.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-10 sm:py-12">
      <AuthBackgroundPattern />

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-white/[0.03] blur-3xl" />

      <div className="relative z-10 flex w-full flex-col items-center">{children}</div>
    </div>
  );
}
