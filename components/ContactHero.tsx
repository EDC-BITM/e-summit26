"use client";

import Silk from "@/components/Silk";
import { m } from "framer-motion";

export default function ContactHero() {
  const title = "CONTACT";
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
                "tracking-[-1.2rem]",
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
              {title.split("").map((char, index) => (
                <m.span
                  aria-hidden="true"
                  key={index}
                  initial={{ opacity: 0, scale: 1.3, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  style={{
                    display: "inline-block",
                    willChange: "transform, opacity",
                  }}
                >
                  {char}
                </m.span>
              ))}
            </h1>
          </div>
        </div>

        {/* Hard bottom edge like screenshot (subtle) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-black" />
      </div>
    </section>
  );
}
