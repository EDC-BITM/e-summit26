import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import ContactHero from "@/components/ContactHero";
import ContactUs from "@/components/ContactUs";
import { domAnimation, LazyMotion } from "framer-motion";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { ReactLenis } from "@/components/SmoothScrolling";

export const metadata: Metadata = {
  title: "Contact",
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
    </ReactLenis>
  );
}
