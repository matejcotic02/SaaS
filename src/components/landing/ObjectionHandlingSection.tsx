import { PhoneForwarded, SlidersHorizontal, LayoutDashboard, Rocket } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FadeInItem, FadeInStagger } from "./FadeIn";

const items = [
  {
    icon: PhoneForwarded,
    title: "Human transfer when needed",
    body: "If someone needs a real person, CallBay can hand off the call when you want it to.",
  },
  {
    icon: SlidersHorizontal,
    title: "You control the rules",
    body: "Set your business hours, services, buffers, and booking logic so the AI matches how you work.",
  },
  {
    icon: LayoutDashboard,
    title: "Visibility stays with you",
    body: "Track calls, leads, and appointments from one dashboard so nothing lives in a black box.",
  },
  {
    icon: Rocket,
    title: "Start simple",
    body: "Begin with booking and reminders, then expand outbound and follow-up when you are ready.",
  },
];

export function ObjectionHandlingSection() {
  return (
    <section id="objections" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Built to support your team, not complicate your process"
          subtitle="CallBay is meant to reduce phone chaos, not add another fragile system on top of your shop."
        />
        <FadeInStagger className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map(({ icon: Icon, title, body }) => (
            <FadeInItem key={title}>
              <div className="min-h-[12rem] rounded-[var(--radius)] border border-[var(--border)] bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-colors hover:border-primary/35 sm:min-h-[11rem]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-secondary text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
