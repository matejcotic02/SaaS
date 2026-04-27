import { useState } from "react";
import {
  CheckCircle2,
  Info,
  MessageSquare,
  Save,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared/Toaster";
import { cn } from "@/lib/utils";

type ReminderTiming = "48h" | "24h" | "2h" | "1h";

type TimingOption = {
  id: ReminderTiming;
  label: string;
};

const timingOptions: TimingOption[] = [
  { id: "48h", label: "48 hours before" },
  { id: "24h", label: "24 hours before" },
  { id: "2h", label: "2 hours before" },
  { id: "1h", label: "1 hour before" },
];

const variables = [
  "{customer_name}",
  "{shop_name}",
  "{service_name}",
  "{date}",
  "{time}",
];

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-foreground placeholder:text-neutral-500 transition-colors focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30";

function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        checked ? "bg-primary" : "bg-white/10",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function CharacterCount({ value }: { value: string }) {
  return (
    <p className="mt-2 text-xs text-neutral-500">
      {value.length}/160 characters (recommended)
    </p>
  );
}

export function RemindersView() {
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [selectedTimings, setSelectedTimings] = useState<ReminderTiming[]>([
    "24h",
  ]);
  const [smsTemplate, setSmsTemplate] = useState(
    "Hi {customer_name}, this is a reminder about your appointment at {shop_name} on {date} at {time}. Reply STOP to opt out.",
  );
  const [confirmationsEnabled, setConfirmationsEnabled] = useState(true);
  const [confirmationTemplate, setConfirmationTemplate] = useState(
    "Hi {customer_name}, your appointment at {shop_name} has been confirmed for {date} at {time}. We look forward to seeing you!",
  );
  const [reviewsEnabled, setReviewsEnabled] = useState(false);
  const [reviewLink, setReviewLink] = useState("");
  const [reviewTiming, setReviewTiming] = useState("2h-after");
  const [reviewTemplate, setReviewTemplate] = useState(
    "Hi {customer_name}, thanks for visiting {shop_name}! We'd love to hear about your experience. Leave us a review: {review_link}",
  );

  const toggleTiming = (timing: ReminderTiming) => {
    setSelectedTimings((current) =>
      current.includes(timing)
        ? current.filter((item) => item !== timing)
        : [...current, timing],
    );
  };

  const handleSave = () => {
    toast("Reminder settings saved", {
      description: "Your SMS reminder templates and timing have been updated.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Appointment Reminders
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Configure when customers receive SMS reminders.
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4" aria-hidden />
          Save Changes
        </Button>
      </header>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
          <Info className="h-4 w-4 text-primary" aria-hidden />
          <span className="font-medium text-neutral-300">
            Available template variables:
          </span>
          {variables.map((variable) => (
            <code
              key={variable}
              className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-neutral-300"
            >
              {variable}
            </code>
          ))}
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
              <MessageSquare className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                SMS Reminders
              </h2>
              <p className="mt-0.5 text-xs text-neutral-400">
                Send text message reminders to customers.
              </p>
            </div>
          </div>
          <Toggle checked={smsEnabled} onChange={setSmsEnabled} />
        </header>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-xs font-medium text-neutral-300">
              Send reminders:
            </p>
            <div className="mt-2 space-y-2">
              {timingOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 text-sm text-neutral-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedTimings.includes(option.id)}
                    disabled={!smsEnabled}
                    onChange={() => toggleTiming(option.id)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/30 disabled:opacity-50"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">
              Message Template
            </label>
            <textarea
              value={smsTemplate}
              disabled={!smsEnabled}
              onChange={(event) => setSmsTemplate(event.target.value)}
              rows={4}
              className={cn(inputClass, "mt-1.5 resize-none disabled:opacity-60")}
            />
            <CharacterCount value={smsTemplate} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Booking Confirmations
              </h2>
              <p className="mt-0.5 text-xs text-neutral-400">
                Send instant SMS confirmation when a booking is made.
              </p>
            </div>
          </div>
          <Toggle
            checked={confirmationsEnabled}
            onChange={setConfirmationsEnabled}
          />
        </header>

        <div className="mt-5">
          <label className="text-xs font-medium text-neutral-300">
            Confirmation Message Template
          </label>
          <textarea
            value={confirmationTemplate}
            disabled={!confirmationsEnabled}
            onChange={(event) => setConfirmationTemplate(event.target.value)}
            rows={4}
            className={cn(inputClass, "mt-1.5 resize-none disabled:opacity-60")}
          />
          <CharacterCount value={confirmationTemplate} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/20">
              <Star className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Google Review Requests
              </h2>
              <p className="mt-0.5 text-xs text-neutral-400">
                Automatically request Google reviews after appointments.
              </p>
            </div>
          </div>
          <Toggle checked={reviewsEnabled} onChange={setReviewsEnabled} />
        </header>

        <div className="mt-5 space-y-5">
          <div>
            <label className="text-xs font-medium text-neutral-300">
              Google Review Link
            </label>
            <input
              type="url"
              value={reviewLink}
              disabled={!reviewsEnabled}
              onChange={(event) => setReviewLink(event.target.value)}
              placeholder="https://g.page/r/your-business/review"
              className={cn(inputClass, "mt-1.5 disabled:opacity-60")}
            />
            <p className="mt-2 text-xs text-neutral-500">
              Find your link in Google Business Profile.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">
              Send review request:
            </label>
            <select
              value={reviewTiming}
              disabled={!reviewsEnabled}
              onChange={(event) => setReviewTiming(event.target.value)}
              className={cn(inputClass, "mt-1.5 disabled:opacity-60")}
            >
              <option value="2h-after">2 hours after</option>
              <option value="1d-after">1 day after</option>
              <option value="3d-after">3 days after</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">
              Review Request Message
            </label>
            <textarea
              value={reviewTemplate}
              disabled={!reviewsEnabled}
              onChange={(event) => setReviewTemplate(event.target.value)}
              rows={4}
              className={cn(inputClass, "mt-1.5 resize-none disabled:opacity-60")}
            />
            <CharacterCount value={reviewTemplate} />
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 text-xs text-neutral-400">
            Use{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-neutral-300">
              {"{review_link}"}
            </code>{" "}
            to insert your Google review link in the message.
          </div>
        </div>
      </section>
    </div>
  );
}
