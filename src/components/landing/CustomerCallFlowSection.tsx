import { Phone, Headphones, MessageCircle, CalendarCheck, Send, LayoutDashboard, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

const steps = [
  { icon: Phone, label: "Customer calls your number" },
  { icon: Headphones, label: "CallBay answers instantly" },
  { icon: MessageCircle, label: "It asks what service they need" },
  { icon: CalendarCheck, label: "It checks available times" },
  { icon: Send, label: "It books the appointment or schedules follow-up" },
  { icon: LayoutDashboard, label: "Results show up in your dashboard" },
];

export function CustomerCallFlowSection() {
  return (
    <section id="call-flow" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <SectionHeader
          title="What happens when a customer calls?"
          subtitle="A practical flow your team can recognize: from first ring to a clear outcome in CallBay."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
          <ol className="space-y-0">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {i < steps.length - 1 ? (
                      <span className="my-1 w-px flex-1 min-h-[1.25rem] bg-gradient-to-b from-primary/40 to-[var(--border)]" />
                    ) : null}
                  </div>
                  <div className="pb-8 pt-1.5">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-muted-foreground">{String(i + 1).padStart(2, "0")}. </span>
                      {s.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="relative lg:sticky lg:top-28">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/15 via-transparent to-emerald-500/10 opacity-90 blur-sm" />
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Live call example</p>
              <p className="mt-1 text-xs text-muted-foreground">What your team might see in real time</p>
              <div className="mt-4 space-y-3 rounded-lg border border-[var(--border)] bg-background/60 p-4 text-sm">
                <p>
                  <span className="text-muted-foreground">Customer: </span>
                  <span className="text-foreground">
                    &ldquo;Do you have time for tint this Friday?&rdquo;
                  </span>
                </p>
                <p>
                  <span className="text-muted-foreground">CallBay: </span>
                  <span className="text-foreground">
                    &ldquo;I can help with that. What vehicle are you bringing in?&rdquo;
                  </span>
                </p>
                <div className="flex items-center gap-2 border-t border-dashed border-[var(--border)] pt-3 text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-amber-400/90">Checking availability</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs">
                  <span className="text-muted-foreground">Outcome</span>
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
                    Appointment booked
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
