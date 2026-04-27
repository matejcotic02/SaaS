import { SectionHeader } from "./SectionHeader";

const steps = [
  {
    n: "01",
    title: "Set up your business",
    body: "Add your services, business hours, appointment rules, and transfer phone.",
  },
  {
    n: "02",
    title: "Get your CallBay AI phone agent",
    body: "Your agent is prepared to answer calls in your brand voice and collect booking details.",
  },
  {
    n: "03",
    title: "Let it answer and follow up",
    body: "The agent handles inbound calls, lead follow-ups, and reminders.",
  },
  {
    n: "04",
    title: "Track everything",
    body: "View calls, appointments, leads, and outcomes from one dashboard.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader title="From missed call to booked job in four steps" />
        <div className="relative mt-16">
          <div
            className="absolute left-[1.25rem] top-0 hidden h-full w-px bg-gradient-to-b from-primary/50 via-[var(--border)] to-transparent md:block"
            aria-hidden
          />
          <ol className="grid gap-6 md:gap-7">
            {steps.map((s) => (
              <li
                key={s.n}
                className="relative flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-card p-6 pl-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-colors hover:border-primary/30 md:flex-row md:items-start md:gap-8 md:pl-7"
              >
                <div className="flex items-center gap-3 md:w-44 md:shrink-0 md:flex-col md:items-start md:gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/40 bg-primary/12 text-sm font-bold text-primary md:relative md:z-10">
                    {s.n}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
