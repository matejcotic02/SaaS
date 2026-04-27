import { Link } from "react-router-dom";
import MagneticDock from "@/components/ui/magnetic-dock";
import { cn } from "@/lib/utils";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(194,61,72,0.5)]" />
      <span className="text-base font-semibold tracking-tight">
        <span className="text-foreground">Call</span>
        <span className="text-primary">Bay</span>
      </span>
    </div>
  );
}

const product = [
  { label: "Solution", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "AI Agent", href: "#how-it-works" },
];

const company = [
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Support", href: "#" },
];

const legal = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Security", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-background py-12">
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              CallBay helps service businesses answer calls, book more jobs, follow up with leads, and
              cut no-shows—without adding headcount at the phone.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {product.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {company.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {legal.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex w-full justify-center sm:justify-end">
          <MagneticDock />
        </div>
        <div className="mt-6 border-t border-[var(--border)] pt-6 sm:mt-8 sm:pt-8">
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            © 2026 CallBay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
