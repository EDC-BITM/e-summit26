import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ForWhomSection from "./components/ForWhomSection";
import SpeakersSection from "./components/SpeakersSection";
import { domAnimation, LazyMotion } from "framer-motion";

export default function Page() {
  return (
    <div className="isolate">
      <LazyMotion features={domAnimation}>
        <Hero />
        <AboutSection />
        <ForWhomSection />
        <SpeakersSection />
      </LazyMotion>
      <Navbar />
    </div>
  );
}
