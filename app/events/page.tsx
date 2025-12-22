import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import EventsHero from "@/components/EventsHero";
import EventSchedule from "@/components/EventSchedule";
export default function EventsPage() {
  return (
    <div className="isolate bg-black text-white">
      <Navbar />
      <main>
        <EventsHero />
        <EventSchedule />
      </main>
      <FooterSection />
    </div>
  );
}
