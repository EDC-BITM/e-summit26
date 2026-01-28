import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import EventsHero from "@/components/EventsHero";
import EventSchedule from "@/components/EventSchedule";
import EventsList from "@/components/EventsList";
import { domAnimation, LazyMotion } from "framer-motion";
import { ReactLenis } from "@/components/SmoothScrolling";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore the E-Summit 2026 events and schedule — sessions, competitions, workshops, and networking opportunities.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    type: "website",
    url: "/events",
    title: "Events | E-Summit 2026",
    description:
      "Explore E-Summit 2026 events: sessions, competitions, workshops, and networking.",
  },
  twitter: {
    card: "summary",
    title: "Events | E-Summit 2026",
    description:
      "Explore E-Summit 2026 events: sessions, competitions, workshops, and networking.",
  },
};

export default function EventsPage() {
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
            <EventsHero />
            <EventSchedule />
            <EventsList />
          </main>
          <FooterSection />
        </LazyMotion>
      </div>
    </ReactLenis>
  );
}
