"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Instagram, Linkedin, ArrowRight } from "lucide-react";

export default function SpeakersSection() {
  const speakers = useMemo(
    () => [
      {
        name: "Dr. Emma Parker",
        title: "Chief AI Scientist",
        img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
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

  const updateActive = () => {
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
  };

  const scheduleUpdate = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateActive);
  };

  const snapToNearest = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const el = cardRefs.current[activeIdx];
    if (!el) return;

    const target = el.offsetLeft + el.offsetWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior: "smooth" });
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => scheduleUpdate();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    updateActive();

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative overflow-hidden text-white">
      {/* Background: push the purple glow MUCH harder (to match your reference) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* base */}
        <div className="absolute inset-0 bg-[#040008]" />

        {/* large soft fields */}
        <div className="absolute -left-[420px] -top-[360px] h-[980px] w-[980px] rounded-full bg-[#5b1ea6]/55 blur-[190px]" />
        <div className="absolute left-[10%] top-[-45%] h-[1100px] w-[1100px] rounded-full bg-[#7b2bd0]/40 blur-[210px]" />
        <div className="absolute left-[24%] top-[18%] h-[880px] w-[880px] rounded-full bg-[#8a35e6]/30 blur-[210px]" />

        {/* bottom “hot” magenta/purple like the screenshot */}
        <div className="absolute left-1/2 bottom-[-55%] h-[1200px] w-[1200px] -translate-x-1/2 rounded-full bg-[#c046ff]/55 blur-[220px]" />
        <div className="absolute left-[55%] bottom-[-40%] h-[980px] w-[980px] rounded-full bg-[#ff4fd8]/20 blur-[220px]" />

        {/* right side deep purple falloff */}
        <div className="absolute right-[-40%] top-[5%] h-[1100px] w-[1100px] rounded-full bg-[#220044]/60 blur-[230px]" />

        {/* contrast + vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/55" />
        <div className="absolute inset-0 [background:radial-gradient(80%_70%_at_50%_55%,transparent_0%,rgba(0,0,0,0.45)_70%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      {/* SINGLE wrapper so heading and slider share the same left edge */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:pt-20">
        {/* Eyebrow (match your other sections exactly) */}
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Speakers
          </span>
        </div>

        {/* Heading (same alignment as cards below) */}
        <h2
          className="
            mt-6
            font-['Inter',ui-sans-serif,system-ui]
            text-4xl sm:text-5xl md:text-6xl lg:text-[68px]
            leading-[1.05]
            tracking-tight
            font-medium
          "
        >
          <span className="block">Meet Our Esteemed Speakers</span>
          <span className="block">
            and <span className="text-white/35">Industry Thought Leaders</span>
          </span>
        </h2>

        {/* Slider */}
        <div className="mt-10">
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
              const scroller = scrollerRef.current;
              if (!scroller) return;
              drag.current.down = true;
              drag.current.startX = e.clientX;
              drag.current.startScrollLeft = scroller.scrollLeft;
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
                    ].join(" ")}
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <div className="group relative overflow-hidden rounded-[26px] bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                      <img
                        src={sp.img}
                        alt={sp.name}
                        draggable={false}
                        className="
                          h-[360px] w-full object-cover
                          grayscale
                          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                          group-hover:grayscale-0 group-hover:saturate-[1.06]
                        "
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                      {/* socials (show for active; also fade in on hover for others) */}
                      <div
                        className={[
                          "absolute bottom-4 right-4 flex items-center gap-2 transition-opacity duration-300",
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                        ].join(" ")}
                      >
                        <a
                          href="#"
                          className="grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                          aria-label="Instagram"
                        >
                          <Instagram size={18} />
                        </a>
                        <a
                          href="#"
                          className="grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
                          aria-label="LinkedIn"
                        >
                          <Linkedin size={18} />
                        </a>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="text-xl font-semibold tracking-tight">
                        {sp.name}
                      </div>
                      <div className="mt-1 text-sm text-white/55">{sp.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
                href="#"
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
    </section>
  );
}
