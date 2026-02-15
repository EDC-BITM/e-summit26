"use client";

import { Instagram, Linkedin, ArrowRight, Sparkles } from "lucide-react";

// Adjust this import if your file lives elsewhere.
// (In your earlier SpeakersSection you used "./AnimatedBlurText")
import AnimatedBlurText from "@/components/AnimatedBlurText";
import Image from "next/image";

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
      target={href === "#" ? undefined : "_blank"}
      rel={href === "#" ? undefined : "noreferrer"}
      aria-label={label}
      className={[
        "grid place-items-center",
        "h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl",
        "bg-white/95 text-black",
        "shadow-[0_10px_28px_rgba(0,0,0,0.35)]",
        "backdrop-blur-md",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:bg-white hover:scale-110 hover:shadow-[0_12px_40px_rgba(192,70,255,0.4)]",
        "active:scale-[0.98]",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

export default function SpeakersGrid() {
  // All speakers are released — disable masking and treat this grid as Past Speakers
  const MASK_SPEAKERS = false;

  const speakers: Speaker[] = [
    {
      name: "Paritosh Anand",
      title: "Content Creator & Entrepreneur",
      img: "/reveal/images/paritosh_anand2.jpeg",
    },
    {
      name: "Vaidya",
      title: "IDFC First Bank",
      img: "/Vaidya.jpg",
    },
    {
      name: "Madhur Garg",
      title: "Inc42",
      img: "/MadhurGarg.jpg",
    },
    {
      name: "Ishan Sharma",
      title: "Influencer",
      img: "/IshanSharma.jpg",
    },
    {
      name: "Amit Kumar",
      title: "Easebuzz",
      img: "/AmitKumar.jpg",
    },
  ];

  return (
    <section className="w-full bg-black text-white relative overflow-hidden">
      {/* subtle depth like the reference (NOT purple glow here) */}
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(70%_70%_at_50%_20%,rgba(255,255,255,0.06),transparent_55%)]" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-20">
        {/* Eyebrow (consistent) */}
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Speakers
          </span>
        </div>

        {/* Heading (animated) */}
        <h2
          className="
            mt-6
            font-sans
            text-4xl sm:text-5xl md:text-6xl
            leading-[1.05]
            tracking-tight
            font-medium
          "
        >
          <AnimatedBlurText
            lines={["Past Speakers"]}
            liteText="Technology Trailblazers"
          />
        </h2>

        {/* Grid */}
        <div className="mt-12 relative">
          {/* CONTENT LAYER */}
          <div className="relative">
            <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {speakers.map((sp, i) => {
                const isMaskedCard = MASK_SPEAKERS && i !== 0;

                const displayName = isMaskedCard ? `Speaker ${i + 1}` : sp.name;
                const displayTitle = isMaskedCard ? "Revealing soon" : sp.title;

                return (
                  <div
                    key={sp.name}
                    className={[
                      "min-w-0",
                      isMaskedCard
                        ? "pointer-events-none opacity-85 blur-[8px] sm:blur-[16px] saturate-[1.05] scale-[1.01]"
                        : "relative z-30",
                    ].join(" ")}
                  >
                    {/* Card */}
                    <div
                      className={[
                        "group relative overflow-hidden rounded-2xl sm:rounded-[26px]",
                        "bg-gradient-to-br from-white/[0.08] to-white/[0.03]",
                        "ring-1 ring-white/[0.08]",
                        "shadow-[0_20px_80px_rgba(0,0,0,0.6)] sm:shadow-[0_28px_110px_rgba(0,0,0,0.75)]",
                        "backdrop-blur-sm",
                        "transition-all duration-500",
                        "hover:ring-white/20 hover:shadow-[0_25px_90px_rgba(192,70,255,0.25)]",
                      ].join(" ")}
                    >
                      <div className="relative w-full aspect-4/5">
                        <Image
                          height={300}
                          width={300}
                          src={sp.img}
                          alt={isMaskedCard ? "Speaker placeholder" : sp.name}
                          draggable={false}
                          className={[
                            "h-full w-full object-cover",
                            isMaskedCard ? "grayscale" : "",
                            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            "group-hover:grayscale-0 group-hover:saturate-[1.1] group-hover:scale-105",
                          ].join(" ")}
                        />

                        {/* subtle inner vignette */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* socials (only if links exist; Paritosh has them) */}
                        <div
                          className={[
                            "absolute bottom-4 right-4 flex items-center gap-2 transition-opacity duration-300",
                            isMaskedCard ? "opacity-0" : "opacity-100",
                          ].join(" ")}
                        >
                          {sp.instagramHref ? (
                            <SocialBadge href={sp.instagramHref} label="Instagram">
                              <Instagram size={16} className="sm:hidden" />
                              <Instagram size={18} className="hidden sm:block" />
                            </SocialBadge>
                          ) : null}
                          {sp.linkedinHref ? (
                            <SocialBadge href={sp.linkedinHref} label="LinkedIn">
                              <Linkedin size={16} className="sm:hidden" />
                              <Linkedin size={18} className="hidden sm:block" />
                            </SocialBadge>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="mt-4">
                      <div className="text-base font-semibold tracking-tight text-white">
                        {displayName}
                      </div>
                      <div className="mt-1 text-sm text-white/55">
                        {displayTitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MASK PANEL — covers ONLY the other cards (not Paritosh) */}
          {MASK_SPEAKERS && (
            <div
              className="
                absolute z-20
                top-0 left-0 right-0
                pointer-events-none
                hidden sm:block
              "
            >
              <div className="w-full px-4 sm:px-6 lg:px-0 pointer-events-auto absolute inset-0 flex items-center justify-center lg:items-start lg:justify-end lg:pr-0">
                <div className="relative overflow-hidden rounded-2xl sm:rounded-[24px] md:rounded-[28px] border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-xl p-4 sm:p-5 md:p-6 lg:p-7 shadow-[0_25px_90px_rgba(0,0,0,0.5),0_0_60px_rgba(192,70,255,0.2)] sm:shadow-[0_35px_130px_rgba(0,0,0,0.6),0_0_80px_rgba(192,70,255,0.25)] w-full sm:max-w-2xl lg:max-w-3xl">
                  {/* subtle glow + vignette inside the panel */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#c046ff]/30 blur-[90px] animate-pulse" />
                    <div
                      className="absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-[#ff4fd8]/20 blur-[100px] animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                    <div className="absolute inset-0 [background:radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.12)_0%,transparent_55%,rgba(0,0,0,0.40)_100%)]" />
                    <div className="absolute inset-0 rounded-2xl sm:rounded-[24px] md:rounded-[28px] ring-1 ring-white/15" />
                  </div>

                  <div className="relative">
                    {/* top row */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-gradient-to-r from-purple-500/15 to-pink-500/15 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.20em] sm:tracking-[0.26em] uppercase text-white shadow-[0_4px_20px_rgba(192,70,255,0.2)]">
                        <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400/70 opacity-60" />
                          <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(192,70,255,0.6)]" />
                        </span>
                        <span className="hidden sm:inline">
                          Lineup Revealing Soon
                        </span>
                        <span className="sm:hidden">Revealing Soon</span>
                        <Sparkles
                          size={12}
                          className="sm:hidden opacity-90 text-purple-200"
                        />
                        <Sparkles
                          size={14}
                          className="hidden sm:block opacity-90 text-purple-200"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <a
                          href="#"
                          className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 text-white/90 hover:bg-white/20 hover:border-white/25 transition-all duration-300"
                          aria-label="Instagram"
                        >
                          <Instagram size={16} className="sm:hidden" />
                          <Instagram size={18} className="hidden sm:block" />
                        </a>
                        <a
                          href="#"
                          className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 text-white/90 hover:bg-white/20 hover:border-white/25 transition-all duration-300"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={16} className="sm:hidden" />
                          <Linkedin size={18} className="hidden sm:block" />
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5 text-xl sm:text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
                      Speakers coming soon.
                      <div className="text-white/75">
                        <span className="hidden sm:inline">
                          Announcements rolling out shortly.
                        </span>
                        <span className="sm:hidden">More coming soon.</span>
                      </div>
                    </div>

                    {/* subtext */}
                    <div className="mt-2 text-xs sm:text-sm md:text-base text-white/65 leading-relaxed">
                      <span className="hidden sm:inline">
                        We're curating a high-signal lineup across AI, startups,
                        product, and growth. Follow along — the reveal starts
                        soon.
                      </span>
                      <span className="sm:hidden">
                        Stay tuned for announcements.
                      </span>
                    </div>

                    {/* CTA row */}
                    <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                      <a
                        href="/reveal/speaker"
                        className="
                          inline-flex items-center gap-1.5 sm:gap-2 rounded-full
                          bg-gradient-to-r from-white to-purple-50 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-black
                          shadow-[0_18px_50px_rgba(0,0,0,0.35),0_0_30px_rgba(192,70,255,0.3)]
                          hover:from-purple-100 hover:to-pink-100 hover:shadow-[0_20px_60px_rgba(192,70,255,0.5)]
                          transition-all duration-300 hover:scale-105
                        "
                      >
                        <span className="hidden sm:inline">
                          Reveal Speakers
                        </span>
                        <span className="sm:hidden">Reveal</span>
                        <ArrowRight
                          size={14}
                          className="sm:hidden opacity-90"
                        />
                        <ArrowRight
                          size={16}
                          className="hidden sm:block opacity-90"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
