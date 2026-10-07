import { ClosingCta } from "@/components/landing/ClosingCta";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Nav } from "@/components/landing/Nav";
import { Pricing } from "@/components/landing/Pricing";
import { Roadmap } from "@/components/landing/Roadmap";
import { Showcase } from "@/components/landing/Showcase";
import { SkipLink } from "@/components/landing/SkipLink";
import { Trust } from "@/components/landing/Trust";
import { WhoFor } from "@/components/landing/WhoFor";
import { RevealObserver } from "@/components/ui/RevealObserver";

// Mismo orden que la v1.7: SkipLink y Nav antes de <main>, Footer después.
export default function Page() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <HowItWorks />
        <Showcase />
        <WhoFor />
        <Pricing />
        <Trust />
        <Roadmap />
        <ClosingCta />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
