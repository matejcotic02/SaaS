import { useState } from "react";
import {
  Sparkles,
  Phone,
  Mic2,
  MessageSquare,
  FileText,
  Clock,
  Save,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared/Toaster";
import { cn } from "@/lib/utils";

type DaySchedule = {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
};

const VOICE_OPTIONS = [
  { id: "james-relaxed", label: "James - Relaxed American Voice (male)" },
  { id: "sarah-professional", label: "Sarah - Professional American Voice (female)" },
  { id: "david-british", label: "David - British Accent (male)" },
  { id: "emma-friendly", label: "Emma - Friendly American Voice (female)" },
  { id: "michael-calm", label: "Michael - Calm & Reassuring (male)" },
  { id: "lisa-warm", label: "Lisa - Warm & Conversational (female)" },
  { id: "marcus-confident", label: "Marcus - Confident & Direct (male)" },
  { id: "hannah-energetic", label: "Hannah - Energetic & Upbeat (female)" },
  { id: "noah-southern", label: "Noah - Soft Southern American (male)" },
  { id: "sophia-australian", label: "Sophia - Clear Australian (female)" },
  { id: "daniel-narrator", label: "Daniel - Smooth & Authoritative (male)" },
  { id: "olivia-youth", label: "Olivia - Young & Approachable (female)" },
  { id: "carlos-bilingual", label: "Carlos - Bilingual US English / Spanish (male)" },
  { id: "nina-irish", label: "Nina - Light Irish Lilt (female)" },
  { id: "ethan-technical", label: "Ethan - Precise & Technical (male)" },
  { id: "aisha-empathetic", label: "Aisha - Empathetic & Patient (female)" },
];

const TIMEZONE_OPTIONS = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const DEFAULT_BUSINESS_HOURS: DaySchedule[] = [
  { day: "Sunday", isOpen: false, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Monday", isOpen: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Tuesday", isOpen: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Wednesday", isOpen: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Thursday", isOpen: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Friday", isOpen: true, startTime: "09:00 AM", endTime: "05:00 PM" },
  { day: "Saturday", isOpen: false, startTime: "09:00 AM", endTime: "05:00 PM" },
];

const TIME_OPTIONS = [
  "12:00 AM", "01:00 AM", "02:00 AM", "03:00 AM", "04:00 AM", "05:00 AM",
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-neutral-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";

const selectClass =
  "appearance-none w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 pr-10 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer";

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-white/10"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

export function AgentSettingsView() {
  const [voice, setVoice] = useState("james-relaxed");
  const [greeting, setGreeting] = useState(
    "Hi, thanks for calling abc window tint. How can I help you today?"
  );
  const [firstMessage, setFirstMessage] = useState(
    "Hi, thanks for calling abc window tint. How can I help you today?"
  );
  const [systemPrompt, setSystemPrompt] = useState(
    `# Personality
You are Emily, a friendly and efficient virtual assistant for an automotive customization shop. You are knowledgeable about the shop's services and pricing, and you're great at helping customers get quotes and book appointments. You are polite, patient, and always focused on providing accurate information and a seamless booking experience.`
  );
  const [timezone, setTimezone] = useState("America/New_York");
  const [businessHours, setBusinessHours] = useState<DaySchedule[]>(
    DEFAULT_BUSINESS_HOURS
  );

  const updateDaySchedule = (
    index: number,
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setBusinessHours((prev) =>
      prev.map((day, i) => (i === index ? { ...day, [field]: value } : day))
    );
  };

  const handleSaveScript = () => {
    toast("Outbound script saved successfully!", {
      description: "Your AI agent will use these settings for outbound calls.",
    });
  };

  const handleBookCall = () => {
    toast("Opening scheduling page...", {
      description: "You'll be redirected to book your free consultation.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Configure Your AI Agent
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Customize your agent's voice, greeting, and booking settings.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-transparent">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Need a More Custom Agent?
              </h2>
              <p className="mt-0.5 text-sm text-neutral-400">
                Want more advanced customizations? Our team can help build a fully
                tailored agent for your business — at no extra cost.
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-blue-400">
                <Check className="h-4 w-4" aria-hidden />
                <span>Custom conversation flows & logic</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
              Included in Your Plan
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={handleBookCall}
              className="w-full gap-1.5 sm:w-auto"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              Book Your Free Call
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="flex items-center gap-2">
            <Mic2 className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">Agent Voice</h2>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            Choose the voice your agent uses when speaking to customers.
          </p>

          <div className="mt-4">
            <label className="text-xs font-medium text-neutral-300">Voice</label>
            <SelectWrapper>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className={cn(selectClass, "mt-1.5")}
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </SelectWrapper>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
              <Sparkles className="h-3 w-3" aria-hidden />
              Recommended for customer support
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="text-sm font-semibold text-foreground">
              Greeting Message
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            The first thing your agent says when answering a call.
          </p>

          <div className="mt-4">
            <label className="text-xs font-medium text-neutral-300">Greeting</label>
            <input
              type="text"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className={cn(inputClass, "mt-1.5")}
              placeholder="Hi, thanks for calling..."
            />
            <p className="mt-2 text-xs text-neutral-500">
              Keep it friendly and include your shop name. The agent will say this
              exact message when picking up.
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">Outbound Script</h2>
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Customize the script your AI agent uses when making outbound calls to
          leads.
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label className="text-xs font-medium text-neutral-300">
              First Message
            </label>
            <textarea
              value={firstMessage}
              onChange={(e) => setFirstMessage(e.target.value)}
              rows={2}
              className={cn(inputClass, "mt-1.5 resize-none")}
              placeholder="Hi, thanks for calling..."
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              The opening message your agent says when the lead picks up.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">
              System Prompt
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              className={cn(inputClass, "mt-1.5 resize-none font-mono text-xs")}
              placeholder="# Personality..."
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Instructions for how the agent should behave during outbound calls.
            </p>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={handleSaveScript}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" aria-hidden />
            Save & Sync Outbound Script
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold text-foreground">Business Hours</h2>
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Set your working hours and timezone for each day of the week.
        </p>

        <div className="mt-5">
          <label className="text-xs font-medium text-neutral-300">Timezone</label>
          <SelectWrapper>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={cn(selectClass, "mt-1.5 max-w-xs")}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </SelectWrapper>
          <p className="mt-2 text-xs text-neutral-500">
            All availability times will be in this timezone.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {businessHours.map((schedule, index) => (
            <div
              key={schedule.day}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3"
            >
              <span className="w-24 text-sm font-medium text-foreground">
                {schedule.day}
              </span>

              <div className="flex items-center gap-2">
                <Toggle
                  checked={schedule.isOpen}
                  onChange={(checked) =>
                    updateDaySchedule(index, "isOpen", checked)
                  }
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    schedule.isOpen ? "text-emerald-400" : "text-neutral-500"
                  )}
                >
                  {schedule.isOpen ? "Open" : "Closed"}
                </span>
              </div>

              {schedule.isOpen && (
                <div className="flex items-center gap-2">
                  <SelectWrapper>
                    <select
                      value={schedule.startTime}
                      onChange={(e) =>
                        updateDaySchedule(index, "startTime", e.target.value)
                      }
                      className="appearance-none rounded-md border border-white/10 bg-white/5 px-2 py-1.5 pr-7 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </SelectWrapper>
                  <span className="text-xs text-neutral-500">to</span>
                  <SelectWrapper>
                    <select
                      value={schedule.endTime}
                      onChange={(e) =>
                        updateDaySchedule(index, "endTime", e.target.value)
                      }
                      className="appearance-none rounded-md border border-white/10 bg-white/5 px-2 py-1.5 pr-7 text-xs text-foreground focus:border-primary/50 focus:outline-none"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </SelectWrapper>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
