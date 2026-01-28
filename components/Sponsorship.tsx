// app/components/Sponsorship.tsx
"use client";

import React from "react";
import AnimatedBlurText from "./AnimatedBlurText";
import { cldImage as CldImage, IMAGES } from "@/lib/images";

export default function Sponsorship() {
  const sponsors = IMAGES.sponsors;

  return (
    <section id="sponsorship" className="w-full bg-black text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-14 pb-16 md:pt-18">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Sponsorship
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-5 text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight font-semibold">
          <AnimatedBlurText
            lines={["Meet our sponsors who help to", "bring "]}
            liteText="this thing live"
          />
        </h2>

        {/* Grid */}
        <div className="mt-10 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sponsors.map((s, idx) => (
            <div
              key={s.publicId + idx}
              className="
                group relative overflow-hidden rounded-[28px] 
                border border-white/10 
                bg-gradient-to-b from-white/[0.06] to-white/[0.02] 
                shadow-[0_24px_90px_rgba(0,0,0,0.75)] 
                h-[120px] sm:h-[130px] md:h-[140px] 
                grid place-items-center 
                transition-all duration-300 
                ease-[cubic-bezier(0.22,1,0.36,1)] 
                hover:-translate-y-[2px]
                px-6
              "
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-60" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />
              </div>

              <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                <CldImage
                  src={s.publicId}
                  alt="Sponsor Logo"
                  width={200}
                  height={100}
                  className="
                    max-w-[140px] max-h-[60px] md:max-w-[180px] md:max-h-[80px] 
                    object-contain 
                    grayscale invert contrast-[1.2] brightness-[1.5]
                    transition-all duration-500
                    group-hover:grayscale-0 group-hover:invert-0 group-hover:brightness-100 group-hover:contrast-100
                  "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
