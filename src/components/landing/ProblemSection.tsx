import { PhoneMissed, CalendarClock, UserX, BellOff } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const items = [
  {
    icon: PhoneMissed,
    title: "Missed customer calls",
    description: "Every unanswered call can become lost revenue.",
  },
  {
    icon: CalendarClock,
    title: "Manual appointment booking",
    description: "Your team spends too much time checking times and confirming details.",
  },
  {
    icon: UserX,
    title: "Forgotten lead follow-ups",
    description: "Interested leads go cold when nobody follows up quickly.",
  },
  {
    icon: BellOff,
    title: "No-shows and weak reminders",
    description: "Without reminders, booked jobs can disappear from the schedule.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Your best leads are slipping through missed calls"
          subtitle="When customers call and nobody answers, they usually do not wait. They call the next shop."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex min-h-[12.5rem] flex-col rounded-[var(--radius)] border border-[var(--border)] bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-colors hover:border-primary/50"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-secondary text-foreground">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
