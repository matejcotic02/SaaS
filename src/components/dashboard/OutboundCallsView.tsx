import { useMemo, useState } from "react";
import {
  Edit3,
  Filter,
  MoreHorizontal,
  Pause,
  PhoneCall,
  Play,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusVariant } from "@/components/shared/StatusBadge";
import { toast } from "@/components/shared/Toaster";
import { cn } from "@/lib/utils";

type OutboundStatus = "Queued" | "Calling" | "Completed" | "Paused";
type OutboundOutcome =
  | "Booked"
  | "No Answer"
  | "Voicemail"
  | "Follow-up"
  | "Not Called";
type FilterValue = "All" | OutboundStatus | OutboundOutcome;

type OutboundLead = {
  id: string;
  name: string;
  phone: string;
  status: OutboundStatus;
  outcome: OutboundOutcome;
  attempts: number;
  lastCall: string;
  nextAction: string;
};

const statusVariant: Record<OutboundStatus, StatusVariant> = {
  Queued: "neutral",
  Calling: "info",
  Completed: "success",
  Paused: "warning",
};

const outcomeVariant: Record<OutboundOutcome, StatusVariant> = {
  Booked: "success",
  "No Answer": "danger",
  Voicemail: "warning",
  "Follow-up": "info",
  "Not Called": "neutral",
};

const filters: FilterValue[] = [
  "All",
  "Queued",
  "Calling",
  "Completed",
  "Booked",
  "No Answer",
];

const outboundLeads: OutboundLead[] = [
  { id: "lead-1", name: "Sarah Miller", phone: "+1 (555) 201-8842", status: "Completed", outcome: "Booked", attempts: 1, lastCall: "Today, 9:12 AM", nextAction: "Booking confirmed" },
  { id: "lead-2", name: "James Robinson", phone: "+1 (555) 744-1930", status: "Completed", outcome: "Follow-up", attempts: 2, lastCall: "Today, 10:05 AM", nextAction: "Call back tomorrow" },
  { id: "lead-3", name: "Alex Parker", phone: "+1 (555) 482-0021", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-4", name: "Maria Santos", phone: "+1 (555) 908-4412", status: "Completed", outcome: "No Answer", attempts: 3, lastCall: "Today, 12:14 PM", nextAction: "Retry at 4:30 PM" },
  { id: "lead-5", name: "Ben Carter", phone: "+1 (555) 771-0209", status: "Calling", outcome: "Not Called", attempts: 1, lastCall: "Today, 1:06 PM", nextAction: "Live call in progress" },
  { id: "lead-6", name: "Nina Brooks", phone: "+1 (555) 420-3371", status: "Paused", outcome: "Voicemail", attempts: 2, lastCall: "Yesterday, 5:40 PM", nextAction: "Waiting for reply" },
  { id: "lead-7", name: "Jordan Lee", phone: "+1 (555) 618-2204", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-8", name: "Priya Shah", phone: "+1 (555) 310-1176", status: "Completed", outcome: "Booked", attempts: 1, lastCall: "Yesterday, 3:22 PM", nextAction: "Send prep SMS" },
  { id: "lead-9", name: "Ethan Wright", phone: "+1 (555) 879-6631", status: "Completed", outcome: "No Answer", attempts: 2, lastCall: "Yesterday, 2:10 PM", nextAction: "Retry tomorrow" },
  { id: "lead-10", name: "Olivia Garcia", phone: "+1 (555) 264-0911", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-11", name: "Chris Adams", phone: "+1 (555) 935-7201", status: "Completed", outcome: "Follow-up", attempts: 3, lastCall: "Mon, 11:48 AM", nextAction: "Needs SUV quote" },
  { id: "lead-12", name: "Avery Johnson", phone: "+1 (555) 124-7710", status: "Completed", outcome: "Voicemail", attempts: 1, lastCall: "Mon, 10:19 AM", nextAction: "Retry this week" },
  { id: "lead-13", name: "Liam Nelson", phone: "+1 (555) 380-1125", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-14", name: "Maya Patel", phone: "+1 (555) 740-6620", status: "Completed", outcome: "Booked", attempts: 2, lastCall: "Sun, 6:04 PM", nextAction: "Appointment set" },
  { id: "lead-15", name: "Daniel Kim", phone: "+1 (555) 661-4478", status: "Completed", outcome: "No Answer", attempts: 4, lastCall: "Sun, 4:51 PM", nextAction: "Final retry" },
  { id: "lead-16", name: "Grace Hill", phone: "+1 (555) 909-1314", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-17", name: "Noah Martin", phone: "+1 (555) 587-3028", status: "Completed", outcome: "Follow-up", attempts: 1, lastCall: "Sat, 1:36 PM", nextAction: "Confirm budget" },
  { id: "lead-18", name: "Sophia Turner", phone: "+1 (555) 702-4900", status: "Paused", outcome: "No Answer", attempts: 2, lastCall: "Fri, 5:13 PM", nextAction: "Paused by user" },
  { id: "lead-19", name: "Lucas Walker", phone: "+1 (555) 490-8202", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-20", name: "Emma Scott", phone: "+1 (555) 118-9043", status: "Completed", outcome: "Voicemail", attempts: 2, lastCall: "Fri, 11:28 AM", nextAction: "Retry Monday" },
  { id: "lead-21", name: "Mason Reed", phone: "+1 (555) 772-8890", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-22", name: "Isabella Flores", phone: "+1 (555) 620-5488", status: "Completed", outcome: "Booked", attempts: 1, lastCall: "Thu, 3:44 PM", nextAction: "Send reminder" },
  { id: "lead-23", name: "Henry Morris", phone: "+1 (555) 355-2781", status: "Completed", outcome: "No Answer", attempts: 3, lastCall: "Thu, 12:07 PM", nextAction: "Retry evening" },
  { id: "lead-24", name: "Zoe Cooper", phone: "+1 (555) 812-6402", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-25", name: "Wyatt Hughes", phone: "+1 (555) 931-4432", status: "Completed", outcome: "Follow-up", attempts: 2, lastCall: "Wed, 9:58 AM", nextAction: "Send price range" },
  { id: "lead-26", name: "Aria Bennett", phone: "+1 (555) 229-7612", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
  { id: "lead-27", name: "Jack Simmons", phone: "+1 (555) 760-9328", status: "Completed", outcome: "Voicemail", attempts: 1, lastCall: "Tue, 2:39 PM", nextAction: "Retry tomorrow" },
  { id: "lead-28", name: "Lily Foster", phone: "+1 (555) 409-1882", status: "Completed", outcome: "Booked", attempts: 2, lastCall: "Tue, 1:01 PM", nextAction: "Booking confirmed" },
  { id: "lead-29", name: "Owen Price", phone: "+1 (555) 275-6044", status: "Paused", outcome: "Follow-up", attempts: 3, lastCall: "Mon, 7:17 PM", nextAction: "Needs manual review" },
  { id: "lead-30", name: "Chloe Ward", phone: "+1 (555) 644-1132", status: "Queued", outcome: "Not Called", attempts: 0, lastCall: "Never", nextAction: "Initial outreach" },
];

function matchesFilter(lead: OutboundLead, filter: FilterValue): boolean {
  if (filter === "All") return true;
  return lead.status === filter || lead.outcome === filter;
}

export function OutboundCallsView() {
  const [campaign, setCampaign] = useState("standard-film");
  const [activeFilter, setActiveFilter] = useState<FilterValue>("All");
  const [search, setSearch] = useState("");

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    return outboundLeads.filter((lead) => {
      const matchesSearch =
        !term ||
        lead.name.toLowerCase().includes(term) ||
        lead.phone.toLowerCase().includes(term);
      return matchesSearch && matchesFilter(lead, activeFilter);
    });
  }, [activeFilter, search]);

  const kpis = [
    { label: "Total Leads", value: outboundLeads.length },
    { label: "Queued", value: outboundLeads.filter((l) => l.status === "Queued").length },
    { label: "Called", value: outboundLeads.filter((l) => l.status === "Completed").length },
    { label: "Booked", value: outboundLeads.filter((l) => l.outcome === "Booked").length },
    { label: "No Answer", value: outboundLeads.filter((l) => l.outcome === "No Answer").length },
  ];

  const notify = (title: string, description: string) => {
    toast(title, { description });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Outbound Calls
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage AI-powered follow-up campaigns and outbound lead attempts.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              notify("Campaign started", "The outbound queue is now running.")
            }
          >
            <Play className="h-4 w-4" aria-hidden />
            Start Campaign
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              notify("Campaign paused", "Outbound dialing has been paused.")
            }
          >
            <Pause className="h-4 w-4" aria-hidden />
            Pause
          </Button>
        </div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <label
              htmlFor="campaign"
              className="text-xs font-medium uppercase tracking-wide text-neutral-500"
            >
              Campaign
            </label>
            <select
              id="campaign"
              value={campaign}
              onChange={(event) => setCampaign(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 sm:w-72"
            >
              <option value="standard-film">Standard Film Follow-up</option>
              <option value="missed-calls">Missed Call Recovery</option>
              <option value="quote-follow-up">Quote Follow-up</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() =>
              notify("Queue refreshed", "Outbound leads are up to date.")
            }
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Refresh
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3"
            >
              <p className="text-[11px] uppercase tracking-wide text-neutral-500">
                {kpi.label}
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 border-b border-white/5 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search leads or phone numbers..."
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-neutral-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  activeFilter === filter
                    ? "bg-primary text-white"
                    : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-foreground",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-6 py-3 font-medium">Lead</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Outcome</th>
                <th className="px-6 py-3 font-medium">Attempts</th>
                <th className="px-6 py-3 font-medium">Last Call</th>
                <th className="px-6 py-3 font-medium">Next Action</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-6 py-3 font-medium text-foreground">
                    {lead.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-neutral-300">
                    {lead.phone}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <StatusBadge variant={statusVariant[lead.status]} dot>
                      {lead.status}
                    </StatusBadge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <StatusBadge variant={outcomeVariant[lead.outcome]}>
                      {lead.outcome}
                    </StatusBadge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 tabular-nums text-neutral-300">
                    {lead.attempts}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-neutral-300">
                    {lead.lastCall}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-neutral-300">
                    {lead.nextAction}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          notify("Calling lead", `Starting call to ${lead.name}.`)
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-primary/10 hover:text-primary"
                        aria-label={`Call ${lead.name}`}
                      >
                        <PhoneCall className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          notify("Edit lead", `${lead.name} can be edited soon.`)
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/10 hover:text-foreground"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          notify("Lead removed", `${lead.name} was removed from queue.`)
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-white/5 lg:hidden">
          {filteredLeads.map((lead) => (
            <article key={lead.id} className="space-y-3 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {lead.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-neutral-400">{lead.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    notify("Lead options", `More actions for ${lead.name}.`)
                  }
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label={`More actions for ${lead.name}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge variant={statusVariant[lead.status]} dot>
                  {lead.status}
                </StatusBadge>
                <StatusBadge variant={outcomeVariant[lead.outcome]}>
                  {lead.outcome}
                </StatusBadge>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-neutral-500">Attempts</dt>
                  <dd className="mt-0.5 text-neutral-300">{lead.attempts}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Last Call</dt>
                  <dd className="mt-0.5 text-neutral-300">{lead.lastCall}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-neutral-500">Next Action</dt>
                  <dd className="mt-0.5 text-neutral-300">{lead.nextAction}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
