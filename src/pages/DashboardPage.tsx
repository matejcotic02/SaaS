import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, History, Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/landing/FadeIn";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SetupChecklist } from "@/components/dashboard/SetupChecklist";
import { AgentStatusCard } from "@/components/dashboard/AgentStatusCard";
import { CallActivityTable } from "@/components/dashboard/CallActivityTable";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { LeadSummary } from "@/components/dashboard/LeadSummary";
import { OutboundCampaignCard } from "@/components/dashboard/OutboundCampaignCard";
import { ReminderStatusCard } from "@/components/dashboard/ReminderStatusCard";
import { UsageCard } from "@/components/dashboard/UsageCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CalendarView } from "@/components/dashboard/CalendarView";
import { BookingsView } from "@/components/dashboard/BookingsView";
import { CustomersView } from "@/components/dashboard/CustomersView";
import { AgentSettingsView } from "@/components/dashboard/AgentSettingsView";
import { ServicesPricingView } from "@/components/dashboard/ServicesPricingView";
import { OutboundCallsView } from "@/components/dashboard/OutboundCallsView";
import { mockStats } from "@/data/dashboardMockData";

function getFirstName(
  email: string | null | undefined,
  metadata?: Record<string, unknown> | null,
): string | null {
  const meta = (metadata ?? {}) as { full_name?: unknown; name?: unknown };
  const candidate =
    typeof meta.full_name === "string" && meta.full_name.trim()
      ? meta.full_name.trim()
      : typeof meta.name === "string" && meta.name.trim()
        ? meta.name.trim()
        : null;
  if (candidate) {
    const first = candidate.split(/\s+/)[0];
    if (first) return first;
  }
  if (email) {
    const local = email.split("@")[0];
    if (local) {
      return local.charAt(0).toUpperCase() + local.slice(1);
    }
  }
  return null;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const firstName = getFirstName(
    user?.email,
    (user?.user_metadata ?? null) as Record<string, unknown> | null,
  );

  const greeting = firstName ? `Welcome back, ${firstName}` : "Welcome back";

  if (view === "calendar") {
    return (
      <DashboardLayout>
        <CalendarView />
      </DashboardLayout>
    );
  }

  if (view === "bookings") {
    return (
      <DashboardLayout>
        <BookingsView />
      </DashboardLayout>
    );
  }

  if (view === "customers") {
    return (
      <DashboardLayout>
        <CustomersView />
      </DashboardLayout>
    );
  }

  if (view === "agent-settings") {
    return (
      <DashboardLayout>
        <AgentSettingsView />
      </DashboardLayout>
    );
  }

  if (view === "services-pricing") {
    return (
      <DashboardLayout>
        <ServicesPricingView />
      </DashboardLayout>
    );
  }

  if (view === "outbound-calls") {
    return (
      <DashboardLayout>
        <OutboundCallsView />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8">
        <FadeIn>
          <section className="flex flex-col gap-5 border-b border-white/5 pb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:pb-10">
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Overview
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {greeting}
              </h1>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-neutral-400">
                Finish your CallBay setup, then monitor calls, bookings, and
                follow-ups from one place.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <Button
                asChild
                variant="default"
                size="lg"
                className="group w-full sm:w-auto sm:min-w-[11rem]"
              >
                <Link to="/dashboard?view=agent-settings">
                  <Bot className="h-4 w-4 shrink-0" aria-hidden />
                  Set Up AI Agent
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[10rem]"
              >
                <Link to="/calls">
                  <History className="h-4 w-4 shrink-0" aria-hidden />
                  View Call Logs
                </Link>
              </Button>
            </div>
          </section>
        </FadeIn>

        <FadeIn>
          <SetupChecklist />
        </FadeIn>

        <section className="space-y-4" aria-label="Key metrics">
          <h2 className="text-sm font-semibold text-foreground">Key metrics</h2>
          <FadeInStagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {mockStats.map((stat) => (
              <FadeInItem key={stat.id}>
                <StatCard stat={stat} compact />
              </FadeInItem>
            ))}
          </FadeInStagger>
        </section>

        <section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
          <FadeIn className="h-full min-h-0">
            <AgentStatusCard compact />
          </FadeIn>
          <FadeIn className="h-full min-h-0">
            <UpcomingAppointments compact />
          </FadeIn>
        </section>

        <section className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-3 xl:gap-6">
          <div className="flex min-h-0 h-full min-w-0 flex-col xl:col-span-2">
            <FadeIn className="h-full min-h-0 flex-1">
              <CallActivityTable />
            </FadeIn>
          </div>
          <FadeIn className="h-full min-h-0 min-w-0">
            <ActivityFeed />
          </FadeIn>
        </section>

        <section
          className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 2xl:gap-4"
          aria-label="Leads, campaigns, and billing"
        >
          <FadeIn className="h-full min-h-0">
            <LeadSummary />
          </FadeIn>
          <FadeIn className="h-full min-h-0">
            <OutboundCampaignCard />
          </FadeIn>
          <FadeIn className="h-full min-h-0">
            <ReminderStatusCard />
          </FadeIn>
          <FadeIn className="h-full min-h-0">
            <UsageCard />
          </FadeIn>
        </section>
      </div>
    </DashboardLayout>
  );
}
