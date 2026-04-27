import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CheckCircle2, Phone, Sparkles, type LucideIcon } from "lucide-react";
import * as PricingCard from "@/components/ui/pricing-card";
import { PlasticButton } from "@/components/ui/plastic-button";
import { cn } from "@/lib/utils";
import { PRICING_TIERS } from "@/data/pricing-tiers";

const tierIcons: Record<string, LucideIcon> = {
  Starter: Phone,
  Pro: Sparkles,
  Agency: Building2,
};

export function PricingCards() {
  const [selectedTierName, setSelectedTierName] = useState("Pro");

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-size:14px_14px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,black,transparent_70%)]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 0.7px, transparent 0.7px)",
        }}
      />
      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRICING_TIERS.map((tier) => {
          const Icon = tierIcons[tier.name] ?? Phone;
          const isCustom = tier.price === "Custom";
          const isSelected = selectedTierName === tier.name;
          return (
            <PricingCard.Card
              key={tier.name}
              onClick={() => setSelectedTierName(tier.name)}
              className={cn(
                "h-full !max-w-none cursor-pointer transition-[box-shadow,ring] duration-300 ease-out",
                isSelected &&
                  "ring-1 ring-primary/45 shadow-[0_0_0_1px_rgba(194,61,72,0.4),0_0_40px_-8px_rgba(194,61,72,0.35)]",
              )}
            >
              <PricingCard.Header
                className={cn(
                  isSelected && "border-primary/35 ring-1 ring-primary/15",
                )}
              >
                <PricingCard.Plan>
                  <PricingCard.PlanName>
                    <Icon className="shrink-0 text-primary" aria-hidden />
                    <span className="text-foreground">{tier.name}</span>
                  </PricingCard.PlanName>
                  {tier.badge ? (
                    <PricingCard.Badge>{tier.badge}</PricingCard.Badge>
                  ) : null}
                </PricingCard.Plan>
                <PricingCard.Price>
                  <PricingCard.MainPrice
                    className={cn(!isCustom && "text-primary", isCustom && "text-foreground")}
                  >
                    {tier.price}
                  </PricingCard.MainPrice>
                  {!isCustom ? (
                    <PricingCard.Period>
                      {tier.period ?? "/mo"}
                    </PricingCard.Period>
                  ) : null}
                </PricingCard.Price>
                <Link to={tier.href} className="relative z-10 block w-full">
                  <PlasticButton
                    asChild
                    size="md"
                    variant={isSelected ? "primary" : "secondary"}
                    className={cn(
                      "w-full",
                      isSelected &&
                        "hover:drop-shadow-[0_0_28px_rgba(248,113,113,0.4)] motion-reduce:hover:drop-shadow-none",
                    )}
                  >
                    {tier.cta}
                  </PlasticButton>
                </Link>
              </PricingCard.Header>

              <PricingCard.Body>
                <PricingCard.Description>{tier.audience}</PricingCard.Description>
                <PricingCard.List>
                  {tier.features.map((item) => (
                    <PricingCard.ListItem key={item}>
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </PricingCard.ListItem>
                  ))}
                </PricingCard.List>
              </PricingCard.Body>
            </PricingCard.Card>
          );
        })}
      </div>
    </div>
  );
}
