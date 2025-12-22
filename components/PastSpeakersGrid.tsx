// app/speakers/components/PastSpeakersGrid.tsx
"use client";

import React, { useMemo } from "react";
import { Instagram, Linkedin } from "lucide-react";
import AnimatedBlurText from "@/components/AnimatedBlurText";

type Speaker = {
  name: string;
  title: string;
  img: string;
  instagramHref?: string;
  linkedinHref?: string;
};

function SocialBadge({
  href = "#",
  label,
  children,
}: {
  href?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className={[
        "grid place-items-center",
        "h-10 w-10 rounded-xl",
        "bg-white/90 text-black",
        "shadow-[0_10px_28px_rgba(0,0,0,0.35)]",
        "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:scale-[1.04] active:scale-[0.98]",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

export default function PastSpeakersGrid() {
  const speakers = useMemo<Speaker[]>(
    () => [
      {
        name: "Aditi Kulkarni",
        title: "Founder, Product Studio",
        img: "https://images.unsplash.com/photo-1544005313-9a0033c0c676?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Rohan Verma",
        title: "Engineering Manager",
        img: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Ananya Bose",
        title: "Data Scientist",
        img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Karan Malhotra",
        title: "Security Architect",
        img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Neha Sharma",
        title: "UX Lead",
        img: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Arjun Nair",
        title: "Cloud Platform Engineer",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Meera Iyer",
        title: "AI Researcher",
        img: "https://images.unsplash.com/photo-1524503033411-fbc2b48881d9?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Siddharth Jain",
        title: "Growth & Partnerships",
        img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    []
  );

  // duplicate for seamless loop
  const loop = useMemo(() => [...speakers, ...speakers], [speakers]);

  // Professional speed: longer duration = slower, smoother
  // tweak this one value if needed
  const durationSec = 34;

  return (
    <section className="relative w-full bg-black text-white overflow-hidden">
      {/* subtle depth */}
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(70%_70%_at_50%_20%,rgba(255,255,255,0.06),transparent_55%)]" />

      {/* Header stays constrained */}
      <div className="mx-auto max-w-7xl px-6 pt-16 md:pt-20">
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Past Speakers
          </span>
        </div>

        <h2
          className="
            mt-6
            font-['Inter',ui-sans-serif,system-ui]
            text-4xl sm:text-5xl md:text-6xl
            leading-[1.05]
            tracking-tight
            font-medium
          "
        >
          <AnimatedBlurText
            lines={["Highlights From Previous Editions", "and "]}
            liteText="Notable Voices"
          />
        </h2>
      </div>

      {/* Full-bleed carousel (edge-to-edge) */}
      <div className="mt-12">
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          {/* Edge fades (looks premium, still full width) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />

          <div className="overflow-hidden">
            <div
              className="es26-marquee-track flex w-max items-stretch gap-10 py-2"
              style={{ ["--es26-duration" as any]: `${durationSec}s` }}
            >
              {loop.map((sp, idx) => (
                <div
                  key={`${sp.name}-${idx}`}
                  className="min-w-0 shrink-0"
                  style={{
                    width: "min(320px, 78vw)",
                  }}
                >
                  <div
                    className={[
                      "group relative overflow-hidden rounded-[28px]",
                      "bg-white/[0.03] ring-1 ring-white/10",
                      "shadow-[0_28px_110px_rgba(0,0,0,0.75)]",
                    ].join(" ")}
                  >
                    <div className="relative w-full aspect-[4/5]">
                      <img
                        src={sp.img}
                        alt={sp.name}
                        draggable={false}
                        className={[
                          "h-full w-full object-cover",
                          "grayscale",
                          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          "group-hover:grayscale-0 group-hover:saturate-[1.06]",
                        ].join(" ")}
                      />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <SocialBadge href={sp.instagramHref ?? "#"} label="Instagram">
                          <Instagram size={18} />
                        </SocialBadge>
                        <SocialBadge href={sp.linkedinHref ?? "#"} label="LinkedIn">
                          <Linkedin size={18} />
                        </SocialBadge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-base font-semibold tracking-tight text-white">
                      {sp.name}
                    </div>
                    <div className="mt-1 text-sm text-white/55">{sp.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacer so it doesn't feel cramped at bottom */}
          <div className="h-16" />
        </div>
      </div>

      {/* Plain CSS (NOT styled-jsx) */}
      <style>{`
        @keyframes es26-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .es26-marquee-track {
          animation: es26-marquee var(--es26-duration, 34s) linear infinite;
          will-change: transform;
        }

        /* Pause on hover (nice, professional) */
        .es26-marquee-track:hover {
          animation-play-state: paused;
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .es26-marquee-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
