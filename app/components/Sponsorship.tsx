// app/components/Sponsorship.tsx
"use client";

import React, { useMemo } from "react";

type Sponsor = {
  name: string;
  logoText: string;
  variant?: "infinity" | "wordmark" | "stack" | "mono";
};

function DummyLogo({ s }: { s: Sponsor }) {
  // Simple, consistent “dummy logo” system (no external assets needed)
  // Blue tone similar to the screenshot.
  const BLUE = "#1F55FF";

  if (s.variant === "infinity") {
    return (
      <svg
        viewBox="0 0 220 70"
        className="h-10 w-auto"
        fill="none"
        aria-label={s.name}
      >
        <path
          d="M32 35c16-18 30-18 46 0 16 18 30 18 46 0 16-18 30-18 46 0"
          stroke={BLUE}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M32 35c16 18 30 18 46 0 16-18 30-18 46 0 16 18 30 18 46 0"
          stroke={BLUE}
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    );
  }

  if (s.variant === "stack") {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#1F55FF] opacity-90" />
        <div className="leading-none">
          <div className="text-[18px] font-semibold tracking-tight text-[#1F55FF]">
            {s.logoText}
          </div>
          <div className="text-[12px] font-semibold tracking-tight text-[#1F55FF] opacity-80">
            {s.logoText.toLowerCase()}
          </div>
        </div>
      </div>
    );
  }

  if (s.variant === "mono") {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-10 rounded-md border-2 border-[#1F55FF] opacity-90" />
        <div className="text-[20px] font-semibold tracking-tight text-[#1F55FF] opacity-95">
          {s.logoText}
        </div>
      </div>
    );
  }

  // default: wordmark
  return (
    <div
      className="text-[28px] font-semibold tracking-tight text-[#1F55FF] opacity-95"
      aria-label={s.name}
    >
      {s.logoText}
    </div>
  );
}

export default function Sponsorship() {
  const sponsors = useMemo<Sponsor[]>(
    () => [
      { name: "Infinity Labs", logoText: "∞∞∞", variant: "infinity" },
      { name: "LOGO", logoText: "LOGO", variant: "mono" },
      { name: "LOOO", logoText: "LOOO", variant: "wordmark" },
      { name: "LOGOIpsum", logoText: "LOGO IPSUM", variant: "stack" },
      { name: "U9II", logoText: "U9II", variant: "mono" },
      { name: "logo°", logoText: "logo°", variant: "wordmark" },
      { name: "IPSUM", logoText: "IPSUM", variant: "wordmark" },
      { name: "logoipsum", logoText: "logoipsum", variant: "stack" },
    ],
    []
  );

  return (
    <section id="sponsorship" className="w-full bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-16 md:pt-20 md:pb-20">
        {/* Eyebrow (consistent with other sections) */}
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Sponsorship
          </span>
        </div>

        {/* Heading */}
        <h2
          className="
            mt-6
            font-['Inter',ui-sans-serif,system-ui]
            text-4xl sm:text-5xl md:text-6xl
            leading-[1.06]
            tracking-tight
            font-semibold
          "
        >
          <span className="block">Meet out sponsors who help to</span>
          <span className="block">
            bring <span className="text-white/30">this think live</span>
          </span>
        </h2>

        {/* Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sponsors.map((s) => (
            <div
              key={s.name}
              className={[
                "group relative overflow-hidden",
                "rounded-[28px] border border-white/10",
                "bg-gradient-to-b from-white/[0.06] to-white/[0.02]",
                "shadow-[0_24px_90px_rgba(0,0,0,0.75)]",
                "h-[120px] sm:h-[130px] md:h-[140px]",
                "grid place-items-center",
                "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:translate-y-[-2px]",
              ].join(" ")}
            >
              {/* subtle inner highlight */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-60" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(31,85,255,0.12),transparent_70%)]" />
              </div>

              <div className="relative z-10 flex items-center justify-center">
                <DummyLogo s={s} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
