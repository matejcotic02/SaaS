import { Link } from "react-router-dom";
import {
  Bot,
  ClipboardList,
  History,
  Home,
  Link2,
  Mail,
  Phone,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PITCH_HERO = "Stop missing calls. Let CallBay book your appointments.";

const PITCH_FOOTER =
  "CallBay helps service businesses answer calls, book more jobs, follow up with leads, and cut no-shows—without adding headcount at the phone.";

const agentPhoneNumber = "+1 (302) 206-6446";
const supportEmail = "support@callbay.com";

const quickLinks: {
  label: string;
  to: string;
  description: string;
  icon: typeof Home;
}[] = [
  {
    label: "Overview",
    to: "/dashboard",
    description: "Dashboard home, metrics, and activity.",
    icon: Home,
  },
  {
    label: "Agent Settings",
    to: "/dashboard?view=agent-settings",
    description: "Configure your AI voice agent and behavior.",
    icon: Bot,
  },
  {
    label: "Call History",
    to: "/calls",
    description: "Review past calls and transcripts.",
    icon: History,
  },
  {
    label: "Bookings",
    to: "/dashboard?view=bookings",
    description: "See and manage scheduled appointments.",
    icon: ClipboardList,
  },
  {
    label: "Settings",
    to: "/dashboard?view=settings",
    description: "Account, billing, and phone numbers.",
    icon: Settings2,
  },
];

function linkCardClassName() {
  return cn(
    "group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors",
    "hover:border-primary/30 hover:bg-white/[0.05]",
  );
}

export function InfoView() {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Help &amp; Info
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          About CallBay
        </h1>
        <p className="max-w-2xl text-pretty text-sm font-medium leading-relaxed text-foreground/90">
          {PITCH_HERO}
        </p>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-neutral-400">
          {PITCH_FOOTER}
        </p>
      </header>

      <section
        className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6"
        aria-labelledby="quick-links-heading"
      >
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-primary" aria-hidden />
          <h2
            id="quick-links-heading"
            className="text-base font-semibold text-foreground"
          >
            Quick links
          </h2>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          Jump to the main areas of your workspace.
        </p>
        <ul className="mt-5 grid list-none gap-3 sm:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={linkCardClassName()}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground group-hover:border-primary/25 group-hover:text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground group-hover:text-primary">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500">
                      {item.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-base font-semibold text-foreground">Support</h2>
        </div>
        <p className="mt-1 text-sm text-neutral-400">
          Questions about your account, billing, or the AI agent? Reach the team
          by email, or use the same number shown in Settings for your agent line.
        </p>
        <div className="mt-5 space-y-3 text-sm">
          <p className="flex flex-wrap items-center gap-2 text-neutral-300">
            <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <a
              href={`mailto:${supportEmail}`}
              className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
            >
              {supportEmail}
            </a>
          </p>
          <p className="flex flex-wrap items-center gap-2 text-neutral-300">
            <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span className="text-foreground">Agent number:</span>
            <span className="font-mono text-sm text-foreground/90">
              {agentPhoneNumber}
            </span>
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <h2 className="text-base font-semibold text-foreground">Website &amp; legal</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Marketing site, plan details, and public resources.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-300">
          <li>
            <Link
              to="/"
              className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
            >
              Home
            </Link>
            {" — "}
            <span className="text-neutral-500">product overview and sign up.</span>
          </li>
          <li>
            <Link
              to="/#pricing"
              className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
            >
              Pricing
            </Link>
            {" — "}
            <span className="text-neutral-500">plans and features.</span>
          </li>
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-neutral-500">
          Privacy, Terms, and Security policies will appear here as dedicated pages
          are published. For now, contact support for policy questions.
        </p>
      </section>
    </div>
  );
}
