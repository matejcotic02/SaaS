import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PlasticButton } from "@/components/ui/plastic-button";
import { SectionHeader } from "./SectionHeader";

const faqs: { q: string; a: string }[] = [
  {
    q: "Can the AI book appointments?",
    a: "Yes. It can collect customer details, understand the requested service, check available times, and create a booking once backend integration is connected.",
  },
  {
    q: "Can it transfer calls to a human?",
    a: "Yes. If the caller asks for a person or the conversation requires human help, the AI can transfer the call.",
  },
  {
    q: "Can it send SMS reminders?",
    a: "Yes. Reminder settings are planned inside the dashboard so customers can receive appointment reminders automatically.",
  },
  {
    q: "Can I manage leads?",
    a: "Yes. The app includes lead management and outbound call workflows.",
  },
  {
    q: "Is this only for tint shops?",
    a: "No. The first version is optimized for automotive service businesses, but the structure can support other local service businesses too.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-2xl px-3 sm:px-5">
        <SectionHeader title="Questions before you let AI answer your phone?" />
        <ul className="mt-10 space-y-2">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <PlasticButton
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  variant="secondary"
                  shape="rounded"
                  size="md"
                  align="between"
                  className="!h-auto min-h-12 !font-medium !text-left !text-neutral-100"
                >
                  <span className="pr-2 text-sm leading-snug">{item.q}</span>
                  <ChevronDown
                    className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </PlasticButton>
                {isOpen ? (
                  <p className="px-4 pb-3 pt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
