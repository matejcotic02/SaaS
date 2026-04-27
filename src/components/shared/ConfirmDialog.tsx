import { useEffect } from "react";
import { PlasticButton } from "@/components/ui/plastic-button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
  className,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        className={cn(
          "relative z-[101] w-full max-w-sm rounded-2xl border border-white/10 bg-card p-5 shadow-[0_24px_60px_rgba(0,0,0,0.5)]",
          className,
        )}
      >
        <h2 id="confirm-title" className="text-base font-semibold text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm text-neutral-400">{description}</p>
        ) : null}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <PlasticButton
            variant="secondary"
            size="sm"
            onClick={onCancel}
            className="!w-auto"
          >
            {cancelLabel}
          </PlasticButton>
          <PlasticButton
            variant={destructive ? "primary" : "primary"}
            size="sm"
            onClick={onConfirm}
            className="!w-auto"
          >
            {confirmLabel}
          </PlasticButton>
        </div>
      </div>
    </div>
  );
}
