import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-amber-50">
      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
}
