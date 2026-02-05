"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Instagram, Linkedin, ArrowRight, Sparkles } from "lucide-react";
import AnimatedBlurText from "./AnimatedBlurText";
import Image from "next/image";

export default function SpeakersSection() {
  // ✅ flip this to false when you're ready to reveal real speakers
  const MASK_SPEAKERS = true;

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
        name: "John Mitchell",
        title: "CEO, AI Solutions Corp",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Samantha Hayes",
        title: "Senior Data Scientist",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Aarav Mehta",
        title: "Product Lead, GenAI",
        img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Noah Brooks",
        title: "VC Partner",
        img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1600&q=80",
      },
      {
        name: "Priya Nair",
        title: "Founder, DeepTech Studio",
        img: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=1600&q=80",
      },
    ],
    []
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

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:pt-20">
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Speakers
          </span>
        </div>

        <h2
          className="
            mt-6
            font-sans
            text-4xl sm:text-5xl md:text-6xl lg:text-[68px]
            leading-[1.05]
            tracking-tight
            font-medium
          "
        >
          <AnimatedBlurText
            lines={["Meet Our Esteemed Speakers", "and "]}
            liteText="E-Summit'26"
          />
        </h2>

        <div className="mt-10 relative">
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
                // ✅ FIX: if clicking an interactive element, DON'T start drag / pointer-capture
                const target = e.target;
                if (
                  target instanceof HTMLElement &&
                  target.closest(
                    'a,button,input,textarea,select,[role="button"],[data-no-drag="true"]'
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
              <div className="flex min-w-max gap-10 py-6 md:gap-14">
                {speakers.map((sp, i) => {
                  const isActive = i === activeIdx;
                  const lift = isActive ? "-translate-y-6" : "translate-y-3";
                  const scale = isActive ? "scale-[1.02]" : "scale-[0.98]";
                  const op = isActive ? "opacity-100" : "opacity-92";

                  const isMaskedCard = MASK_SPEAKERS && i !== 0;

                  const displayName = isMaskedCard ? `Speaker ${i + 1}` : sp.name;
                  const displayTitle = isMaskedCard ? "Revealing soon" : sp.title;

                  const instagramHref = sp.instagramHref;
                  const linkedinHref = sp.linkedinHref;

                  return (
                    <div
                      key={sp.name}
                      ref={(el) => (cardRefs.current[i] = el)}
                      className={[
                        "shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        "w-[280px] sm:w-[320px] md:w-[360px]",
                        lift,
                        scale,
                        op,
                        isMaskedCard
                          ? "pointer-events-none blur-[16px] opacity-80 saturate-[1.05] scale-[0.96]"
                          : "relative z-30",
                      ].join(" ")}
                      style={{ scrollSnapAlign: "center" }}
                    >
                      <div className="group relative overflow-hidden rounded-[26px] bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                        <Image
                          height={360}
                          width={360}
                          src={sp.img}
                          alt={isMaskedCard ? "Speaker placeholder" : sp.name}
                          draggable={false}
                          className={[
                            "h-90 w-full object-cover",
                            isMaskedCard ? "grayscale" : "",
                            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            "group-hover:grayscale-0 group-hover:saturate-[1.06]",
                          ].join(" ")}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                        {/* socials */}
                        <div
                          className={[
                            "absolute bottom-4 right-4 flex items-center gap-2 transition-opacity duration-300",
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
                            className="grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                            aria-label="Instagram"
                          >
                            <Instagram size={18} />
                          </a>
                          <a
                            href={linkedinHref}
                            target="_blank"
                            rel="noreferrer"
                            data-no-drag="true"
                            onPointerDown={(e) => e.stopPropagation()} // ✅ extra-safe
                            className="grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                            aria-label="LinkedIn"
                          >
                            <Linkedin size={18} />
                          </a>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="text-xl font-semibold tracking-tight">
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

            {/* BIG MASK PANEL (spans exactly 2 cards: middle + right), does NOT touch Paritosh */}
            {MASK_SPEAKERS && (
              <div
                className="
                  pointer-events-none
                  absolute
                  top-6
                  z-20
                  left-[calc(280px+40px)]
                  w-[calc(280px*2+40px)]
                  sm:left-[calc(320px+40px)]
                  sm:w-[calc(320px*2+40px)]
                  md:left-[calc(360px+56px)]
                  md:w-[calc(360px*2+56px)]
                  h-[390px] sm:h-[410px] md:h-[430px]
                "
              >
                <div className="h-full">
                  <div className="relative h-full overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.06] p-6 sm:p-7 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#c046ff]/22 blur-[85px]" />
                      <div className="absolute -right-24 -bottom-28 h-80 w-80 rounded-full bg-[#ff4fd8]/14 blur-[95px]" />
                      <div className="absolute inset-0 [background:radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.10)_0%,transparent_55%,rgba(0,0,0,0.40)_100%)]" />
                      <div className="absolute inset-0 rounded-[28px] ring-1 ring-white/10" />
                    </div>

                    <div className="relative flex h-full flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold tracking-[0.26em] uppercase text-white/90">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-40" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-white/80" />
                          </span>
                          More Speakers Revealing Soon
                          <Sparkles size={14} className="opacity-90" />
                        </div>

                        <div className="mt-6 text-2xl sm:text-3xl font-semibold leading-tight tracking-tight">
                          Lineup is locked.
                          <div className="text-white/75">
                            Next announcements incoming.
                          </div>
                        </div>

                        <div className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed max-w-[46ch]">
                          We’re rolling out the remaining speakers in drops. Stay
                          tuned — the next two get revealed soon.
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
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

            {/* Bottom bar */}
            <div className="mt-10 pb-2">
              <div className="flex items-center gap-5 text-white/90">
                <div
                  className="text-sm font-medium text-white"
                  style={{
                    textShadow:
                      "0 0 16px rgba(255,255,255,0.70), 0 0 46px rgba(176,94,194,0.45)",
                  }}
                >
                  6+ Speakers
                </div>

                <div className="h-px flex-1 bg-white/25" />

                <a
                  href="/speakers"
                  className="group inline-flex items-center gap-3 text-sm font-medium text-white/90 hover:text-white"
                >
                  <span>See All</span>
                  <span
                    className="
                      grid h-11 w-11 place-items-center rounded-full
                      bg-white/90 text-black
                      shadow-[0_14px_40px_rgba(0,0,0,0.35)]
                    "
                  >
                    <ArrowRight
                      size={18}
                      className="rotate-45 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-0"
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
