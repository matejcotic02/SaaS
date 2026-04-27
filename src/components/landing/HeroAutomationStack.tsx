import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  MessageSquare,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";
import { MorphingCardStack, type CardData } from "@/components/ui/morphing-card-stack";

const heroAutomationCards: CardData[] = [
  {
    id: "answer-calls",
    title: "Answers missed calls",
    description: "CallBay picks up instantly when your team is busy with customers or jobs.",
    icon: <PhoneIncoming className="h-5 w-5" />,
  },
  {
    id: "ai-agent",
    title: "Understands the request",
    description: "The AI asks what service the customer needs and collects the right details.",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    id: "bookings",
    title: "Books appointments",
    description: "Customers can get available times and confirm a booking through the call flow.",
    icon: <CalendarCheck className="h-5 w-5" />,
  },
  {
    id: "lead-followup",
    title: "Follows up with leads",
    description: "CallBay helps recover missed opportunities with consistent outbound follow-up.",
    icon: <PhoneOutgoing className="h-5 w-5" />,
  },
  {
    id: "reminders",
    title: "Sends reminders",
    description: "Appointment reminders help reduce no-shows and keep the schedule tighter.",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: "transfer",
    title: "Transfers when needed",
    description: "If someone needs a real person, CallBay can hand the call to your team.",
    icon: <PhoneForwarded className="h-5 w-5" />,
  },
  {
    id: "dashboard",
    title: "Updates the dashboard",
    description: "Calls, bookings, leads, and outcomes stay visible in one place.",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
];

export function HeroAutomationStack() {
  return (
    <div className="pointer-events-auto rounded-2xl border border-white/10 bg-background/80 p-2.5 shadow-[0_20px_70px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          Automation stack
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>
      <MorphingCardStack cards={heroAutomationCards} />
    </div>
  );
}
