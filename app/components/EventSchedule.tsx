// app/components/EventSchedule.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Speaker = {
  img: string;
  name: string;
  role: string;
};

type PanelPerson = {
  img: string;
  name: string;
  role: string;
  org: string;
};

type EventItem =
  | {
      time: string;
      kind: "simple";
      title: string;
      desc: string;
    }
  | {
      time: string;
      kind: "keynote";
      title: string;
      desc: string;
      speaker: Speaker;
    }
  | {
      time: string;
      kind: "panel";
      title: string;
      desc: string;
      panel: PanelPerson[];
    };

type DayBlock = {
  left: string;
  right: string;
  items: EventItem[];
};

function readNavOffsetPx(fallback = 88): number {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--nav-offset")
    .trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

function useStuck(isLastDay: boolean = false) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [topPx, setTopPx] = useState<number>(88);
  const [stuck, setStuck] = useState<boolean>(false);

  useEffect(() => {
    const top = readNavOffsetPx(88);
    setTopPx(top);

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const isStuck = r.top <= top + 0.5;
        setStuck(isStuck);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isLastDay]);

  return { ref, topPx, stuck };
}

function DayStickyBar({ 
  leftLabel, 
  rightLabel, 
  isLastDay 
}: { 
  leftLabel: string; 
  rightLabel: string;
  isLastDay?: boolean;
}) {
  const { ref, topPx, stuck } = useStuck(isLastDay);

  return (
    <div
      ref={ref}
      className={[
        "sticky z-40",
        "transition-[filter,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isLastDay ? "mb-0" : "mb-8"
      ].join(" ")}
      style={{ top: topPx }}
    >
      <div className={["overflow-hidden", stuck ? "shadow-[0_24px_80px_rgba(0,0,0,0.85)]" : ""].join(" ")}>
        <div className="flex h-16 sm:h-20 w-full items-center">
          {/* Left purple pill */}
          <div className="h-full shrink-0">
            <div
              className={[
                "h-full px-6 sm:px-8 md:px-10",
                "grid place-items-center",
                "text-white font-bold tracking-tight",
                "rounded-l-2xl",
                "bg-gradient-to-r from-[#71008A] to-[#8b2aa8]",
                "font-['Inter',ui-sans-serif,system-ui]",
                "text-lg sm:text-xl",
              ].join(" ")}
            >
              {leftLabel}
            </div>
          </div>

          {/* Right dark bar */}
          <div
            className={[
              "h-full flex-1",
              "rounded-r-2xl",
              "bg-[#0F0F0F]",
              "border border-white/[0.07] border-l-0",
              "flex items-center px-6 sm:px-8 md:px-10",
            ].join(" ")}
          >
            <div className="text-white/95 font-medium tracking-tight font-['Inter',ui-sans-serif,system-ui] text-lg sm:text-xl">
              {rightLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeakerChip({ img, name, role }: Speaker) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={img}
        alt={name}
        loading="lazy"
        className="h-14 w-14 rounded-full object-cover ring-2 ring-white/15"
      />
      <div className="leading-tight">
        <div className="text-lg font-bold text-white/95 font-['Inter',ui-sans-serif,system-ui]">{name}</div>
        <div className="text-sm text-white/65">{role}</div>
      </div>
    </div>
  );
}

function PanelPeople({ people }: { people: PanelPerson[] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-8">
      {people.map((p) => (
        <div key={p.name} className="flex items-center gap-4">
          <img
            src={p.img}
            alt={p.name}
            loading="lazy"
            className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/15"
          />
          <div className="leading-tight">
            <div className="text-base font-bold text-white/90 font-['Inter',ui-sans-serif,system-ui]">{p.name}</div>
            <div className="text-sm text-white/60">{p.role}</div>
            <div className="text-sm text-white/45">{p.org}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventCard({
  item,
}: {
  item: EventItem;
}) {
  return (
    <div
      className={[
        "rounded-2xl",
        "border border-white/10",
        "bg-gradient-to-b from-[#151618] to-[#0D0E10]",
        "shadow-[0_32px_100px_rgba(0,0,0,0.75)]",
        "px-7 sm:px-9 py-7 sm:py-8",
        "backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="text-white/95 font-bold tracking-tight text-xl sm:text-2xl font-['Inter',ui-sans-serif,system-ui]">
        {item.title}
      </div>

      <div className="mt-4 text-white/70 text-base leading-relaxed max-w-3xl">
        {item.desc}
      </div>

      {item.kind === "keynote" ? (
        <div className="mt-8">
          <SpeakerChip {...item.speaker} />
        </div>
      ) : null}

      {item.kind === "panel" ? <PanelPeople people={item.panel} /> : null}
    </div>
  );
}

export default function EventSchedule() {
  const days = useMemo<DayBlock[]>(
    () => [
      {
        left: "Kickoff",
        right: "Day 1 : Opening Ceremony",
        items: [
          {
            time: "09.30-10.30 AM",
            kind: "simple",
            title: "Opening Remarks",
            desc:
              "Welcome to the E-Summit. Kick off the day with an introduction from the event organizers and a sneak peek of what's in store.",
          },
          {
            time: "10.30-11.30 AM",
            kind: "keynote",
            title: "Keynote Address: Revolutionizing the Future with AI",
            desc:
              "By Dr. Emma Parker, Chief AI Scientist at InnovateX Labs. Explore the transformative impact of AI on industries and society.",
            speaker: {
              img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
              name: "Dr. Emma Parker",
              role: "CEO, Zecon AI",
            },
          },
          {
            time: "12.30-01.30 AM",
            kind: "panel",
            title: "Panel Discussion: AI in Action: Real-World Applications",
            desc:
              "A lively discussion on how AI is being implemented in sectors like healthcare, finance, and logistics, with industry experts.",
            panel: [
              {
                img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
                name: "Sara Williams",
                role: "AI Strategist",
                org: "InnovateTech",
              },
              {
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                name: "Ravi Singh",
                role: "Lead AI Engineer",
                org: "MedTech Solutions",
              },
              {
                img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80",
                name: "James Turner",
                role: "Senior Data Scientist",
                org: "Quantum Analytics",
              },
              {
                img: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=300&q=80",
                name: "Emily Roberts",
                role: "Director, AI Applications",
                org: "Nexa Systems",
              },
            ],
          },
        ],
      },
      {
        left: "Main Day",
        right: "Day 2 : Deep Dive Sessions",
        items: [
          {
            time: "09.30-10.30 AM",
            kind: "simple",
            title: "Morning Networking Coffee",
            desc:
              "Catch up with fellow attendees over coffee before diving into another exciting day of learning.",
          },
          {
            time: "11.30-12.30 PM",
            kind: "keynote",
            title: "Keynote Address: The Intersection of AI and Blockchain",
            desc:
              "By John Mitchell, Co-Founder & CEO at AI Solutions Corp. Understand how AI and blockchain can work together to create innovative solutions.",
            speaker: {
              img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
              name: "John Mitchell",
              role: "Co-Founder at AI Corp",
            },
          },
          {
            time: "2.30-04.30 PM",
            kind: "panel",
            title: "Panel Discussion: AI and Automation in Industry 4.0",
            desc:
              "Panelists explore how AI-powered automation is driving the future of manufacturing and supply chain.",
            panel: [
              {
                img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
                name: "Dr. Lisa White",
                role: "Chief Innovation Officer",
                org: "TechFlow",
              },
              {
                img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
                name: "Mark Johnson",
                role: "Director, AI Solutions",
                org: "RoboTech",
              },
              {
                img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
                name: "Priya Patel",
                role: "Head, Digital Transformation",
                org: "NovaWorks",
              },
              {
                img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
                name: "David Collins",
                role: "VP, Automation & Robotics",
                org: "Forge Labs",
              },
            ],
          },
        ],
      },
      {
        left: "Sumup",
        right: "Day 3 : Networking Day",
        items: [
          {
            time: "09.30-11.30 AM",
            kind: "simple",
            title: "Workshop: Driving ROI with Data",
            desc:
              "Learn how businesses can use AI to optimize operations, increase profitability, and drive growth.",
          },
          {
            time: "02.30-03.30 PM",
            kind: "keynote",
            title: "Fireside Chat: The Future of AI in Consumer Products",
            desc:
              "Join Olivia Reynolds, Principal Engineer at AlphaTech, as she discusses the role of AI in creating personalized consumer experiences.",
            speaker: {
              img: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=500&q=80",
              name: "Olivia Reynolds",
              role: "Engineer at Alpha Tech",
            },
          },
          {
            time: "04.30-05.30 PM",
            kind: "simple",
            title: "Closing Remarks & Thank You",
            desc:
              "A final wrap-up of the E-Summit, with acknowledgments to all speakers, sponsors, and attendees. Looking forward to seeing you next year!",
          },
        ],
      },
    ],
    []
  );

  return (
    <section id="agenda" className="w-full bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24 md:pb-20">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-12 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Event Schedule
          </span>
        </div>

        {/* Heading */}
        <h2
          className={[
            "mt-6",
            "font-['Inter',ui-sans-serif,system-ui]",
            "text-4xl sm:text-5xl md:text-6xl",
            "leading-[1.08] tracking-tight",
            "font-bold",
          ].join(" ")}
        >
          <span className="block">Discover the Full E-Summit&apos;26</span>
          <span className="block text-white/30">Event Schedule</span>
        </h2>

        {/* Days */}
        <div className="mt-14 space-y-20">
          {days.map((day, index) => (
            <div key={day.left} className="space-y-10">
              <DayStickyBar 
                leftLabel={day.left} 
                rightLabel={day.right} 
                isLastDay={index === days.length - 1}
              />

              <div className="space-y-12">
                {day.items.map((ev) => (
                  <div
                    key={`${day.left}-${ev.time}-${ev.title}`}
                    className={[
                      "grid gap-5 sm:gap-8",
                      "md:grid-cols-[200px_1fr]",
                      "items-start",
                    ].join(" ")}
                  >
                    <div className="text-white/80 text-base sm:text-lg tracking-tight pt-3 font-['Inter',ui-sans-serif,system-ui] font-medium">
                      {ev.time}
                    </div>

                    <EventCard item={ev} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-20" />
      </div>
    </section>
  );
}