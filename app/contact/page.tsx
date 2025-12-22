import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ContactHero from "@/components/ContactHero";
import ContactUs from "@/components/ContactUs";
export default function ContactPage() {
  return (
    <div className="isolate bg-black text-white">
      <Navbar />
      <main>
        <ContactHero />
        <ContactUs />
      </main>
      <FooterSection />
    </div>
  );
}
