"use client";

import { useMemo, useState, useCallback } from "react";
import { BriefcaseBusiness, Banknote, Armchair, Code2 } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import AnimatedBlurText from "./AnimatedBlurText";

// Animation variants and Marquee component remains untouched...
const CARD_VARIANTS: Variants = {
  inactive: {
  borderRadius: "36px",
  borderColor: "rgba(255,255,255,0.18)",
  borderWidth: "1px",
  backgroundColor: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(14px) saturate(140%)",
  
  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
},
  active: { borderRadius: "9999px", borderColor: "rgba(176,94,194,0.78)" },
};

const ICON_VARIANTS: Variants = {
  inactive: { color: "rgba(255, 255, 255, 0.35)" },
  active: { color: "rgb(255, 255, 255)" },
};

const LABEL_VARIANTS: Variants = {
  inactive: { color: "rgba(255, 255, 255, 0.45)" },
  active: { color: "rgb(255, 255, 255)" },
};

const CUBE_VARIANTS: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const DESC_VARIANTS: Variants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

const TRANSITION_CONFIG = {
  card: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  icon: { duration: 0.3 },
  cube: { duration: 0.4 },
  desc: { duration: 0.4 },
};

function Marquee({ className = "" }) {
  const text = "Innovation. Networking. Brainstorming. Learning.";
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
        .marquee-track { width: 100%; overflow: hidden; }
        .marquee-row { display: inline-flex; white-space: nowrap; will-change: transform; animation: marquee 18s linear infinite; }
        .marquee-text { font-family: var(--font-google-sans), sans-serif; font-weight: 600; color: rgba(255, 255, 255, 0.9); font-size: clamp(48px, 7vw, 102px); letter-spacing: -0.04em; line-height: 1.3; padding-right: 56px; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .marquee-row { animation: none; } }
        @keyframes cubeSpinInPlace { from { transform: translate(-50%, -50%) rotate(18deg); } to { transform: translate(-50%, -50%) rotate(378deg); } }
      `}</style>
    </div>
  );
}

interface AudienceCardProps {
  item: { key: string; label: string; icon: any; desc: string; };
  active: boolean;
  onClick: () => void;
}

function AudienceCard({ item, active, onClick }: AudienceCardProps) {
  const Icon = item.icon;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={CARD_VARIANTS}
      animate={active ? "active" : "inactive"}
      transition={TRANSITION_CONFIG.card}
      className={cn(
        "relative isolate aspect-square w-full cursor-pointer p-6",
        "will-change-[border-radius,transform]",
        "border bg-black/60 backdrop-blur-xl overflow-hidden"
      )}
      aria-pressed={active}
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div variants={CUBE_VARIANTS} initial="hidden" animate="visible" exit="hidden" transition={TRANSITION_CONFIG.cube}>
            <div className="pointer-events-none absolute inset-0 rounded-full overflow-hidden">
              <Image width={200} height={200} src="/Cube.png" alt="Cube" className="absolute left-1/2 top-1/2 w-[140%] opacity-[0.15] blur-[0.5px] mix-blend-screen" style={{ transformOrigin: "center", animation: "cubeSpinInPlace 46s linear infinite" }} />
              <div className="absolute inset-0 bg-linear-to-b from-[rgba(176,94,194,0.18)] via-transparent to-black/35" />
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 1px rgba(176,94,194,0.55), 0 0 34px rgba(176,94,194,0.22)" }} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3">
        <motion.div variants={ICON_VARIANTS} animate={active ? "active" : "inactive"} transition={TRANSITION_CONFIG.icon}>
          <Icon size={34} strokeWidth={1.6} fill={active ? "currentColor" : "none"} />
        </motion.div>
        <motion.div variants={LABEL_VARIANTS} animate={active ? "active" : "inactive"} transition={TRANSITION_CONFIG.icon} className="text-sm sm:text-base font-medium font-sans">
          {item.label}
        </motion.div>
      </div>
    </motion.button>
  );
}

export default function ForWhomSection() {
  const items = useMemo(() => [
    { key: "biz", label: "Business Professionals", icon: BriefcaseBusiness, desc: "Explore emerging opportunities, expand your network, and discover innovative solutions that can redefine how you lead and grow your organization." },
    { key: "investors", label: "Investors", icon: Banknote, desc: "Meet high-potential student founders, evaluate early-stage ideas, and gain first access to the next wave of disruptive startups." },
    { key: "founders", label: "Founder", icon: Armchair, desc: "Validate your idea, meet mentors, find collaborators, and learn what it takes to build and scale in the real startup ecosystem." },
    { key: "devs", label: "Developers", icon: Code2, desc: "Build, ship, and showcase. Connect with founders, explore real problems, and discover opportunities to contribute to high-impact products." },
  ], []);

  const [activeKey, setActiveKey] = useState(items[0].key);
  const active = useMemo(() => items.find((x) => x.key === activeKey) || items[0], [items, activeKey]);
  const handleCardClick = useCallback((key: string) => setActiveKey(key), []);

  return (
    <section id="forwhom" className="w-full bg-black text-white overflow-x-hidden">
      {/* 1. Added very small responsive horizontal padding for a professional "near-edge" look */}
      <div className="w-full px-4 sm:px-6 md:px-10 pt-20 pb-10 md:pt-24 md:pb-8">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            For Whom?
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight font-sans">
          <AnimatedBlurText
            lines={["Who Should Definitely Attend the", " "]}
            liteText="E-Summit'26"
          />
        </h2>

        {/* 2. Increased card spacing (gap) to look professional as per reference */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {items.map((it) => (
            <AudienceCard
              key={it.key}
              item={it}
              active={activeKey === it.key}
              onClick={() => handleCardClick(it.key)}
            />
          ))}
        </div>

        {/* 3. Description box: width now matches exactly from start of Card 1 to end of Card 4 */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/3 px-6 py-8 sm:px-8">
          <div className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-sans">
            <motion.p 
              key={active.key} 
              variants={DESC_VARIANTS} 
              initial="hidden" 
              animate="visible"
              transition={TRANSITION_CONFIG.desc}
            >
              {active.desc}
            </motion.p>
          </div>
        </div>

        {/* Slider - Maintained its edge-to-edge bleed behavior */}
        <Marquee className="relative w-full left-0 mx-0" />
      </div>
    </section>
  );
}