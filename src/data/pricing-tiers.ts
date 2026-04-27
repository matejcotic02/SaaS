export type PricingTier = {
  name: string;
  price: string;
  period?: string;
  audience: string;
  features: string[];
  cta: string;
  href: string;
  highlight?: boolean;
  badge?: string;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "$49",
    audience: "Small shops getting started",
    features: [
      "AI booking agent",
      "Basic call history",
      "SMS reminders",
      "Up to 100 calls/month",
    ],
    cta: "Sign Up",
    href: "/signup",
  },
  {
    name: "Pro",
    price: "$149",
    audience: "Growing businesses",
    features: [
      "Everything in Starter",
      "Outbound calling",
      "Lead management",
      "Human transfer",
      "Up to 500 calls/month",
    ],
    cta: "Choose Pro",
    href: "/signup",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    audience: "Teams managing multiple locations",
    features: [
      "Everything in Pro",
      "Multiple locations",
      "Advanced reporting",
      "Priority support",
    ],
    cta: "Contact Sales",
    href: "/signup",
  },
];
