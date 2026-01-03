import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import VenueHero from "@/components/VenueHero";
import VenueReveal from "@/components/VenueReveal";
import { domAnimation, LazyMotion } from "framer-motion";
import { ReactLenis } from "@/components/SmoothScrolling";

export const metadata: Metadata = {
  title: "Venue",
  description:
    "Find the E-Summit 2026 venue details at BIT Mesra — location, directions, and on-ground information for attendees.",
  alternates: {
    canonical: "/venue",
  },
  openGraph: {
    type: "website",
    url: "/venue",
    title: "Venue | E-Summit 2026",
    description:
      "Venue details for E-Summit 2026 at BIT Mesra — location, directions, and attendee info.",
  },
  twitter: {
    card: "summary",
    title: "Venue | E-Summit 2026",
    description:
      "Venue details for E-Summit 2026 at BIT Mesra — location, directions, and attendee info.",
  },
};

export default function VenuePage() {
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
            <VenueHero />
            <VenueReveal />
          </main>
          <FooterSection />
        </LazyMotion>
      </div>
    </ReactLenis>
  );
}
