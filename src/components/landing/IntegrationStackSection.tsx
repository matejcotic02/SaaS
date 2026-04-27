import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bell, CalendarCheck, ChevronRight, LayoutDashboard, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn, FadeInItem, FadeInStagger } from "./FadeIn";
import { SectionHeader } from "./SectionHeader";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

type StackItem = {
  icon: typeof Phone;
  title: string;
  desc: string;
  pillLabel: string;
  pillClassName: string;
  statLine: string;
};

const stack: StackItem[] = [
  {
    icon: Phone,
    title: "Calls",
    desc: "Answer inbound calls and keep conversations moving toward a clear outcome.",
    pillLabel: "Live",
    pillClassName: "bg-red-500/10 text-red-300 border border-red-500/20",
    statLine: "24 calls handled today",
  },
  {
    icon: CalendarCheck,
    title: "Bookings",
    desc: "Turn what the customer wants into time on the calendar without the back-and-forth.",
    pillLabel: "Auto-booking",
    pillClassName: "bg-orange-500/10 text-orange-300 border border-orange-500/20",
    statLine: "8 appointments confirmed",
  },
  {
    icon: Bell,
    title: "Reminders",
    desc: "Reduce no-shows with automated reminders your customers actually receive.",
    pillLabel: "Active",
    pillClassName: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    statLine: "12 reminders sent today",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    desc: "Review call outcomes, leads, and schedule activity in one place.",
    pillLabel: "Synced",
    pillClassName: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    statLine: "Outcomes visible instantly",
  },
];

const microLabels = ["Incoming call received", "Booking confirmed", "Dashboard updated"];

function segmentActive(hovered: number | null, segmentIndex: number): boolean {
  if (hovered === null) return false;
  return (hovered > 0 && segmentIndex === hovered - 1) || (hovered < stack.length - 1 && segmentIndex === hovered);
}

type HorizontalConnectorProps = {
  segmentIndex: number;
  microLabel: string;
  hoveredCardIndex: number | null;
};

function HorizontalConnector({ segmentIndex, microLabel, hoveredCardIndex }: HorizontalConnectorProps) {
  const reduced = useReducedMotion();
  const bright = segmentActive(hoveredCardIndex, segmentIndex);

  return (
    <div
      className={cn(
        "relative hidden min-h-[4.5rem] min-w-[2.5rem] max-w-[5rem] flex-1 shrink-0 flex-col items-center justify-center self-center lg:flex",
      )}
      aria-hidden
    >
      <div
        className={cn(
          "absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-red-500/25 via-orange-500/35 to-red-500/25 transition-all duration-300",
          bright ? "opacity-100 shadow-[0_0_16px_rgba(248,113,113,0.35)]" : "opacity-50",
        )}
      />
      {!reduced ? (
        <motion.span
          className="pointer-events-none absolute top-1/2 z-[1] h-2 w-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-400 to-orange-400 shadow-[0_0_10px_rgba(248,113,113,0.7)]"
          initial={{ left: "8%" }}
          animate={{ left: ["8%", "92%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/80" />
      )}
      <ChevronRight
        className={cn(
          "absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500/35 transition-opacity duration-300",
          bright ? "text-orange-400/60 opacity-100" : "opacity-40",
        )}
      />
      <motion.div
        className="relative z-[2] mx-1 mt-6 max-w-[9rem] rounded-lg border border-white/10 bg-[#111111] px-2.5 py-1 text-center text-[0.65rem] leading-snug text-muted-foreground shadow-[0_4px_20px_rgba(0,0,0,0.45)] ring-1 ring-orange-500/20"
        animate={
          reduced
            ? undefined
            : {
                y: [0, -3, 0],
                opacity: [0.88, 1, 0.88],
              }
        }
        transition={
          reduced
            ? undefined
            : {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        {microLabel}
      </motion.div>
    </div>
  );
}

function VerticalConnector({ segmentIndex, hoveredCardIndex }: { segmentIndex: number; hoveredCardIndex: number | null }) {
  const bright = segmentActive(hoveredCardIndex, segmentIndex);
  return (
    <div className="flex w-full justify-center py-1 lg:hidden" aria-hidden>
      <div
        className={cn(
          "h-10 w-[2px] rounded-full bg-gradient-to-b from-red-500/25 via-orange-500/35 to-red-500/25 transition-all duration-300",
          bright ? "opacity-100 shadow-[0_0_12px_rgba(248,113,113,0.35)]" : "opacity-55",
        )}
      />
    </div>
  );
}

type WorkflowCardProps = {
  item: StackItem;
  index: number;
  onHover: (i: number | null) => void;
};

function WorkflowCard({ item, index, onHover }: WorkflowCardProps) {
  const { icon: Icon, title, desc, pillLabel, pillClassName, statLine } = item;

  return (
    <div
      className={cn(
        "group flex min-h-[13rem] min-w-0 flex-col rounded-2xl border border-white/10 bg-[#111111] p-6 text-center transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-red-400/40 hover:shadow-[0_0_28px_rgba(248,113,113,0.14)]",
      )}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        className={cn(
          "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 transition-all duration-300",
          "group-hover:text-red-300 group-hover:drop-shadow-[0_0_12px_rgba(248,113,113,0.35)]",
        )}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <span
        className={cn(
          "mx-auto mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-medium",
          pillClassName,
        )}
      >
        {pillLabel}
      </span>
      <p className="mt-2 text-xs text-muted-foreground">{statLine}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

export function IntegrationStackSection() {
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  const desktopRow = stack.flatMap((item, i) => {
    const nodes = [
      <FadeInItem key={`card-${item.title}`} className="min-w-0 flex-[1_1_0%]">
        <WorkflowCard item={item} index={i} onHover={setHoveredCardIndex} />
      </FadeInItem>,
    ];
    if (i < stack.length - 1) {
      nodes.push(
        <HorizontalConnector
          key={`conn-${i}`}
          segmentIndex={i}
          microLabel={microLabels[i] ?? ""}
          hoveredCardIndex={hoveredCardIndex}
        />,
      );
    }
    return nodes;
  });

  return (
    <section
      id="integration"
      className="overflow-x-hidden border-b border-[var(--border)] py-16 sm:py-20"
    >
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <SectionHeader
          title="Built for real phone workflow automation"
          subtitle="Four connected layers that move every call from conversation to outcome."
        />

        <FadeIn className="mt-12">
          <div className="relative">
            <div className="mb-6 hidden justify-center lg:flex">
              <span className="rounded-full border border-white/10 bg-[#111111] px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground shadow-[0_0_24px_rgba(248,113,113,0.08)]">
                CallBay Automation Engine
              </span>
            </div>

            <FadeInStagger className="hidden w-full flex-row items-stretch lg:flex">{desktopRow}</FadeInStagger>

            <FadeInStagger className="flex max-w-full flex-col lg:hidden">
              {stack.map((item, i) => (
                <div key={item.title} className="min-w-0">
                  <FadeInItem>
                    <WorkflowCard item={item} index={i} onHover={setHoveredCardIndex} />
                  </FadeInItem>
                  {i < stack.length - 1 ? (
                    <VerticalConnector segmentIndex={i} hoveredCardIndex={hoveredCardIndex} />
                  ) : null}
                </div>
              ))}
            </FadeInStagger>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
