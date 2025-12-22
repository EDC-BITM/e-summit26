"use client";

import React from "react";
import Silk from "@/components/Silk";

export default function ContactHero() {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      {/* Responsive height: 1/4 on mobile, 3/4 on desktop */}
      <div className="relative h-[25svh] md:h-[75svh] w-full">
        {/* Silk background */}
        <div className="absolute inset-0">
          <Silk
            speed={5}
            scale={1}
            color="#7d2da3"
            noiseIntensity={1.35}
            rotation={0.12}
          />
        </div>

        {/* Vignette + contrast overlays to match the screenshot feel */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_78%_55%,rgba(255,255,255,0.22),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_70%,rgba(176,94,194,0.35),transparent_65%)]" />

        {/* Title */}
        <div className="relative mx-auto h-full max-w-7xl px-6">
          {/* Use items-end and a tiny pb so baseline kisses the floor */}
          <div className="flex h-full items-end justify-center pb-0">
            <h1
              className={[
                "select-none",
                "font-['Inter',ui-sans-serif,system-ui]",
                "font-extrabold",
                "tracking-[-0.06em]",
                "text-white",
                // Responsive text size
                "text-[clamp(48px,14vw,205px)]",
                // Responsive line height
                "leading-[0.82] md:leading-[0.84]",
              ].join(" ")}
              style={{
                textShadow:
                  "0 0 34px rgba(255,255,255,0.12), 0 0 90px rgba(176,94,194,0.12)",
                // Responsive transform for mobile
                transform: "translateY(4px) md:translateY(6px)",
              }}
            >
              CONTACT
            </h1>
          </div>
        </div>

        {/* Hard bottom edge like screenshot (subtle) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-black" />
      </div>
    </section>
  );
}