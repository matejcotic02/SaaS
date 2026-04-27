import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { PlasticButton } from "@/components/ui/plastic-button";

export function FinalCTASection() {
  return (
    <section id="cta" className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-8 shadow-[0_0_0_1px_rgba(194,61,72,0.25),0_0_60px_-12px_rgba(194,61,72,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-10">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
            aria-hidden
          />
          <div className="relative text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Stop missing calls. Start booking more jobs.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-sm text-muted-foreground sm:text-base">
              Launch your AI phone assistant and manage every call, lead, and booking from one
              dashboard.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link to="/signup" className="mx-auto block w-full max-w-sm sm:mx-0 sm:max-w-[15rem]">
                <PlasticButton asChild size="md" variant="primary" className="w-full">
                  Sign Up
                  <ArrowRight
                    className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                    aria-hidden
                  />
                </PlasticButton>
              </Link>
              <Link to="/dashboard" className="mx-auto block w-full max-w-sm sm:max-w-[12rem]">
                <PlasticButton asChild size="md" variant="secondary" className="w-full">
                  <Play className="h-4 w-4 shrink-0" aria-hidden />
                  View Demo
                </PlasticButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
