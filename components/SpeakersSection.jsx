"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Instagram, Linkedin, ArrowRight, Sparkles } from "lucide-react";
import AnimatedBlurText from "./AnimatedBlurText";
import Image from "next/image";

export default function SpeakersSection() {
  // All speakers are released — disable masking and treat this slider as Past Speakers
  const MASK_SPEAKERS = false;

  const speakers = useMemo(
    () => [
      {
        name: "Paritosh Anand",
        title: "Content Creator & Entrepreneur",
        img: "/reveal/images/paritosh_anand2.jpeg",
        instagramHref: "https://www.instagram.com/iamparitoshanand/?hl=en",
        linkedinHref:
          "https://www.linkedin.com/in/iamparitoshanand?originalSubdomain=in",
      },
      {
        name: "V. Vaidyanathan",
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
    ],
    [],
  );

  const scrollerRef = useRef(null);
  const cardRefs = useRef([]);
  const rafRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(1);

  const drag = useRef({
    down: false,
    startX: 0,
    startScrollLeft: 0,
  });

  const updateActive = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(elCenter - center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });

    setActiveIdx(bestIdx);
  }, []);

  const scheduleUpdate = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateActive);
  }, [updateActive]);

  const snapToNearest = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const el = cardRefs.current[activeIdx];
    if (!el) return;

    const target =
      el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: "smooth" });
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => scheduleUpdate();
    scroller.addEventListener("scroll", onScroll, { passive: true });

    const timeout = setTimeout(() => {
      updateActive();
    }, 0);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
  }, [scheduleUpdate, updateActive]);

  return (
    <section className="relative w-full overflow-hidden text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#040008]" />

        <div className="absolute -left-[420px] -top-[360px] h-[980px] w-[980px] rounded-full bg-[#5b1ea6]/55 blur-[190px]" />
        <div className="absolute left-[10%] top-[-45%] h-[1100px] w-[1100px] rounded-full bg-[#7b2bd0]/40 blur-[210px]" />
        <div className="absolute left-[24%] top-[18%] h-[880px] w-[880px] rounded-full bg-[#8a35e6]/30 blur-[210px]" />

        <div className="absolute left-1/2 bottom-[-55%] h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-[#c046ff]/55 blur-[220px]" />
        <div className="absolute left-[55%] bottom-[-40%] h-[980px] w-[980px] rounded-full bg-[#ff4fd8]/20 blur-[220px]" />

        <div className="absolute right-[-40%] top-[5%] h-[1100px] w-[1100px] rounded-full bg-[#220044]/60 blur-[230px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/55" />
        <div className="absolute inset-0 [background:radial-gradient(80%_70%_at_50%_55%,transparent_0%,rgba(0,0,0,0.45)_70%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-8 md:pt-16 lg:pt-20 md:pb-10">
        <div className="flex items-center gap-2 sm:gap-3 text-white/85">
          <span className="h-px w-8 sm:w-10 bg-white/80" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.20em] sm:tracking-[0.22em] uppercase">
            Speakers
          </span>
        </div>

        <h2
          className="
            mt-4 sm:mt-6
            font-sans
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px]
            leading-[1.1] sm:leading-[1.05]
            tracking-tight
            font-medium
          "
        >
          <AnimatedBlurText lines={["Past Speakers"]} liteText="E-Summit'26" />
        </h2>

        <div className="mt-6 sm:mt-8 md:mt-10 relative">
          <div className="relative">
            <div
              ref={scrollerRef}
              className="
                relative
                overflow-x-auto overscroll-x-contain
                pb-2
                select-none
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
              "
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
              onPointerDown={(e) => {
                const target = e.target;
                if (
                  target instanceof HTMLElement &&
                  target.closest(
                    'a,button,input,textarea,select,[role="button"],[data-no-drag="true"]',
                  )
                ) {
                  return;
                }

                const scroller = scrollerRef.current;
                if (!scroller) return;

                drag.current.down = true;
                drag.current.startX = e.clientX;
                drag.current.startScrollLeft = scroller.scrollLeft;

                // only capture when dragging starts
                scroller.setPointerCapture?.(e.pointerId);
              }}
              onPointerMove={(e) => {
                const scroller = scrollerRef.current;
                if (!scroller || !drag.current.down) return;
                const dx = e.clientX - drag.current.startX;
                scroller.scrollLeft = drag.current.startScrollLeft - dx;
              }}
              onPointerUp={() => {
                drag.current.down = false;
                setTimeout(snapToNearest, 0);
              }}
              onPointerCancel={() => {
                drag.current.down = false;
                setTimeout(snapToNearest, 0);
              }}
              onScroll={scheduleUpdate}
            >
              <div className="flex min-w-max gap-4 sm:gap-6 md:gap-10 lg:gap-14 py-4 sm:py-6 relative">
                {speakers.map((sp, i) => {
                  const isActive = i === activeIdx;
                  const lift = isActive
                    ? "-translate-y-3 sm:-translate-y-6"
                    : "translate-y-1 sm:translate-y-3";
                  const scale = isActive
                    ? "scale-[1.01] sm:scale-[1.02]"
                    : "scale-[0.99] sm:scale-[0.98]";
                  const op = isActive ? "opacity-100" : "opacity-92";

                  const isMaskedCard = MASK_SPEAKERS && i !== 0;

                  const displayName = isMaskedCard
                    ? `Speaker ${i + 1}`
                    : sp.name;
                  const displayTitle = isMaskedCard
                    ? "Revealing soon"
                    : sp.title;

                  const instagramHref = sp.instagramHref;
                  const linkedinHref = sp.linkedinHref;

                  return (
                    <div
                      key={sp.name}
                      ref={(el) => (cardRefs.current[i] = el)}
                      className={[
                        "shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        "w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px]",
                        lift,
                        scale,
                        op,
                        isMaskedCard
                          ? "pointer-events-none blur-[12px] sm:blur-[16px] opacity-80 saturate-[1.05] scale-[0.97] sm:scale-[0.96]"
                          : "relative z-30",
                      ].join(" ")}
                      style={{ scrollSnapAlign: "center" }}
                    >
                      <div className="group relative overflow-hidden rounded-2xl sm:rounded-[26px] bg-gradient-to-br from-white/[0.08] to-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-sm border border-white/[0.08] transition-all duration-500 hover:border-white/20 hover:shadow-[0_25px_90px_rgba(192,70,255,0.25)]">
                        <Image
                          height={360}
                          width={360}
                          src={sp.img}
                          alt={isMaskedCard ? "Speaker placeholder" : sp.name}
                          draggable={false}
                          className={[
                            "h-72 sm:h-80 md:h-90 w-full object-cover",
                            isMaskedCard ? "grayscale" : "",
                            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            "group-hover:grayscale-0 group-hover:saturate-[1.1] group-hover:scale-105",
                          ].join(" ")}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* socials */}
                        <div
                          className={[
                            "absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-1.5 sm:gap-2 transition-opacity duration-300",
                            isMaskedCard
                              ? "opacity-0"
                              : isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100",
                          ].join(" ")}
                        >
                          <a
                            href={instagramHref}
                            target="_blank"
                            rel="noreferrer"
                            data-no-drag="true"
                            onPointerDown={(e) => e.stopPropagation()} // ✅ extra-safe
                            className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg sm:rounded-xl bg-white/95 text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-white hover:scale-110 hover:shadow-[0_12px_40px_rgba(192,70,255,0.4)] transition-all duration-300"
                            aria-label="Instagram"
                          >
                            <Instagram size={16} className="sm:hidden" />
                            <Instagram size={18} className="hidden sm:block" />
                          </a>
                          <a
                            href={linkedinHref}
                            target="_blank"
                            rel="noreferrer"
                            data-no-drag="true"
                            onPointerDown={(e) => e.stopPropagation()} // ✅ extra-safe
                            className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg sm:rounded-xl bg-white/95 text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md hover:bg-white hover:scale-110 hover:shadow-[0_12px_40px_rgba(192,70,255,0.4)] transition-all duration-300"
                            aria-label="LinkedIn"
                          >
                            <Linkedin size={16} className="sm:hidden" />
                            <Linkedin size={18} className="hidden sm:block" />
                          </a>
                        </div>
                      </div>

                      <div className="mt-3 sm:mt-4 md:mt-5 group-hover:translate-y-[-2px] transition-transform duration-300">
                        <div className="text-lg sm:text-xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300">
                          {displayName}
                        </div>
                        <div className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-white/55 group-hover:text-white/70 transition-colors duration-300">
                          {displayTitle}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* BIG MASK PANEL (spans exactly 2 cards: middle + right), does NOT touch Paritosh */}
                {MASK_SPEAKERS && (
                  <div
                    className="
                  pointer-events-auto
                  shrink-0
                  absolute
                  top-4 sm:top-6
                  z-20
                  left-[calc(240px+16px)]
                  w-[calc(240px*2+16px)]
                  sm:left-[calc(280px+24px)]
                  sm:w-[calc(280px*2+24px)]
                  md:left-[calc(320px+40px)]
                  md:w-[calc(320px*2+40px)]
                  lg:left-[calc(360px+56px)]
                  lg:w-[calc(360px*2+56px)]
                  h-[320px] sm:h-[360px] md:h-[390px] lg:h-[430px]
                "
                  >
                    <div className="h-full pointer-events-none">
                      <div className="relative h-full overflow-hidden rounded-2xl sm:rounded-[24px] md:rounded-[28px] border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.04] backdrop-blur-xl p-4 sm:p-5 md:p-6 lg:p-7 shadow-[0_25px_90px_rgba(0,0,0,0.5),0_0_60px_rgba(192,70,255,0.2)] sm:shadow-[0_35px_130px_rgba(0,0,0,0.6),0_0_80px_rgba(192,70,255,0.25)]">
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#c046ff]/30 blur-[90px] animate-pulse" />
                          <div
                            className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-[#ff4fd8]/20 blur-[100px] animate-pulse"
                            style={{ animationDelay: "1s" }}
                          />
                          <div className="absolute inset-0 [background:radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.12)_0%,transparent_55%,rgba(0,0,0,0.40)_100%)]" />
                          <div className="absolute inset-0 rounded-2xl sm:rounded-[24px] md:rounded-[28px] ring-1 ring-white/15" />
                        </div>

                        <div className="relative flex h-full flex-col justify-between">
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-purple-500/15 to-pink-500/15 backdrop-blur-md px-4 py-2 text-[11px] font-semibold tracking-[0.26em] uppercase text-white shadow-[0_4px_20px_rgba(192,70,255,0.2)]">
                              <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400/70 opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(192,70,255,0.6)]" />
                              </span>
                              More Speakers Revealing Soon
                              <Sparkles
                                size={14}
                                className="opacity-90 text-purple-200"
                              />
                            </div>

                            <div className="mt-6 text-2xl sm:text-3xl font-semibold leading-tight tracking-tight">
                              Lineup is locked.
                              <div className="text-white/75">
                                Next announcements incoming.
                              </div>
                            </div>

                            <div className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed max-w-[46ch]">
                              We’re rolling out the remaining speakers in drops.
                              Stay tuned — the next two get revealed soon.
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                            <a
                              href="/reveal/speaker"
                              className="
                            pointer-events-auto
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

            {/* Bottom bar */}
            <div className="mt-6 sm:mt-8 md:mt-10 pb-2">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 text-white/90">
                <div
                  className="text-xs sm:text-sm font-medium text-white"
                  style={{
                    textShadow:
                      "0 0 16px rgba(255,255,255,0.70), 0 0 46px rgba(176,94,194,0.45)",
                  }}
                >
                  6+ Past Speakers
                </div>

                <div className="h-px flex-1 bg-white/25" />

                <a
                  href="/speakers"
                  className="group inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-colors duration-300"
                >
                  <span className="relative">
                    See All
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <span
                    className="
                      grid h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 place-items-center rounded-full
                      bg-gradient-to-br from-white to-purple-50 text-black
                      shadow-[0_14px_40px_rgba(0,0,0,0.35)]
                      group-hover:shadow-[0_16px_50px_rgba(192,70,255,0.4)]
                      transition-all duration-300 group-hover:scale-110
                    "
                  >
                    <ArrowRight
                      size={16}
                      className="sm:hidden rotate-45 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-0"
                    />
                    <ArrowRight
                      size={18}
                      className="hidden sm:block rotate-45 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-0"
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
