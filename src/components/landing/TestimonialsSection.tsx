import { useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { FadeInItem, FadeInStagger } from "./FadeIn";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Mike R.",
    role: "Tint Shop Owner",
    avatar: "https://i.pravatar.cc/128?img=12",
    quote:
      "CallBay gives us a much clearer way to handle calls and follow-up without slowing down the team.",
  },
  {
    name: "Jessica L.",
    role: "Auto Detail Studio",
    avatar: "https://i.pravatar.cc/128?img=45",
    quote: "The biggest value is that leads do not get forgotten after the first missed call.",
  },
  {
    name: "Aaron P.",
    role: "Ceramic Coating Shop",
    avatar: "https://i.pravatar.cc/128?img=33",
    quote:
      "If the routine booking questions are handled automatically, our staff can stay focused on the cars.",
  },
  {
    name: "Sam T.",
    role: "Mobile Detailer",
    avatar: "https://i.pravatar.cc/128?img=15",
    quote:
      "After-hours calls used to vanish. Now they turn into booked jobs we would have missed entirely.",
  },
  {
    name: "Priya K.",
    role: "Wrap & PPF Shop",
    avatar: "https://i.pravatar.cc/128?img=47",
    quote: "Reminders alone cut our no-shows enough that the line item basically pays for itself.",
  },
  {
    name: "Derek M.",
    role: "Fleet & Commercial",
    avatar: "https://i.pravatar.cc/128?img=52",
    quote: "We see who called, what they wanted, and what happened—without digging through voicemails.",
  },
  {
    name: "Lena V.",
    role: "Body Shop Coordinator",
    avatar: "https://i.pravatar.cc/128?img=27",
    quote: "Transfers to the front desk only when it is worth a human—everything else stays on rails.",
  },
  {
    name: "Chris H.",
    role: "Independent Garage",
    avatar: "https://i.pravatar.cc/128?img=60",
    quote: "Customers get a real answer fast, and we are not stuck repeating the same script all day.",
  },
];

function TestimonialCard({ t, variant = "marquee" }: { t: Testimonial; variant?: "marquee" | "grid" }) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-[var(--radius)] border border-[var(--border)] bg-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-6",
        variant === "marquee"
          ? "w-[min(100vw-3rem,18rem)] shrink-0 sm:w-72"
          : "h-full w-full min-h-[12rem]",
      )}
    >
      <Quote className="h-7 w-7 text-primary/40 sm:h-8 sm:w-8" aria-hidden />
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <footer className="mt-4 border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-3">
          <img
            src={t.avatar}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[var(--border)]"
            loading="lazy"
            decoding="async"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
          </div>
        </div>
      </footer>
    </article>
  );
}

function TestimonialsMarquee() {
  const loop = [...testimonials, ...testimonials];

  return (
    <div
      className="relative mt-12 w-full [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
      role="region"
      aria-label="Customer testimonials"
    >
      <div className="overflow-hidden">
        <div className="testimonial-marquee-track gap-4 pr-4 sm:gap-5 sm:pr-5">
          {loop.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} variant="marquee" />
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialsStaticGrid() {
  return (
    <FadeInStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {testimonials.map((t) => (
        <FadeInItem key={t.name} className="h-full min-h-0">
          <div className="h-full">
            <TestimonialCard t={t} variant="grid" />
          </div>
        </FadeInItem>
      ))}
    </FadeInStagger>
  );
}

export function TestimonialsSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="testimonials" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          title="Designed for businesses that cannot afford missed calls"
          subtitle="Real shops need the phone to work. Here is how owners might talk about that—once you have real customers on CallBay, swap these in."
        />
      </div>

      {reducedMotion ? (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <TestimonialsStaticGrid />
        </div>
      ) : (
        <TestimonialsMarquee />
      )}

      <div className="mx-auto mt-8 max-w-6xl px-4 text-center sm:px-6">
        <p className="text-xs text-muted-foreground">Example testimonials for layout preview.</p>
      </div>
    </section>
  );
}
