import { Phone, CalendarCheck, Bot, MessageSquare, PhoneForwarded } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const items = [
  {
    icon: Phone,
    title: "AI answers inbound calls",
    description: "Calls are picked up instantly with a professional, on-brand voice.",
  },
  {
    icon: CalendarCheck,
    title: "Checks real availability",
    description: "Matches service type and duration against your live schedule rules.",
  },
  {
    icon: Bot,
    title: "Books appointments",
    description: "Creates confirmed jobs with the details your team needs on the calendar.",
  },
  {
    icon: MessageSquare,
    title: "Sends SMS reminders",
    description: "Cuts no-shows with timely texts before the appointment window.",
  },
  {
    icon: PhoneForwarded,
    title: "Transfers urgent calls to a human",
    description: "Escalates complex or high-intent conversations to your staff.",
  },
];

export function SolutionSection() {
  return (
    <section id="solution" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="CallBay handles the phone work automatically"
          subtitle="Your AI assistant works in the background so your team can focus on the jobs that are already booked."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative min-h-[11.5rem] overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.38)] transition-shadow hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            >
              <div className="absolute left-0 top-0 h-full w-0.5 bg-primary/80 transition-colors group-hover:bg-primary" aria-hidden />
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
