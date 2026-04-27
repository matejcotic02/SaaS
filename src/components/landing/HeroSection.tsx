import { useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Phone,
  CalendarCheck,
  UserRound,
  Bell,
  ArrowRight,
  Activity,
  Clock,
} from "lucide-react";
import { PlasticButton } from "@/components/ui/plastic-button";
import { TextEffect } from "@/components/ui/text-effect";
import { MetricCard } from "./MetricCard";

const HERO_HEADLINE = "Stop missing calls. Let CallBay book your appointments.";

const heroTitleClassName =
  "text-balance text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-[1.06]";

const trust = [
  "Stop missing inbound calls",
  "Turn more calls into bookings",
  "Follow up with leads automatically",
  "Reduce no-shows and free your staff from repetitive phone work",
];

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="hero" className="relative overflow-hidden border-b border-[var(--border)]">
      <div
        className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-white/[0.03] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-28">
        <div>
          {reducedMotion ? (
            <h1 className={heroTitleClassName}>{HERO_HEADLINE}</h1>
          ) : (
            <TextEffect
              as="h1"
              per="word"
              preset="blur"
              loop
              loopPauseMs={1600}
              className={heroTitleClassName}
            >
              {HERO_HEADLINE}
            </TextEffect>
          )}
          <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            CallBay answers customer calls, checks availability, books jobs, follows up with leads, sends
            reminders, and hands off to your team when it matters—so you get more booked work without hiring
            another front desk.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/signup" className="block w-full max-w-md sm:max-w-[14rem]">
              <PlasticButton asChild size="md" variant="primary" className="w-full">
                Sign Up
                <ArrowRight
                  className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                  aria-hidden
                />
              </PlasticButton>
            </Link>
            <Link to="/dashboard" className="block w-full max-w-md sm:max-w-[14rem] sm:w-auto">
              <PlasticButton asChild size="md" variant="secondary" className="w-full">
                View Dashboard Demo
              </PlasticButton>
            </Link>
          </div>
          <ul className="mt-10 space-y-2.5 text-sm text-muted-foreground">
            {trust.map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="leading-snug">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[320px] lg:min-h-[420px]">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-white/5 opacity-80 blur-sm" />
          <div className="relative z-10 overflow-hidden rounded-2xl border border-[var(--border)] bg-card shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-secondary/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(236,9,9,1)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(71,233,12,1)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,247,0,1)]" />
                </div>
                <span className="ml-1 text-xs font-medium text-muted-foreground">CallBay Dashboard</span>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2">
              <MetricCard icon={Phone} label="Calls Answered" value="248" />
              <MetricCard icon={CalendarCheck} label="Bookings Created" value="64" />
              <MetricCard icon={UserRound} label="Leads Followed Up" value="132" />
              <MetricCard icon={Activity} label="No-Shows Reduced" value="38%" />
            </div>

            <div className="border-t border-[var(--border)] bg-background/50 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Live AI call</p>
              <div className="mt-2 grid gap-2 text-sm">
                <div className="flex justify-between border-b border-[var(--border)] border-dashed pb-2">
                  <span className="text-muted-foreground">Caller</span>
                  <span className="font-medium text-foreground">Sarah M.</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border)] border-dashed pb-2">
                  <span className="text-muted-foreground">Intent</span>
                  <span className="text-foreground">Book window tint appointment</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border)] border-dashed pb-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-primary">Checking availability</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer</span>
                  <span className="text-foreground">Not needed</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border)] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recent activity
              </p>
              <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Inbound call booked
                </li>
                <li className="flex items-center gap-2">
                  <UserRound className="h-3.5 w-3.5 text-primary" />
                  Lead follow-up scheduled
                </li>
                <li className="flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-primary" />
                  SMS reminder sent
                </li>
                <li className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Updated 12s ago
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
