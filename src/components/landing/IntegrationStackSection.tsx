import { Phone, CalendarCheck, Bell, LayoutDashboard } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FadeInItem, FadeInStagger } from "./FadeIn";

const stack = [
  {
    icon: Phone,
    title: "Calls",
    desc: "Answer inbound calls and keep conversations moving toward a clear outcome.",
  },
  {
    icon: CalendarCheck,
    title: "Bookings",
    desc: "Turn what the customer wants into time on the calendar—without the back-and-forth.",
  },
  {
    icon: Bell,
    title: "Reminders",
    desc: "Reduce no-shows with automated reminders your customers actually receive.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    desc: "Review call outcomes, leads, and schedule activity in one place.",
  },
];

export function IntegrationStackSection() {
  return (
    <section id="integration" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Built for real phone workflow automation"
          subtitle="Four layers that work together—plain language, not a technical integration checklist."
        />
        <FadeInStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map(({ icon: Icon, title, desc }) => (
            <FadeInItem key={title}>
              <div className="flex min-h-[12rem] flex-col rounded-[var(--radius)] border border-[var(--border)] bg-card p-6 text-center shadow-[0_8px_28px_rgba(0,0,0,0.35)] transition-colors hover:border-primary/35 sm:min-h-[11rem]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
