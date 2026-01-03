import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import SpeakersHero from "@/components/SpeakersHero"; // you said this already exists in /components
import SpeakersGrid from "@/components/SpeakersGrid";
import PastSpeakersGrid from "@/components/PastSpeakersGrid";
import { domAnimation, LazyMotion } from "framer-motion";
import { ReactLenis } from "@/components/SmoothScrolling";

export const metadata: Metadata = {
  title: "Speakers",
  description:
    "Meet the speakers and past speakers of E-Summit 2026 — founders, investors, creators, and leaders sharing actionable insights.",
  alternates: {
    canonical: "/speakers",
  },
  openGraph: {
    type: "website",
    url: "/speakers",
    title: "Speakers | E-Summit 2026",
    description:
      "Meet E-Summit 2026 speakers — founders, investors, creators, and leaders.",
  },
  twitter: {
    card: "summary",
    title: "Speakers | E-Summit 2026",
    description:
      "Meet E-Summit 2026 speakers — founders, investors, creators, and leaders.",
  },
};

export default function SpeakersPage() {
  return (
    <ReactLenis
      options={{
        duration: 1.2,
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
      }}
      root
    >
      <div className="isolate bg-black text-white">
        <LazyMotion features={domAnimation}>
          <Navbar />
          <main>
            <SpeakersHero />
            <SpeakersGrid />
            <PastSpeakersGrid />
          </main>
          <FooterSection />
        </LazyMotion>
      </div>
    </ReactLenis>
  );
}
