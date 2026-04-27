import { LandingNavbar } from "../components/landing/LandingNavbar";
import { HeroSection } from "../components/landing/HeroSection";
import { TrustResultsBanner } from "../components/landing/TrustResultsBanner";
import { CallBayOrbitalFlow } from "../components/landing/CallBayOrbitalFlow";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { CustomerCallFlowSection } from "../components/landing/CustomerCallFlowSection";
import { DashboardPreviewSection } from "../components/landing/DashboardPreviewSection";
import { ComparisonSection } from "../components/landing/ComparisonSection";
import { ROIValueSection } from "../components/landing/ROIValueSection";
import { ObjectionHandlingSection } from "../components/landing/ObjectionHandlingSection";
import { IntegrationStackSection } from "../components/landing/IntegrationStackSection";
import { PricingSection } from "../components/landing/PricingSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { FAQSection } from "../components/landing/FAQSection";
import { FinalCTASection } from "../components/landing/FinalCTASection";
import { Footer } from "../components/landing/Footer";
import { FadeIn } from "../components/landing/FadeIn";
import { LandingPageBackground } from "../components/ui/landing-page-background";

export function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background">
      <LandingPageBackground glow={false} />
      <div className="relative z-10">
        <LandingNavbar />
        <main>
          <FadeIn>
            <HeroSection />
          </FadeIn>
          <FadeIn>
            <TrustResultsBanner />
          </FadeIn>
          <FadeIn>
            <CallBayOrbitalFlow />
          </FadeIn>
          <FadeIn>
            <HowItWorksSection />
          </FadeIn>
          <FadeIn>
            <CustomerCallFlowSection />
          </FadeIn>
          <FadeIn>
            <DashboardPreviewSection />
          </FadeIn>
          <FadeIn>
            <ComparisonSection />
          </FadeIn>
          <FadeIn>
            <ROIValueSection />
          </FadeIn>
          <FadeIn>
            <ObjectionHandlingSection />
          </FadeIn>
          <FadeIn>
            <IntegrationStackSection />
          </FadeIn>
          <FadeIn>
            <PricingSection />
          </FadeIn>
          <FadeIn>
            <TestimonialsSection />
          </FadeIn>
          <FadeIn>
            <FAQSection />
          </FadeIn>
          <FadeIn>
            <FinalCTASection />
          </FadeIn>
        </main>
        <FadeIn>
          <Footer />
        </FadeIn>
      </div>
    </div>
  );
}
