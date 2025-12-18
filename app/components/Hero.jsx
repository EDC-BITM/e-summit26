"use client";

import { useEffect, useMemo, useState } from "react";
import Silk from "./Silk";

export default function Hero() {
    const words = useMemo(
        () => ["Innovating", "Collaborating", "Creating", "Pitching", "Launching"],
        []
    );

    const [idx, setIdx] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let t;
        const interval = setInterval(() => {
            setVisible(false);
            clearTimeout(t);
            t = setTimeout(() => {
                setIdx((p) => (p + 1) % words.length);
                setVisible(true);
            }, 260);
        }, 2200);

        return () => {
            clearInterval(interval);
            clearTimeout(t);
        };
    }, [words.length]);

    return (
        <section className="relative h-[100svh] w-full overflow-hidden bg-black">
            {/* Silk background (your perfect bg stays) */}
            <div className="absolute inset-0">
                <Silk
                    speed={5}
                    scale={1}
                    color="#B05EC2"
                    noiseIntensity={1.5}
                    rotation={0}
                />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-black/30" />

            {/* Left BIG cube (like reference) */}
            <img
                src="/Cube.png"
                alt=""
                draggable={false}
                className="
          pointer-events-none absolute z-0
          left-[-140px] sm:left-[-170px] md:left-[-190px]
          top-[22%] sm:top-[20%] md:top-[10%]
          w-[260px] sm:w-[320px] md:w-[400px] lg:w-[310px]
          opacity-95 mix-blend-screen
          motion-reduce:animate-none
          animate-[spin_24s_linear_infinite]
        "
                style={{ transform: "rotate(12deg)" }}
            />

            {/* Small cube near the title area (2nd cube) */}
            <img
                src="/Cube.png"
                alt=""
                draggable={false}
                className="
          pointer-events-none absolute z-0
          right-[30%] sm:right-[28%] md:right-[18%]
          top-[18%] sm:top-[18%] md:top-[20%]
          w-[64px] sm:w-[78px] md:w-[92px] lg:w-[108px]
          opacity-95 mix-blend-screen
          motion-reduce:animate-none
          animate-[spin_20s_linear_infinite]
        "
                style={{ transform: "rotate(-10deg)" }}
            />

            {/* Right triangle (single) */}
            <img
                src="/triangle.png"
                alt=""
                draggable={false}
                className="
          pointer-events-none absolute z-0
          right-[-10%] sm:right-[-9%] md:right-[-8%]
          top-[24%] sm:top-[24%] md:top-[30%]
          w-[240px] sm:w-[300px] md:w-[370px] lg:w-[225px]
          opacity-95 mix-blend-screen
          motion-reduce:animate-none
          animate-[spin_24s_linear_infinite]
        "
                style={{ animationDirection: "reverse" }}
            />

            {/* Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 text-center">
                {/* Center logo pop-in */}
                <div className="motion-reduce:animate-none animate-in fade-in zoom-in-95 duration-700 ease-out">
                    <img
                        src="/esummit_logo.png"
                        alt="E-Summit 2026"
                        draggable={false}
                        className="
              w-[min(92vw,980px)] h-auto select-none
              drop-shadow-[0_40px_120px_rgba(0,0,0,0.55)]
            "
                    />
                </div>

                {/* Subtitle with animated word (static part will NOT shift) */}
                <div
                    className="
    mt-8
    translate-x-[10%]
    text-[22px] sm:text-[28px] md:text-[36px]
    text-white/90
    tracking-tight
    font-['Inter',ui-sans-serif,system-ui]
  "
                >

                    <span className="font-medium">Fuel your startup journey by:</span>{" "}
                    {/* fixed slot so the left text doesn't move */}
                    <span className="inline-flex w-[13ch] justify-start align-baseline">
                        <span
                            className={[
                                "inline-block font-semibold text-white",
                                "transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                "motion-reduce:transition-none",
                                visible
                                    ? "opacity-100 translate-y-0 blur-0"
                                    : "opacity-0 -translate-y-1 blur-[2px]",
                            ].join(" ")}
                            aria-live="polite"
                        >
                            {words[idx]}
                        </span>
                    </span>
                </div>
            </div>

            {/* Bottom dates (left / center / right) */}
            <div className="pointer-events-none absolute bottom-5 left-0 right-0 z-10">
                <div className="mx-auto max-w-6xl px-6">
                    <div
                        className="
              grid items-center gap-3
              text-white/90
              text-sm sm:text-base md:text-lg
              sm:grid-cols-[auto_1fr_auto_1fr_auto]
            "
                    >
                        <div className="dateGlow justify-self-center sm:justify-self-start font-semibold text-white">
                            30th January 2026
                        </div>



                        <div className="hidden sm:block h-px w-full bg-white/25" />

                        <div className="dateGlow justify-self-center font-semibold text-white">
                            31st January 2026
                        </div>



                        <div className="hidden sm:block h-px w-full bg-white/25" />

                        <div className="dateGlow justify-self-center sm:justify-self-end font-semibold text-white">
                            1st February 2026
                        </div>


                    </div>
                </div>
            </div>
            <style jsx global>{`
  @keyframes dateGlowPulse {
    0%, 100% {
      text-shadow:
        0 0 10px rgba(255,255,255,0.85),
        0 0 24px rgba(255,255,255,0.55),
        0 0 52px rgba(176,94,194,0.35);
      filter: brightness(1);
    }
    50% {
      text-shadow:
        0 0 14px rgba(255,255,255,0.95),
        0 0 34px rgba(255,255,255,0.75),
        0 0 72px rgba(176,94,194,0.45);
      filter: brightness(1.08);
    }
  }

  .dateGlow {
    animation: dateGlowPulse 3.6s ease-in-out infinite;
    will-change: filter;
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
