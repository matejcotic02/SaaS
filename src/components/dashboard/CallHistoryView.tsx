import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, type StatusVariant } from "@/components/shared/StatusBadge";
import {
  mockCallRecordings,
  type CallRecordingRow,
  type CallRecordingTag,
} from "@/data/dashboardMockData";

const tagVariant: Record<CallRecordingTag, StatusVariant> = {
  Transferred: "warning",
  Booked: "success",
};

export function CallHistoryView() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCalls = useMemo(() => {
    if (!searchTerm.trim()) return mockCallRecordings;
    const term = searchTerm.toLowerCase();

    return mockCallRecordings.filter((call) =>
      [
        call.title,
        call.dateTime,
        call.duration,
        call.status,
        ...call.tags,
      ].some((value) => value.toLowerCase().includes(term)),
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          Call History
        </h1>
      </header>

      <section aria-labelledby="call-recordings-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="call-recordings-title"
              className="text-base font-semibold text-foreground"
            >
              Call Recordings
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              View recent conversations with your AI agent.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:items-center lg:justify-end">
            <div className="relative min-w-0 lg:w-56">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                aria-hidden
              />
              <Input
                type="text"
                placeholder="Search calls..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-9 pl-9"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              Filter by date
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Phone className="h-3.5 w-3.5" aria-hidden />
              All Calls
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
              Sync Calls
            </Button>
          </div>
        </div>

        <p className="mt-4 text-xs text-neutral-400">
          Showing {filteredCalls.length} call
          {filteredCalls.length !== 1 ? "s" : ""}
        </p>

        <ul className="mt-3 space-y-3">
          {filteredCalls.map((call) => (
            <CallRecordingItem key={call.id} call={call} />
          ))}
          {filteredCalls.length === 0 && (
            <li className="rounded-xl border border-white/10 bg-card px-5 py-8 text-center text-sm text-neutral-500 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
              No calls found matching your search.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

function CallRecordingItem({ call }: { call: CallRecordingRow }) {
  return (
    <li className="rounded-xl border border-white/10 bg-card px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-colors hover:bg-white/[0.02] sm:px-5">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-neutral-400 ring-1 ring-inset ring-white/10">
            <Phone className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{call.title}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {call.dateTime}
              <span className="mx-2 text-neutral-700">•</span>
              {call.duration}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {call.tags.map((tag) => (
            <StatusBadge key={tag} variant={tagVariant[tag]} className="py-1">
              {tag}
            </StatusBadge>
          ))}
          <StatusBadge variant="info" className="py-1">
            {call.status}
          </StatusBadge>
          {call.hasTranscript && (
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden />
              Transcript
            </button>
          )}
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label={`Expand ${call.title}`}
          >
            <ChevronDown className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </li>
  );
}
