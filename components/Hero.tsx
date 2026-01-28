"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
// import Silk from "./Silk";
import GradientBlinds from "@/components/GradientBlinds";
// import LiquidEther from "@/components/LiquidEther";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import ShinyText from "./ShinyText";
import { cn } from "@/lib/utils";

// Extract animation variants
const CHAR_VARIANTS: Variants = {
  hidden: { opacity: 0, filter: "blur(5px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

const TRANSITION_CONFIG = {
  duration: 0.8,
  ease: [0.42, 0, 0.58, 1] as const,
};

export default function Hero() {
  const words = useMemo(
    () => ["Innovating", "Collaborating", "Creating", "Pitching", "Launching"],
    []
  );

  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const cycleWord = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIdx((p) => (p + 1) % words.length);
    }, 260);
  }, [words.length]);

  useEffect(() => {
    intervalRef.current = setInterval(cycleWord, 2200);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [cycleWord]);

  return (
    <section className="relative h-svh w-full overflow-hidden bg-black">
      {/* Background: GradientBlinds */}
      <div className="absolute inset-0">
        {/*
        <Silk speed={5} scale={1} color="#B05EC2" noiseIntensity={1.5} rotation={0} />
        */}

        {/*
        <LiquidEther
          colors={["#B05EC2", "#B05EC2", "#B05EC2"]}
          mouseForce={32}
          cursorSize={185}
          iterationsPoisson={41}
          autoSpeed={0.4}
          autoIntensity={2.2}
          resolution={0.5}
          className="w-full h-full"
        />
        */}

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

      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* Left BIG cube */}
      <Image
        width={200}
        height={200}
        priority={true}
        loading="eager"
        src="/Cube.png"
        alt=""
        draggable={false}
        className={[
          "pointer-events-none absolute z-0",
          "-left-20 sm:-left-32 md:-left-40 lg:-left-47.5",
          "top-[28%] sm:top-[20%] md:top-[12%] lg:top-[10%]",
          "w-40 sm:w-64 md:w-80 lg:w-77.5",
          "opacity-80 sm:opacity-95 mix-blend-screen",
          "motion-reduce:animate-none",
          "animate-[spin_24s_linear_infinite]",
        ].join(" ")}
        style={{ transform: "rotate(12deg)", willChange: "transform" }}
      />

      {/* Small cube near the title area */}
      <Image
        width={200}
        height={200}
        priority={true}
        loading="eager"
        src="/Cube.png"
        alt=""
        draggable={false}
        className={[
          "pointer-events-none absolute z-0",
          "right-[5%] sm:right-[8%] md:right-[15%] lg:right-[18%]",
          "top-[12%] sm:top-[16%] md:top-[20%]",
          "w-10 sm:w-16 md:w-20 lg:w-27",
          "opacity-90 sm:opacity-95 mix-blend-screen",
          "motion-reduce:animate-none",
          "animate-[spin_20s_linear_infinite]",
        ].join(" ")}
        style={{ transform: "rotate(-10deg)", willChange: "transform" }}
      />

      {/* Right triangle */}
      <Image
        width={200}
        height={200}
        priority={true}
        loading="eager"
        src="/Triangle.png"
        alt="Triangle"
        draggable={false}
        className={[
          "pointer-events-none absolute z-0",
          "right-[-15%] sm:right-[-12%] md:right-[-10%] lg:right-[-8%]",
          "top-[25%] sm:top-[22%] md:top-[28%] lg:top-[30%]",
          "w-40 sm:w-60 md:w-80 lg:w-56.25",
          "opacity-80 sm:opacity-95 mix-blend-screen",
          "motion-reduce:animate-none",
          "animate-[spin_24s_linear_infinite]",
        ].join(" ")}
        style={{ animationDirection: "reverse", willChange: "transform" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
        <h1 className="sr-only">
          E-Summit 2026 — BIT Mesra&apos;s Premier Entrepreneurship Festival by
          EDC
        </h1>

        <div className="motion-reduce:animate-none animate-in fade-in zoom-in-95 duration-700 ease-out">
          <Image
            width={980}
            height={200}
            priority={true}
            loading="eager"
            src="/Esum26new.png"
            alt="E-Summit 2026"
            draggable={false}
            className={[
              "w-[min(92vw,980px)] h-auto select-none",
              "drop-shadow-[0_40px_120px_rgba(0,0,0,0.55)]",
            ].join(" ")}
          />
        </div>

        {/* Subtitle with animated word */}
        <div
          className={cn(
            "mt-6 sm:mt-8",
            "text-[18px] sm:text-[28px] md:text-[36px]",
            "text-white/90",
            "tracking-tight md:translate-x-8",
            "flex flex-col md:block items-center"
          )}
        >
          <span className="font-medium">Fuel your startup journey by:</span>{" "}
          <span className="inline-flex justify-center md:justify-start align-baseline">
            <span
              className="inline-block text-center md:text-start w-auto md:w-60 font-semibold text-white"
              aria-live="polite"
              style={{ willChange: "contents" }}
            >
              {words[idx].split("").map((char, i) => (
                <motion.span
                  key={`${idx}-${i}`}
                  variants={CHAR_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    ...TRANSITION_CONFIG,
                    delay: i * 0.08,
                  }}
                  className="inline-block"
                  style={{ willChange: "opacity, filter" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </span>
        </div>
                {/* CTA: Brochure */}
        <motion.a
          href="https://drive.google.com/file/d/1tAyP54AZ7kAP2nzXBC7kaNFcJH2hTd_l/view"
          target="_blank"
          rel="noreferrer"
          aria-label="E-Summit 2026 brochure"
          className={cn(
            "mt-7 inline-flex w-full sm:w-auto items-center justify-center",
            "relative group overflow-hidden rounded-full",
            "p-[1px]",
            "bg-gradient-to-r from-[#8F00AF]/70 via-white/15 to-[#B05EC2]/70",
            "shadow-[0_28px_120px_rgba(0,0,0,0.75)]",
            "motion-reduce:animate-none animate-in fade-in zoom-in-95 duration-700 ease-out"
          )}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* glow */}
          <span className="pointer-events-none absolute -inset-6 rounded-full bg-gradient-to-r from-[#8F00AF]/55 via-white/5 to-[#B05EC2]/55 blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

          {/* button surface */}
          <span
            className={cn(
              "relative inline-flex w-full sm:w-auto items-center justify-center rounded-full",
              "bg-black/35 backdrop-blur-xl",
              "ring-1 ring-white/15",
              "px-7 sm:px-9 py-3.5",
              "transition-colors duration-300 group-hover:bg-black/25",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            )}
          >
            <ShinyText
              text="Get the ’26 Brochure"
              className="text-sm sm:text-base font-semibold tracking-tight text-center"
              disabled={false}
              speed={3}
            />
          </span>
        </motion.a>

      </div>

      {/* Bottom dates */}
      <div className="pointer-events-none absolute bottom-6 sm:bottom-6 left-0 right-0 z-10">
        <div className="w-full px-6 sm:px-10 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-[max-content_1fr_max-content_1fr_max-content] items-center gap-2 sm:gap-4 md:gap-6">
            <ShinyText
              text="13th February 2026"
              className="text-sm sm:text-base md:text-lg lg:text-xl font-normal justify-self-center text-center py-1"
              disabled={false}
              speed={3}
            />

            <div className="hidden sm:block h-px w-full bg-white/20" />
            <ShinyText
              text="14th February 2026"
              className="text-sm sm:text-base md:text-lg lg:text-xl font-normal justify-self-center text-center py-1 border-y border-white/10 sm:border-0"
              disabled={false}
              speed={3}
            />

            <div className="hidden sm:block h-px w-full bg-white/20" />

            <ShinyText
              text="15th February 2026"
              className="text-sm sm:text-base md:text-lg lg:text-xl font-normal justify-self-center text-center py-1"
              disabled={false}
              speed={3}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dateGlowPulse {
          0%,
          100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.85),
              0 0 24px rgba(255, 255, 255, 0.55),
              0 0 52px rgba(176, 94, 194, 0.35);
            filter: brightness(1);
          }
          50% {
            text-shadow: 0 0 14px rgba(255, 255, 255, 0.95),
              0 0 34px rgba(255, 255, 255, 0.75),
              0 0 72px rgba(176, 94, 194, 0.45);
            filter: brightness(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dateGlow {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
