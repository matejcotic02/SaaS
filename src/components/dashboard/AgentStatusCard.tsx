import { Link } from "react-router-dom";
import { BookOpen, Bot, CheckCircle2, PhoneCall, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { toast } from "@/components/shared/Toaster";
import { mockAgentStatus } from "@/data/dashboardMockData";

const statusVariant: Record<
  typeof mockAgentStatus.status,
  "success" | "warning" | "neutral"
> = {
  Active: "success",
  Paused: "warning",
  Inactive: "neutral",
};

type AgentStatusCardProps = {
  compact?: boolean;
};

export function AgentStatusCard({ compact = false }: AgentStatusCardProps) {
  const a = mockAgentStatus;

  return (
    <section
      className="flex h-full min-h-0 flex-col rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6"
      aria-labelledby="agent-title"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
            <Bot className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {compact ? "Your AI Agent" : "AI Agent Status"}
            </p>
            <h2
              id="agent-title"
              className="mt-0.5 text-base font-semibold text-foreground sm:text-lg"
            >
              {a.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge variant={statusVariant[a.status]} dot>
                {a.status}
              </StatusBadge>
              <span className="text-xs text-neutral-400">
                Last activity {a.lastActivity}
              </span>
            </div>
          </div>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
          <dt className="text-[11px] uppercase tracking-wide text-neutral-500">
            Voice
          </dt>
          <dd className="mt-0.5 text-sm text-neutral-200">{a.voice}</dd>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
          <dt className="text-[11px] uppercase tracking-wide text-neutral-500">
            Mode
          </dt>
          <dd className="mt-0.5 text-sm text-neutral-200">{a.mode}</dd>
        </div>
        {compact ? (
          <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 sm:col-span-2">
            <dt className="text-[11px] uppercase tracking-wide text-neutral-500">
              Phone number
            </dt>
            <dd className="mt-0.5 text-sm text-neutral-200">
              Customer calls route to CallBay once phone setup is complete.
            </dd>
          </div>
        ) : null}
      </dl>

      <div className={compact ? "mt-5 hidden lg:block" : "mt-5"}>
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          Capabilities
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {a.capabilities.map((cap) => (
            <li
              key={cap}
              className="flex items-center gap-2 text-sm text-neutral-300"
            >
              <CheckCircle2
                className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                aria-hidden
              />
              {cap}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
        <Button asChild variant="default" size="sm" className="w-full sm:w-auto">
          <Link to="/agent">
            <Settings2 className="h-4 w-4 shrink-0" aria-hidden />
            Configure Agent
          </Link>
        </Button>
        {compact ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
          >
            <Link to="/agent">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
              Knowledge Base
            </Link>
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              toast("Test call will be available after phone setup.", {
                description: "Connect your phone number to enable test calls.",
              })
            }
            className="w-full sm:w-auto"
          >
            <PhoneCall className="h-4 w-4 shrink-0" aria-hidden />
            Test Call
          </Button>
        )}
      </div>
    </section>
  );
}
