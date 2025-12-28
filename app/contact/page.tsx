import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ContactHero from "@/components/ContactHero";
import ContactUs from "@/components/ContactUs";
import { domAnimation, LazyMotion } from "framer-motion";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Contact | E-Summit 2026",
  description:
    "Contact the E-Summit 2026 team (EDC BIT Mesra) for partnerships, sponsorships, speaker queries, or general support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact | E-Summit 2026",
    description:
      "Get in touch with the E-Summit 2026 team for sponsorships, partnerships, and queries.",
  },
  twitter: {
    card: "summary",
    title: "Contact | E-Summit 2026",
    description:
      "Get in touch with the E-Summit 2026 team for sponsorships, partnerships, and queries.",
  },
};

export default function ContactPage() {
  return (
    <div className="isolate bg-black text-white">
      <LazyMotion features={domAnimation}>
        <Navbar />
        <main>
          <ContactHero />
          <ReactQueryProvider>
            <ContactUs />
          </ReactQueryProvider>
        </main>
        <FooterSection />
      </LazyMotion>
    </div>
  );
}
