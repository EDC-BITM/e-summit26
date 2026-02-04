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

export default function SpeakersGrid() {
  // ✅ flip this to false when you're ready to reveal real speakers
  const MASK_SPEAKERS = true;

  const speakers: Speaker[] = [
    {
      name: "Dr. Emma Parker",
      title: "Senior Software Engineer",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    },
    {
      name: "John Mitchell",
      title: "Full Stack Developer",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=80",
    },
    {
      name: "Samantha Hayes",
      title: "Backend Architect",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80",
    },
    {
      name: "James Turner",
      title: "DevOps Specialist",
      img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1600&q=80",
    },
    {
      name: "Michael Anderson",
      title: "Mobile App Engineer",
      img: "https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=1600&q=80",
    },
    {
      name: "Laura Chang",
      title: "Cloud Solutions Expert",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1061&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Dr. Maya Bennett",
      title: "AI/ML Engineer",
      img: "https://images.unsplash.com/photo-1714508809994-d1f71099bf35?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Jonathan Reyes",
      title: "Technical Lead – Web Platforms",
      img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=80",
    },
  ];

  return (
    <section className="w-full bg-black text-white">
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
            lines={["Meet Our Esteemed Developers", "and "]}
            liteText="Technology Trailblazers"
          />
        </h2>

        {/* Grid (masked like your slider reference) */}
        <div className="mt-12 relative">
          {/* CONTENT LAYER (blur + disable interactions when masked) */}
          <div
            className={[
              "relative",
              MASK_SPEAKERS
                ? "pointer-events-none opacity-85 blur-[16px] saturate-[1.05] scale-[1.01]"
                : "",
            ].join(" ")}
          >
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {speakers.map((sp, i) => {
                const displayName = MASK_SPEAKERS ? `Speaker ${i + 1}` : sp.name;
                const displayTitle = MASK_SPEAKERS
                  ? "Revealing soon"
                  : sp.title;

                return (
                  <div key={sp.name} className="min-w-0">
                    {/* Card */}
                    <div
                      className={[
                        "group relative overflow-hidden rounded-[28px]",
                        "bg-white/3 ring-1 ring-white/10",
                        "shadow-[0_28px_110px_rgba(0,0,0,0.75)]",
                      ].join(" ")}
                    >
                      <div className="relative w-full aspect-4/5">
                        <Image
                          height={300}
                          width={300}
                          src={sp.img}
                          alt={MASK_SPEAKERS ? "Speaker placeholder" : sp.name}
                          draggable={false}
                          className={[
                            "h-full w-full object-cover",
                            "grayscale",
                            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            "group-hover:grayscale-0 group-hover:saturate-[1.06]",
                          ].join(" ")}
                        />

                        {/* subtle inner vignette */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {/* socials (hidden when masked, like reference) */}
                        <div
                          className={[
                            "absolute bottom-4 right-4 flex items-center gap-2",
                            MASK_SPEAKERS ? "opacity-0" : "opacity-100",
                          ].join(" ")}
                        >
                          <SocialBadge
                            href={sp.instagramHref ?? "#"}
                            label="Instagram"
                          >
                            <Instagram size={18} />
                          </SocialBadge>
                          <SocialBadge
                            href={sp.linkedinHref ?? "#"}
                            label="LinkedIn"
                          >
                            <Linkedin size={18} />
                          </SocialBadge>
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

          {/* GLOBAL MASK (one overlay for the whole grid area) */}
          {MASK_SPEAKERS && (
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
              <div className="w-full max-w-2xl">
                <div className="relative overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.06] p-5 sm:p-7 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                  {/* subtle glow + vignette inside the panel */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-[70px]" />
                    <div className="absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-white/6 blur-[80px]" />
                    <div className="absolute inset-0 [background:radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.10)_0%,transparent_55%,rgba(0,0,0,0.35)_100%)]" />
                    <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/10" />
                  </div>

                  <div className="relative">
                    {/* top row */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-semibold tracking-[0.26em] uppercase text-white/90">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-40" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-white/80" />
                        </span>
                        Lineup Revealing Soon
                        <Sparkles size={14} className="opacity-90" />
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href="#"
                          className="grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-white/10 text-white/90 hover:bg-white/15"
                          aria-label="Instagram"
                        >
                          <Instagram size={18} />
                        </a>
                        <a
                          href="#"
                          className="grid h-10 w-10 place-items-center rounded-2xl border border-white/12 bg-white/10 text-white/90 hover:bg-white/15"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={18} />
                        </a>
                      </div>
                    </div>

                    <div className="mt-5 text-2xl sm:text-3xl font-semibold leading-tight tracking-tight">
                      Speakers coming soon.
                      <div className="text-white/75">
                        Announcements rolling out shortly.
                      </div>
                    </div>

                    {/* subtext */}
                    <div className="mt-2 text-sm sm:text-base text-white/65 leading-relaxed">
                      We’re curating a high-signal lineup across AI, startups,
                      product, and growth. Follow along — the reveal starts
                      soon.
                    </div>

                    {/* quick “teaser” blocks */}
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {/* intentionally blank to match your reference */}
                    </div>

                    {/* CTA row */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                      <a
                        href="/reveal/speaker"
                        className="
                          inline-flex items-center gap-2 rounded-full
                          bg-white/90 px-5 py-3 text-sm font-semibold text-black
                          shadow-[0_18px_50px_rgba(0,0,0,0.35)]
                          hover:bg-white
                        "
                      >
                        Reveal Speakers
                        <ArrowRight size={16} className="opacity-90" />
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
