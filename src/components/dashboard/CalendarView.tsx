import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  RefreshCw,
  Settings,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "week" | "month";

const HOURS = Array.from({ length: 23 }, (_, i) => i + 1);

function formatHour(hour: number): string {
  if (hour === 12) return "12 PM";
  if (hour > 12) return `${hour - 12} PM`;
  return `${hour} AM`;
}

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function formatDateRange(dates: Date[]): string {
  const first = dates[0];
  const last = dates[6];
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const yearOptions: Intl.DateTimeFormatOptions = { ...options, year: "numeric" };

  if (first.getFullYear() !== last.getFullYear()) {
    return `${first.toLocaleDateString("en-US", yearOptions)} - ${last.toLocaleDateString("en-US", yearOptions)}`;
  }
  if (first.getMonth() !== last.getMonth()) {
    return `${first.toLocaleDateString("en-US", options)} - ${last.toLocaleDateString("en-US", yearOptions)}`;
  }
  return `${first.toLocaleDateString("en-US", options)} - ${last.getDate()}, ${last.getFullYear()}`;
}

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [serviceDays, setServiceDays] = useState(1);

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  const goToToday = () => setCurrentDate(new Date());
  const goPrev = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };
  const goNext = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-white/10 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 border-b border-white/5 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-neutral-400" aria-hidden />
              <span className="text-neutral-400">Service Days:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setServiceDays((s) => Math.max(1, s - 1))}
                  className="inline-flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10"
                  aria-label="Decrease service days"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="min-w-[1.5rem] text-center font-medium text-foreground">
                  {serviceDays}
                </span>
                <button
                  type="button"
                  onClick={() => setServiceDays((s) => s + 1)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-white/5 text-neutral-300 transition-colors hover:bg-white/10"
                  aria-label="Increase service days"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <span className="text-neutral-500">1 booking per time slot</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="destructive" size="sm" className="gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Block Time
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                Refresh
              </Button>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label="Calendar settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="font-medium"
              >
                Today
              </Button>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-l-md border border-white/10 bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-r-md border border-l-0 border-white/10 bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-foreground"
                  aria-label="Next week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatDateRange(weekDates)}
              </span>
            </div>

            <div className="flex rounded-lg border border-white/10 bg-white/5 p-0.5">
              {(["day", "week", "month"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    viewMode === mode
                      ? "bg-white/10 text-foreground"
                      : "text-neutral-400 hover:text-foreground"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-white/5">
              <div className="border-r border-white/5" />
              {weekDates.map((date, i) => {
                const dayIsToday = isToday(date);
                return (
                  <div
                    key={i}
                    className={cn(
                      "border-r border-white/5 px-2 py-3 text-center last:border-r-0",
                      dayIsToday && "bg-primary/5"
                    )}
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                      {DAY_NAMES[i]}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-lg font-semibold",
                        dayIsToday
                          ? "inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
                          : "text-foreground"
                      )}
                    >
                      {date.getDate()}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-white/5 last:border-b-0"
                >
                  <div className="flex items-start justify-end border-r border-white/5 pr-2 pt-1">
                    <span className="text-[10px] text-neutral-500">
                      {formatHour(hour)}
                    </span>
                  </div>
                  {weekDates.map((date, i) => {
                    const dayIsToday = isToday(date);
                    return (
                      <div
                        key={i}
                        className={cn(
                          "h-10 border-r border-white/5 last:border-r-0 transition-colors hover:bg-white/[0.02]",
                          dayIsToday && "bg-primary/[0.02]"
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/5 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-blue-500" />
            <span className="text-xs text-neutral-400">Bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-neutral-500" />
            <span className="text-xs text-neutral-400">Blocked Time</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-blue-400" />
            <span className="text-xs text-neutral-400">Google Calendar</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20">
            <Calendar className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground">
              Google Calendar Sync{" "}
              <span className="text-xs font-normal text-neutral-500">
                (Optional)
              </span>
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-400">
              Your AI agent uses the CallBay calendar by default. Optionally
              connect Google Calendar to sync bookings and block external events.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-medium text-neutral-300">
            Why connect Google Calendar? (Optional)
          </p>
          <ul className="mt-2 space-y-1.5">
            {[
              "CallBay bookings automatically appear in Google Calendar",
              "External Google Calendar events additionally block booking slots",
              "Changes sync automatically between both calendars",
            ].map((text) => (
              <li
                key={text}
                className="flex items-start gap-2 text-sm text-neutral-400"
              >
                <CheckCircle2
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                  aria-hidden
                />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          <span className="font-medium text-neutral-400">Note:</span> Your AI
          agent already works without Google Calendar. CallBay's native calendar
          is the primary source of truth for all bookings and availability.
        </p>

        <div className="mt-5">
          <Button variant="outline" size="sm" disabled className="gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            Coming Soon
          </Button>
          <p className="mt-2 text-xs text-neutral-500">
            Google Calendar integration is awaiting approval and will be
            available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
