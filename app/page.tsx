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
import { ReactLenis } from "@/components/SmoothScrolling";

export default function Page() {
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
      <div className="isolate w-full overflow-x-hidden">
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
    </ReactLenis>
  );
}
