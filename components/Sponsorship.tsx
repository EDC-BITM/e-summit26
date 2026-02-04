"use client";

import AnimatedBlurText from "./AnimatedBlurText";
import { CldImage } from "next-cloudinary";
import { IMAGES } from "@/lib/images";
import { motion } from "framer-motion";

export default function Sponsorship() {
  const sponsors = IMAGES.sponsors;

  return (
    <section id="sponsorship" className="w-full bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-14 pb-16 md:pt-18">
        {/* Current Sponsors - Revealing Soon */}
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
              lines={["Our sponsors will be ", "revealed "]}
              liteText="very soon"
            />
          </h2>

          {/* Revealing Soon Section */}
          <div className="mt-10 relative overflow-hidden rounded-[36px] border border-white/10 bg-linear-to-b from-white/6 to-white/2 shadow-[0_24px_90px_rgba(0,0,0,0.75)]">
            <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-transparent opacity-60" />

            {/* Animated gradient orbs */}
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#733080]/20 rounded-full blur-[120px] animate-pulse" />
            <div
              className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#B05EC2]/20 rounded-full blur-[120px] animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            <div className="relative z-10 flex flex-col items-center justify-center py-24 px-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-[#733080] via-[#B05EC2] to-[#733080] bg-clip-text text-transparent">
                  Revealing Soon
                </span>
              </motion.div>

              <p className="text-white/60 text-center text-base sm:text-lg max-w-2xl">
                We&apos;re partnering with incredible brands and organizations.
                Stay tuned for the big reveal!
              </p>

              <div className="mt-8 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#733080] animate-pulse" />
                <div
                  className="h-2 w-2 rounded-full bg-[#B05EC2] animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                />
                <div
                  className="h-2 w-2 rounded-full bg-[#733080] animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                />
              </div>
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
