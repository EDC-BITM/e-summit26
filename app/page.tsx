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
