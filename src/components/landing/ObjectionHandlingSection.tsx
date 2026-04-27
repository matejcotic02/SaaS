import {
  PhoneForwarded,
  SlidersHorizontal,
  LayoutDashboard,
  Rocket,
  Bell,
  Users,
  MessageSquare,
  Bot,
  UserRound,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { FadeInItem, FadeInStagger } from "./FadeIn";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

type Rule = {
  icon: LucideIcon;
  title: string;
  desc: string;
  status: string;
  pulse?: boolean;
};

const rules: Rule[] = [
  {
    icon: PhoneForwarded,
    title: "Human transfer",
    desc: "Transfer complex calls to your team.",
    status: "Enabled",
    pulse: true,
  },
  {
    icon: SlidersHorizontal,
    title: "Booking rules",
    desc: "Use your hours, services, buffers, and capacity.",
    status: "Controlled by you",
  },
  {
    icon: Bell,
    title: "SMS reminders",
    desc: "Send reminders before appointments.",
    status: "Active",
  },
  {
    icon: Users,
    title: "Lead follow-up",
    desc: "Follow up when customers do not book right away.",
    status: "Ready",
  },
];

type Benefit = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const benefits: Benefit[] = [
  {
    icon: PhoneForwarded,
    title: "Human transfer when needed",
    body: "If someone needs a real person, CallBay can hand off the call at the right moment.",
  },
  {
    icon: SlidersHorizontal,
    title: "You control the rules",
    body: "Set business hours, services, buffers, and booking logic so the AI matches how your shop works.",
  },
  {
    icon: LayoutDashboard,
    title: "Visibility stays with you",
    body: "Track calls, leads, and appointments from one dashboard so nothing lives in a black box.",
  },
  {
    icon: Rocket,
    title: "Start simple",
    body: "Begin with booking and reminders, then expand into outbound follow-up when you are ready.",
  },
];

type FlowStep = {
  icon: LucideIcon;
  label: string;
  outcome?: boolean;
};

const flowSteps: FlowStep[] = [
  { icon: MessageSquare, label: "When customer asks for pricing" },
  { icon: Bot, label: "CallBay collects details first" },
  { icon: UserRound, label: "If caller asks for owner" },
  { icon: PhoneForwarded, label: "Transfer to human", outcome: true },
];

function ToggleVisual({ pulse }: { pulse?: boolean }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-gradient-to-r from-red-500 to-orange-400 shadow-[0_0_20px_rgba(248,113,113,0.25)]"
    >
      {pulse ? (
        <span className="pointer-events-none absolute -inset-1 animate-pulse rounded-full bg-red-400/40 blur-md" />
      ) : null}
      <span className="absolute right-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow" />
    </span>
  );
}

function ControlPanelCard() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-card p-5 shadow-[0_18px_60px_rgba(0,0,0,0.45)] sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-secondary text-primary">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground sm:text-base">
              Call Handling Rules
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Control how the AI behaves on every call.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="my-4 h-px bg-[var(--border)]" />

      <ul className="divide-y divide-[var(--border)]">
        {rules.map(({ icon: Icon, title, desc, status, pulse }) => (
          <li
            key={title}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-secondary text-primary">
              <Icon className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {title}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                {desc}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden sm:inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-300">
                {status}
              </span>
              <ToggleVisual pulse={pulse} />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-[var(--border)] bg-secondary/40 p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Live rule preview
          </p>
          <span className="text-[10px] text-muted-foreground">Now</span>
        </div>
        <ol className="mt-3 space-y-2">
          {flowSteps.map(({ icon: Icon, label, outcome }, i) => (
            <li key={label} className="relative flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-card text-primary",
                  outcome &&
                    "border-red-500/30 bg-red-500/10 text-red-300 shadow-[0_0_18px_rgba(248,113,113,0.25)]",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span
                className={cn(
                  "text-xs",
                  outcome
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < flowSteps.length - 1 ? (
                <ArrowRight
                  aria-hidden
                  className="ml-auto hidden h-3.5 w-3.5 text-muted-foreground/60 sm:block"
                />
              ) : null}
              {i < flowSteps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-3 top-6 block h-2 w-px bg-[var(--border)] sm:hidden"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function ObjectionHandlingSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="objections" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <SectionHeader
          title="Your phone workflow, under your control"
          subtitle="CallBay automates the repetitive phone work while keeping your team in charge of the important moments."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {reducedMotion ? (
            <div className="h-full">
              <ControlPanelCard />
            </div>
          ) : (
            <motion.div
              className="h-full"
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <ControlPanelCard />
            </motion.div>
          )}

          <FadeInStagger className="grid h-full gap-4 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, title, body }) => (
              <FadeInItem key={title} className="h-full min-h-0">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-red-400/40 hover:shadow-[0_0_30px_rgba(248,113,113,0.12)] sm:p-6">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-secondary text-primary transition-shadow duration-300 group-hover:shadow-[0_0_18px_rgba(248,113,113,0.35)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </div>
    </section>
  );
}
