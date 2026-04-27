import {
  Bot,
  PhoneOutgoing,
  Users,
  CalendarDays,
  MessageSquare,
  PhoneForwarded,
  History,
  CreditCard,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { FeatureCard } from "./FeatureCard";
import { FadeInItem, FadeInStagger } from "./FadeIn";

const features = [
  {
    icon: Bot,
    title: "AI Booking Agent",
    description:
      "Answers calls and collects the details needed to create bookings.",
  },
  {
    icon: PhoneOutgoing,
    title: "Outbound Calling",
    description: "Follows up with leads and helps recover missed opportunities.",
  },
  {
    icon: Users,
    title: "Lead Management",
    description: "Track new, called, booked, and do-not-call leads.",
  },
  {
    icon: CalendarDays,
    title: "Appointment Calendar",
    description: "See upcoming jobs, booking status, and service details.",
  },
  {
    icon: MessageSquare,
    title: "SMS Reminders",
    description: "Reduce no-shows with automated appointment reminders.",
  },
  {
    icon: PhoneForwarded,
    title: "Human Transfer",
    description: "Send urgent or complex calls to your team when needed.",
  },
  {
    icon: History,
    title: "Call History",
    description: "Review inbound and outbound calls, outcomes, and summaries.",
  },
  {
    icon: CreditCard,
    title: "Billing Dashboard",
    description: "Manage plan, usage, and subscription status.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader title="Everything your front desk needs, without hiring another employee" />
        <FadeInStagger className="mt-12 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((f) => (
            <FadeInItem key={f.title} className="h-full min-h-0">
              <FeatureCard icon={f.icon} title={f.title} description={f.description} />
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
