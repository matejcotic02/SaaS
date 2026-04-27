import { useSyncExternalStore } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "warning" | "error";

export type Toast = {
  id: number;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();
let nextId = 1;

function emit() {
  for (const l of listeners) l(toasts);
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return toasts;
}

export type ToastOptions = {
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export function toast(message: string, options: ToastOptions = {}) {
  const id = nextId++;
  const t: Toast = {
    id,
    message,
    description: options.description,
    variant: options.variant ?? "default",
    duration: options.duration ?? 4000,
  };
  toasts = [...toasts, t];
  emit();
  if (t.duration > 0) {
    window.setTimeout(() => dismiss(id), t.duration);
  }
  return id;
}

toast.success = (message: string, options: Omit<ToastOptions, "variant"> = {}) =>
  toast(message, { ...options, variant: "success" });
toast.error = (message: string, options: Omit<ToastOptions, "variant"> = {}) =>
  toast(message, { ...options, variant: "error" });
toast.warning = (message: string, options: Omit<ToastOptions, "variant"> = {}) =>
  toast(message, { ...options, variant: "warning" });

export function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

const variantIcon = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertTriangle,
} as const;

const variantClass: Record<ToastVariant, string> = {
  default: "border-white/10 bg-card text-foreground",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  error: "border-red-500/30 bg-red-500/10 text-red-100",
};

const variantIconColor: Record<ToastVariant, string> = {
  default: "text-primary",
  success: "text-emerald-300",
  warning: "text-amber-300",
  error: "text-red-300",
};

export function Toaster() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[min(92vw,360px)] flex-col gap-2 sm:right-6 sm:top-6">
      {items.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastCard({ toast: t }: { toast: Toast }) {
  const Icon = variantIcon[t.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl border px-3.5 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-md toast-enter",
        variantClass[t.variant],
      )}
    >
      <Icon
        className={cn("mt-0.5 h-4 w-4 shrink-0", variantIconColor[t.variant])}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">{t.message}</p>
        {t.description ? (
          <p className="mt-0.5 text-xs text-neutral-400">{t.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => dismiss(t.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-md p-1 text-neutral-400 transition-colors hover:bg-white/5 hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
