"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Banknote, Armchair, Code2 } from "lucide-react";
import Image from "next/image";

function Marquee({ className = "" }) {
  const text = "Innovation. Networking. Brainstorming. Learning";
  return (
    <div className={`relative mt-16 overflow-hidden py-6 ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-black to-transparent" />

      <div className="marquee-track">
        <div className="marquee-row">
          <span className="marquee-text">{text}</span>
          <span className="marquee-text">{text}</span>
        </div>
      </div>

      <style jsx global>{`
        .marquee-track {
          width: 100%;
          overflow: hidden;
        }
        .marquee-row {
          display: inline-flex;
          white-space: nowrap;
          will-change: transform;
          animation: marquee 18s linear infinite;
        }
        .marquee-text {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI,
            Roboto, Helvetica, Arial;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          font-size: clamp(48px, 7vw, 102px);
          letter-spacing: -0.04em;
          line-height: 1.3;
          padding-right: 56px;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-row {
            animation: none;
          }
        }

        @keyframes cubeSpinInPlace {
          from {
            transform: translate(-50%, -50%) rotate(18deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(378deg);
          }
        }
      `}</style>
    </div>
  );
}

interface AudienceCardProps {
  item: {
    key: string;
    label: string;
    icon: React.ComponentType<{
      size?: number;
      strokeWidth?: number;
      className?: string;
      fill?: string;
    }>;
    desc: string;
  };
  active: boolean;
  onClick: () => void;
  delayMs?: number;
}

function AudienceCard({
  item,
  active,
  onClick,
  delayMs = 0,
}: AudienceCardProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative isolate aspect-square w-full",
        "will-change-[border-radius,transform]",
        "transition-[border-radius,transform,opacity,box-shadow,border-color] duration-320 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active ? "rounded-full" : "rounded-[36px]",
        "border",
        active ? "border-[rgba(176,94,194,0.78)]" : "border-white/10",
        "bg-black/40",
        "backdrop-blur-xl",
        "overflow-hidden",
      ].join(" ")}
      style={{ transitionDelay: `${delayMs}ms` }}
      aria-pressed={active}
    >
      {/* Rotating cube background (only when active) */}
      {active && (
        <>
          <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
            {/* centered, in-place rotation (no drifting) */}
            <Image
              width={200}
              height={200}
              src="/Cube.png"
              alt=""
              draggable={false}
              className="absolute left-1/2 top-1/2 w-[140%] opacity-[0.15] blur-[0.5px] mix-blend-screen"
              style={{
                transformOrigin: "center",
                animation: "cubeSpinInPlace 46s linear infinite",
              }}
            />

            {/* lighter overlay so cube remains visible */}
            <div className="absolute inset-0 bg-linear-to-b from-[rgba(176,94,194,0.18)] via-transparent to-black/35" />
          </div>

          {/* purple ring + glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow:
                "0 0 0 1px rgba(176,94,194,0.55), 0 0 34px rgba(176,94,194,0.22)",
            }}
          />
        </>
      )}

      {/* content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3">
        <Icon
          size={34}
          strokeWidth={1.6}
          className={[
            "transition-colors duration-200",
            active ? "text-white" : "text-white/35",
          ].join(" ")}
          fill={active ? "currentColor" : "none"}
        />
        <div
          className={[
            "text-sm sm:text-base font-medium",
            "font-['Inter',ui-sans-serif,system-ui]",
            active ? "text-white" : "text-white/45",
          ].join(" ")}
        >
          {item.label}
        </div>
      </div>
    </button>
  );
}

export default function ForWhomSection() {
  const items = useMemo(
    () => [
      {
        key: "biz",
        label: "Business Professionals",
        icon: BriefcaseBusiness,
        desc: "Explore emerging opportunities, expand your network, and discover innovative solutions that can redefine how you lead and grow your organization.",
      },
      {
        key: "investors",
        label: "Investors",
        icon: Banknote,
        desc: "Meet high-potential student founders, evaluate early-stage ideas, and gain first access to the next wave of disruptive startups.",
      },
      {
        key: "founders",
        label: "Founder",
        icon: Armchair,
        desc: "Validate your idea, meet mentors, find collaborators, and learn what it takes to build and scale in the real startup ecosystem.",
      },
      {
        key: "devs",
        label: "Developers",
        icon: Code2,
        desc: "Build, ship, and showcase. Connect with founders, explore real problems, and discover opportunities to contribute to high-impact products.",
      },
    ],
    []
  );

  const [activeKey, setActiveKey] = useState(items[0].key);
  const active = items.find((x) => x.key === activeKey) || items[0];

  return (
    <section id="forwhom" className="w-full bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-10 md:pt-24 md:pb-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            For Whom?
          </span>
        </div>

        {/* Heading */}
        <h2
          className="
            mt-6
            text-4xl sm:text-5xl md:text-6xl
            font-semibold tracking-tight
            font-['Inter',ui-sans-serif,system-ui]
          "
        >
          <span className="block">Who Should Definitely Attend the</span>
          <span className="block text-white/30">E-Summit&apos;26</span>
        </h2>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {items.map((it, i) => (
            <AudienceCard
              key={it.key}
              item={it}
              active={activeKey === it.key}
              onClick={() => setActiveKey(it.key)}
              delayMs={80 + i * 70}
            />
          ))}
        </div>

        {/* Description bar */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-['Inter',ui-sans-serif,system-ui]">
            {active.desc}
          </p>
        </div>

        {/* Continuous slider */}
        <Marquee className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" />
      </div>
    </section>
  );
}
