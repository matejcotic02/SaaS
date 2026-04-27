import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group flex h-full min-h-0 flex-col rounded-[var(--radius)] border border-[var(--border)] bg-card p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-colors hover:border-primary/50 hover:shadow-[0_0_0_1px_rgba(194,61,72,0.2),0_12px_40px_rgba(0,0,0,0.45)]">
      <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 min-h-0 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
