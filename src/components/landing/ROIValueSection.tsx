import { Phone, Users, CalendarX, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { FadeInItem, FadeInStagger } from "./FadeIn";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

const stats = [
  {
    icon: Phone,
    title: "More calls answered",
    body: "Fewer rings going to voicemail during your busiest hours.",
  },
  {
    icon: Users,
    title: "More leads followed up",
    body: "Automatic follow-up so interested customers do not slip away.",
  },
  {
    icon: CalendarX,
    title: "Fewer no-shows",
    body: "Reminder workflows that keep appointments on the calendar.",
  },
  {
    icon: CalendarCheck,
    title: "More booked appointments",
    body: "Clearer booking flow from first question to confirmed time.",
  },
];

export function ROIValueSection() {
  return (
    <section id="roi" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <SectionHeader
          title="Small improvements in phone handling can create real revenue"
          subtitle="CallBay is built to turn more conversations into jobs—without promising numbers we cannot stand behind."
        />
        <FadeInStagger className="mt-12 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, title, body }) => (
            <FadeInItem key={title} className="h-full min-h-0">
              <div className="flex h-full min-h-0 flex-col rounded-[var(--radius)] border border-[var(--border)] bg-card p-5 shadow-[0_8px_28px_rgba(0,0,0,0.35)] transition-colors hover:border-primary/35">
                <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                <p className="mt-2 min-h-0 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--border)] bg-secondary/40 p-6 text-center shadow-[0_0_40px_-12px_rgba(194,61,72,0.15)] sm:p-8">
          <p className="text-sm leading-relaxed text-muted-foreground">
            If you recover even <span className="font-medium text-foreground">a few missed calls</span> each
            month, a small number of extra bookings can often cover the cost of CallBay—especially for shops
            where every job has real margin. Your results depend on volume, pricing, and how you run the shop;
            we keep the product focused on consistent phone workflow, not hype.
          </p>
        </div>
      </div>
    </section>
  );
}
