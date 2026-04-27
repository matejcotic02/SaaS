import {
  Car,
  Sparkles,
  Droplets,
  Palette,
  Wrench,
  Building2,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FadeInItem, FadeInStagger } from "./FadeIn";

const cases = [
  {
    icon: Car,
    title: "Window Tint Shops",
    desc: "High-intent callers want a time on the calendar, not voicemail.",
    tag: "appointment-based",
  },
  {
    icon: Sparkles,
    title: "Ceramic Coating Shops",
    desc: "Long jobs and premium pricing mean every answered call matters.",
    tag: "high call volume",
  },
  {
    icon: Droplets,
    title: "Auto Detailers",
    desc: "Turn quick questions into booked details and follow-ups.",
    tag: "lead-driven",
  },
  {
    icon: Palette,
    title: "Wrap Shops",
    desc: "Capture custom scope and lock in consults without slowing the bay.",
    tag: "appointment-based",
  },
  {
    icon: Wrench,
    title: "Repair Shops",
    desc: "Route routine calls and keep techs off the phone during service.",
    tag: "high call volume",
  },
  {
    icon: Building2,
    title: "Other Local Service Businesses",
    desc: "If the phone rings for jobs, CallBay can cover the routine work.",
    tag: "lead-driven",
  },
];

export function IndustryUseCasesSection() {
  return (
    <section id="industry" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Built for businesses that depend on phone calls"
          subtitle="CallBay is especially useful for service businesses where every missed call can mean a lost job."
        />
        <FadeInStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map(({ icon: Icon, title, desc, tag }) => (
            <FadeInItem key={title}>
              <div className="flex h-full min-h-[11.5rem] flex-col rounded-[var(--radius)] border border-[var(--border)] bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-colors hover:border-primary/40">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-secondary text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                <span className="mt-4 inline-flex w-fit rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {tag}
                </span>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
