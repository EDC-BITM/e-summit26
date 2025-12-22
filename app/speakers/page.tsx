import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import SpeakersHero from "@/components/SpeakersHero"; // you said this already exists in /components
import SpeakersGrid from "@/components/SpeakersGrid";
import PastSpeakersGrid from "@/components/PastSpeakersGrid";

export default function SpeakersPage() {
  return (
    <div className="isolate bg-black text-white">
      <Navbar />
      <main>
        <SpeakersHero />
        <SpeakersGrid />
        <PastSpeakersGrid />
      </main>
      <FooterSection />
    </div>
  );
}
