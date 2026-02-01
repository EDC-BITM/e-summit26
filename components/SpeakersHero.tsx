"use client";

import GradientBlinds from "./GradientBlinds";
import AnimatedBlurText from "@/components/AnimatedBlurText";
import { cn } from "@/lib/utils";
import { m, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export default function SpeakersHero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const title = "SPEAKERS";

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = (index: number) => {
    return {
      hidden: { opacity: 0, y: 100, filter: "blur(10px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration: 0.45,
          delay: index * 0.1,
          ease: [0, 0, 1, 1] as [number, number, number, number],
        },
      },
    };
  };
  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black text-white"
    >
      {/* Responsive height: 1/4 on mobile, 3/4 on desktop */}
      <div className="relative h-svh w-full">
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
            mouseDampening={0.5}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
            className="w-full h-full"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-black/10 to-black/80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_78%_55%,rgba(255,255,255,0.22),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_70%,rgba(176,94,194,0.35),transparent_65%)]" />

        {/* Title */}
        <div className="relative mx-auto h-full max-w-7xl px-6">
          {/* Use items-end and a tiny pb so baseline kisses the floor */}
          <div className="flex h-full flex-col items-center justify-end pb-4 md:pb-6 gap-3">
            {/* Animated subheading */}
            <AnimatedBlurText
              lines={["MEET THE "]}
              liteText="VISIONARY"
              className="
    text-center
    font-extrabold
    tracking-[-0.04em]
    text-white
    text-[clamp(28px,6vw,96px)]
    leading-[0.95]
  "
            />

            {/* Main title */}
            <m.h1
              className={cn(
                "select-none",
                "font-sans",
                "font-extrabold",
                "tracking-[-0.06em]",
                "text-white",
                "text-[clamp(48px,14vw,205px)]",
                "leading-[0.82] md:leading-[0.84]",
                "translate-y-1 md:translate-y-1.5",
              )}
              style={{
                textShadow:
                  "0 0 34px rgba(255,255,255,0.12), 0 0 90px rgba(176,94,194,0.12)",
                willChange: prefersReducedMotion
                  ? undefined
                  : "transform, opacity",
              }}
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={
                prefersReducedMotion ? undefined : { once: true, amount: 0.8 }
              }
              variants={prefersReducedMotion ? undefined : containerVariants}
            >
              {title.split("").map((char, index) => (
                <m.span
                  key={index}
                  aria-hidden="true"
                  variants={
                    prefersReducedMotion ? undefined : letterVariants(index)
                  }
                  style={{ display: "inline-block" }}
                >
                  {char}
                </m.span>
              ))}
              <span className="sr-only">{title}</span>
            </m.h1>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-b from-transparent to-black" />
      </div>
    </section>
  );
}
