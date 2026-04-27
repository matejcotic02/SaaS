import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { PlasticButton } from "@/components/ui/plastic-button";
import { cn } from "@/lib/utils";
import type { PricingTier } from "@/data/pricing-tiers";

export type { PricingTier };

type PricingCardProps = {
  tier: PricingTier;
};

export function PricingCard({ tier }: PricingCardProps) {
  const {
    name,
    price,
    period = "/mo",
    audience,
    features,
    cta,
    href,
    highlight,
    badge,
  } = tier;

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col rounded-[var(--radius)] border bg-card p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-shadow",
        highlight
          ? "border-primary shadow-[0_0_0_1px_rgba(194,61,72,0.5),0_0_40px_-8px_rgba(194,61,72,0.4)]"
          : "border-[var(--border)]",
        badge && "pt-8",
      )}
    >
      {badge ? (
        <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-primary/50 bg-card px-3 py-0.5 text-xs font-semibold text-foreground shadow-sm">
          {badge}
        </span>
      ) : null}
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums text-foreground">{price}</span>
        {price !== "Custom" ? (
          <span className="text-sm text-muted-foreground">{period}</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{audience}</p>
      <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link to={href} className="mt-auto block w-full pt-6">
        <PlasticButton
          asChild
          size="md"
          variant={highlight ? "primary" : "secondary"}
          className={cn(
            "w-full",
            highlight &&
              "hover:drop-shadow-[0_0_36px_rgba(248,113,113,0.45)] motion-reduce:hover:drop-shadow-none"
          )}
        >
          {cta}
        </PlasticButton>
      </Link>
    </div>
  );
}
