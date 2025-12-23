import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import EventsHero from "@/components/EventsHero";
import EventSchedule from "@/components/EventSchedule";
import { domAnimation, LazyMotion } from "framer-motion";

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
    <div className="isolate bg-black text-white">
      <LazyMotion features={domAnimation}>
        <Navbar />
        <main>
          <EventsHero />
          <EventSchedule />
        </main>
        <FooterSection />
      </LazyMotion>
    </div>
  );
}
