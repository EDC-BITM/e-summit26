import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ForWhomSection from "./components/ForWhomSection";
import SpeakersSection from "./components/SpeakersSection";

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <ForWhomSection />
      <SpeakersSection />
    </>
  );
}
