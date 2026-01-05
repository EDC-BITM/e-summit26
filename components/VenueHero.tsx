"use client";

// import Silk from "@/components/Silk";
import GradientBlinds from "./GradientBlinds";
import { m, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function VenueHero() {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.6 });
  const silkActive = pathname === "/venue" && isInView;
  const silkDpr: [number, number] = prefersReducedMotion ? [1, 1] : [1, 1.25];
  const silkMaxFps = prefersReducedMotion ? undefined : 30;
  const silkFrameloop = prefersReducedMotion ? "demand" : "always";
  const title = "VENUE";
  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black text-white"
    >
      {/* Responsive height: 1/4 on mobile, 3/4 on desktop */}
      <div className="relative h-[25svh] md:h-[75svh] w-full">
        {/* Silk background */}
        <div className="absolute inset-0">
          <GradientBlinds
            gradientColors={["#8F00AF", "#8F00AF"]}
            angle={24}
            noise={0.25}
            blindCount={20}
            blindMinWidth={15}
            spotlightRadius={0.6}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.50}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
            className="w-full h-full"
          />
        </div>

        {/* Vignette + contrast overlays to match the screenshot feel */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-black/10 to-black/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_78%_55%,rgba(255,255,255,0.22),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_70%,rgba(176,94,194,0.35),transparent_65%)]" />

        {/* Title */}
        <div className="relative mx-auto h-full max-w-7xl px-6">
          {/* Use items-end and a tiny pb so baseline kisses the floor */}
          <div className="flex h-full items-end justify-center pb-0">
            <h1
              className={cn(
                "select-none",
                "font-sans",
                "font-extrabold",
                "lg:tracking-[-1.2rem] tracking-tighter",
                "text-white",
                // Responsive text size
                "text-[clamp(48px,14vw,205px)]",
                // Responsive line height
                "leading-[0.82] md:leading-[0.84]"
              )}
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-b from-transparent to-black" />
      </div>
    </section>
  );
}
