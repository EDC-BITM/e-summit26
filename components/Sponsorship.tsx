"use client";

import AnimatedBlurText from "./AnimatedBlurText";
import { CldImage } from "next-cloudinary";
import { IMAGES } from "@/lib/images";
import { motion } from "framer-motion";
import LogoLoop, { type LogoItem } from "./LogoLoop";
import Image from "next/image";

export default function Sponsorship() {
  const sponsors = IMAGES.sponsors;
  const currentSponsors: LogoItem[] = [
    {
      src: "/sponsors/651b9c8fa3255cf8ca0c191f_EazyDiner Logo Text 1.png",
      alt: "EazyDiner",
    },
    { src: "/sponsors/Balshali TMT English-02 1.png", alt: "Balshali TMT" },
    { src: "/sponsors/Brown - 2 (1) 1.png", alt: "Brown" },
    { src: "/sponsors/E-SUMMIT'26 EVENTS-10 1.png", alt: "E-Summit Events" },
    { src: "/sponsors/EEBj409UYAAA6UC 1.png", alt: "Sponsor Logo" },
    { src: "/sponsors/EaseMyTrip_Logo 1.png", alt: "EaseMyTrip" },
    { src: "/sponsors/Groovenexus 1.png", alt: "Groovenexus" },
    { src: "/sponsors/Salts-Future of Wellness 1.png", alt: "Salts" },
    { src: "/sponsors/Samford Logo-06 1.png", alt: "Samford" },
    {
      src: "/sponsors/Screenshot 2026-02-08 at 5.15.40 PM 1.png",
      alt: "Sponsor Logo",
    },
    {
      src: "/sponsors/Screenshot 2026-02-08 at 5.16.03 PM 1.png",
      alt: "Sponsor Logo",
    },
    { src: "/sponsors/Waffle_Co 1.png", alt: "Waffle Co" },
    {
      src: "/sponsors/WhatsApp Image 2026-02-07 at 00.46.44 1.png",
      alt: "Sponsor Logo",
    },
    { src: "/sponsors/bmw 1.png", alt: "BMW" },
    { src: "/sponsors/brew_truck 1.png", alt: "Brew Truck" },
    { src: "/sponsors/cuku cafe 1.png", alt: "Cuku Cafe" },
    { src: "/sponsors/image 57.png", alt: "Sponsor Logo" },
    { src: "/sponsors/images-14 1.png", alt: "Sponsor Logo" },
    { src: "/sponsors/inext 1.png", alt: "Inext" },
    { src: "/sponsors/logo sy 4 1.png", alt: "Sponsor Logo" },
    { src: "/sponsors/titanium 1.png", alt: "Titanium" },
    { src: "/sponsors/unnamed (1) 1.png", alt: "Sponsor Logo" },
    { src: "/sponsors/weebes 1.png", alt: "Weebes" },
  ];

  return (
    <section id="sponsorship" className="w-full bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-14 pb-16 md:pt-18">
        {/* Current Sponsors */}
        <div className="mb-24">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 text-white/85">
            <span className="h-px w-10 bg-white/80" />
            <span className="text-xs font-semibold tracking-[0.22em] uppercase">
              Sponsorship 2026
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-5 text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight font-semibold">
            <AnimatedBlurText
              lines={["Meet our ", "current "]}
              liteText="sponsors"
            />
          </h2>

          {/* Logo Loop */}
          <div className="mt-10 relative overflow-hidden rounded-[36px] border border-white/10 bg-linear-to-b from-white/6 to-white/2 shadow-[0_24px_90px_rgba(0,0,0,0.75)]">
            <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-transparent opacity-60" />

            <div className="relative z-10 py-12 sm:py-16">
              <LogoLoop
                logos={currentSponsors}
                speed={40}
                logoHeight={100}
                gap={48}
                pauseOnHover
                scaleOnHover
                renderItem={(item) => {
                  if ("src" in item) {
                    return (
                      <div className="flex items-center justify-center h-24 px-6">
                        <Image
                          src={item.src}
                          alt={item.alt || "Sponsor"}
                          width={200}
                          height={100}
                          className="h-16 w-auto object-contain mix-blend-screen opacity-90 hover:opacity-100 transition-all duration-300"
                          style={{ filter: "brightness(1.2) contrast(1.1)" }}
                        />
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </div>
          </div>
        </div>

        {/* Past Sponsors */}
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-3 text-white/85">
            <span className="h-px w-10 bg-white/80" />
            <span className="text-xs font-semibold tracking-[0.22em] uppercase">
              Past Sponsors
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-5 text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight font-semibold">
            <AnimatedBlurText
              lines={["Trusted by industry ", "leaders "]}
              liteText="over the years"
            />
          </h2>

          {/* Grid */}
          <div className="mt-10 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((s, idx) => (
              <motion.div
                key={s.publicId + idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="
                  group relative overflow-hidden rounded-[28px] 
                  border border-white/10 
                  bg-linear-to-b from-white/6 to-white/2 
                  shadow-[0_24px_90px_rgba(0,0,0,0.75)] 
                  h-30 sm:h-32.5 md:h-35 
                  grid place-items-center 
                  transition-all duration-300 
                  ease-[cubic-bezier(0.22,1,0.36,1)] 
                  hover:-translate-y-0.5
                  px-6
                "
              >
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-transparent opacity-60" />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                  <CldImage
                    src={s.publicId}
                    alt="Sponsor Logo"
                    width={s.width}
                    height={s.height}
                    className="
                      max-w-30 max-h-15 sm:max-w-35 sm:max-h-17.5 md:max-w-45 md:max-h-20
                      w-full h-auto
                      object-contain 
                      grayscale invert contrast-[1.2] brightness-[1.5]
                      transition-all duration-500
                    "
                    sizes="(max-width: 640px) 120px, (max-width: 768px) 140px, 180px"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
