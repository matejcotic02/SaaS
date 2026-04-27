import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { FadeInItem, FadeInStagger } from "./FadeIn";
import { PricingCards } from "./PricingCards";
import { LANDING_CONTAINER_CLASS } from "./landingLayout";

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className={cn(LANDING_CONTAINER_CLASS)}>
        <SectionHeader
          title="Start simple. Scale when your calls grow."
          subtitle="Choose the plan that matches your call volume and follow-up needs."
        />
        <FadeInStagger className="mt-12">
          <FadeInItem>
            <PricingCards />
          </FadeInItem>
        </FadeInStagger>
      </div>
    </section>
  );
}