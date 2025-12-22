import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import VenueHero from "@/components/VenueHero";
import VenueReveal from "@/components/VenueReveal";
export default function VenuePage() {
  return (
    <div className="isolate bg-black text-white">
      <Navbar />
      <main>
        <VenueHero />
        <VenueReveal />
      </main>
      <FooterSection />
    </div>
  );
}
