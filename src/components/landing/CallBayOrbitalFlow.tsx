import {
  Phone,
  Headphones,
  Search,
  CalendarCheck,
  CalendarPlus,
  Bell,
  PhoneForwarded,
  LayoutDashboard,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import type { TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { SectionHeader } from "./SectionHeader";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

const callBayWorkflowData: TimelineItem[] = [
  {
    id: 1,
    title: "Call Received",
    date: "Step 1",
    content:
      "A customer calls your business and CallBay answers instantly.",
    category: "Call Received",
    icon: Phone,
    relatedIds: [2],
    status: "completed",
    energy: 95,
  },
  {
    id: 2,
    title: "AI Answers",
    date: "Step 2",
    content:
      "CallBay responds using your business context and starts guiding the conversation.",
    category: "AI Answers",
    icon: Headphones,
    relatedIds: [1, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 3,
    title: "Service Detected",
    date: "Step 3",
    content:
      "It understands what the customer needs, such as tint, detailing, ceramic coating, or another service.",
    category: "Service Detected",
    icon: Search,
    relatedIds: [2, 4],
    status: "completed",
    energy: 85,
  },
  {
    id: 4,
    title: "Availability Checked",
    date: "Step 4",
    content:
      "CallBay checks your configured hours, services, and booking rules.",
    category: "Availability Checked",
    icon: CalendarCheck,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 80,
  },
  {
    id: 5,
    title: "Booking Created",
    date: "Step 5",
    content:
      "The customer confirms a time and the appointment gets created.",
    category: "Booking Created",
    icon: CalendarPlus,
    relatedIds: [4, 6],
    status: "in-progress",
    energy: 75,
  },
  {
    id: 6,
    title: "Reminder Sent",
    date: "Step 6",
    content:
      "A reminder can be sent before the appointment to reduce no-shows.",
    category: "Reminder Sent",
    icon: Bell,
    relatedIds: [5, 7],
    status: "pending",
    energy: 70,
  },
  {
    id: 7,
    title: "Human Transfer",
    date: "Step 7",
    content:
      "If needed, the call can be handed off to your team.",
    category: "Human Transfer",
    icon: PhoneForwarded,
    relatedIds: [6, 8],
    status: "pending",
    energy: 60,
  },
  {
    id: 8,
    title: "Dashboard Updated",
    date: "Step 8",
    content:
      "The outcome becomes visible in your CallBay dashboard.",
    category: "Dashboard Updated",
    icon: LayoutDashboard,
    relatedIds: [7, 1],
    status: "pending",
    energy: 50,
  },
];

const chips = [
  "Every call has a next step",
  "Your team stays in control",
  "Bookings and outcomes stay visible",
];

export function CallBayOrbitalFlow() {
  return (
    <section
      id="orbital-workflow"
      className="border-b border-[var(--border)] py-16 sm:py-20"
    >
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <SectionHeader
          title="How CallBay handles every call"
          subtitle="From the first ring to the final booking, CallBay keeps the whole workflow connected and visible."
        />

        <div className="mt-12">
          <RadialOrbitalTimeline timelineData={callBayWorkflowData} />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {chips.map((text) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-card/90 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
