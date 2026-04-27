import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { PlasticButton } from "@/components/ui/plastic-button";

const nav = [
  { label: "Features", href: "#features" },
  { label: "Compare", href: "#compare" },
  { label: "Industries", href: "#industry" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="CallBay home">
      <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(194,61,72,0.55)]" />
      <span className="text-base font-semibold tracking-tight">
        <span className="text-foreground">Call</span>
        <span className="text-primary">Bay</span>
      </span>
    </Link>
  );
}

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <div className="flex items-center justify-between gap-4 rounded-full border border-[var(--border)] bg-card/80 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <Logo />

            <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden w-auto min-w-0 items-center gap-2.5 sm:gap-3 md:flex">
              <Link to="/login" className="inline-block w-auto shrink-0">
                <PlasticButton asChild size="sm" variant="secondary" className="!w-auto min-w-[5.5rem]">
                  Sign In
                </PlasticButton>
              </Link>
              <Link to="/signup" className="inline-block w-auto min-w-0 shrink-0">
                <PlasticButton asChild size="sm" variant="primary" className="!w-auto min-w-[7.5rem] px-4">
                  Sign Up
                </PlasticButton>
              </Link>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-secondary/80 text-foreground md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {open ? (
            <div className="rounded-2xl border border-[var(--border)] bg-card/95 p-4 shadow-lg backdrop-blur-md md:hidden">
              <div className="flex flex-col gap-1">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/login"
                  className="mt-1 block w-full"
                  onClick={() => setOpen(false)}
                >
                  <PlasticButton asChild size="md" variant="secondary" className="w-full">
                    Sign In
                  </PlasticButton>
                </Link>
                <Link
                  to="/signup"
                  className="mt-1 block w-full"
                  onClick={() => setOpen(false)}
                >
                  <PlasticButton asChild size="md" variant="primary" className="w-full">
                    Sign Up
                  </PlasticButton>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
