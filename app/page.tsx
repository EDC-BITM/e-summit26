import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ForWhomSection from "@/components/ForWhomSection";
import SpeakersSection from "@/components/SpeakersSection";
import FooterSection from "@/components/FooterSection";
import EventSchedule from "@/components/EventSchedule";
import Sponsorship from "@/components/Sponsorship";
import Questions from "@/components/Questions";
import { domAnimation, LazyMotion } from "framer-motion";

export const metadata: Metadata = {
  title: "Home",
  description:
    "E-Summit 2026 by EDC BIT Mesra — a flagship entrepreneurship summit featuring speakers, events, networking, and startup opportunities.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "E-Summit 2026 | EDC BIT Mesra",
    description:
      "E-Summit 2026 by EDC BIT Mesra — speakers, events, networking, and startup opportunities.",
  },
  twitter: {
    card: "summary",
    title: "E-Summit 2026 | EDC BIT Mesra",
    description:
      "E-Summit 2026 by EDC BIT Mesra — speakers, events, networking, and startup opportunities.",
  },
};

export default function Page() {
  return (
    <div className="isolate">
      <LazyMotion features={domAnimation}>
        <Navbar />
        <Hero />
        <AboutSection />
        <ForWhomSection />
        <SpeakersSection />
        <EventSchedule />
        <Sponsorship />
        <Questions />
        <FooterSection />
      </LazyMotion>
    </div>
  );
}
