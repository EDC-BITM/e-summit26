"use client";

import { cn } from "@/lib/utils";
import AnimatedBlurText from "./AnimatedBlurText";

type EventItem = {
  time: string;
  kind: "simple" | "keynote";
  title: string;
  location: string;
};

type DayBlock = {
  left: string;
  right: string;
  items: EventItem[];
};

function DayStickyBar({
  leftLabel,
  rightLabel,
}: {
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div
      className={cn(
        "sticky z-40",
        "transition-[filter,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "filter-none will-change-transform"
      )}
      style={{ top: "88px" }}
    >
      <div className="overflow-hidden">
        <div className="flex h-14 sm:h-20 w-full items-center">
          {/* Left purple pill */}
          <div className="h-full shrink-0">
            <div
              className={cn(
                "h-full px-4 sm:px-8 md:px-10",
                "grid place-items-center",
                "text-white font-bold tracking-tight",
                "rounded-l-2xl",
                "bg-linear-to-r from-[#71008A] to-[#8b2aa8]",
                "font-sans",
                "text-sm sm:text-xl"
              )}
            >
              {leftLabel}
            </div>
          </div>

          {/* Right dark bar */}
          <div
            className={cn(
              "h-full flex-1",
              "rounded-r-2xl",
              "bg-[#0F0F0F]",
              "border border-white/[0.07] border-l-0",
              "flex items-center px-4 sm:px-8 md:px-10"
            )}
          >
            <div className="text-white/95 font-medium tracking-tight font-sans text-sm sm:text-xl">
              {rightLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ item }: { item: EventItem }) {
  return (
    <div
      className={[
        "rounded-2xl",
        "border border-white/10",
        "bg-linear-to-b from-[#151618] to-[#0D0E10]",
        "shadow-[0_32px_100px_rgba(0,0,0,0.75)]",
        "px-7 sm:px-9 py-7 sm:py-8",
        "backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="text-white/95 font-bold tracking-tight text-xl sm:text-2xl font-sans">
          {item.title}
        </div>

        {item.kind === "keynote" ? (
          <div
            className={cn(
              "shrink-0",
              "rounded-full",
              "border border-white/15",
              "bg-white/5",
              "px-3 py-1",
              "text-xs font-semibold tracking-[0.14em] uppercase text-white/80"
            )}
          >
            Keynote
          </div>
        ) : null}
      </div>

      <div className="mt-4 text-white/70 text-base leading-relaxed max-w-3xl">
        <span className="text-white/60">Location:</span>{" "}
        <span className="text-white/80">{item.location}</span>
      </div>
    </div>
  );
}

export default function EventSchedule() {
  const days: DayBlock[] = [
    {
      left: "Day 1",
      right: "13th February 2026",
      items: [
        {
          time: "5:30 PM",
          kind: "simple",
          title: "Inauguration by Principal Secretary, Gov of Jharkhand",
          location: "CAT HALL",
        },
        {
          time: "6:00 PM - 7:30 PM",
          kind: "keynote",
          title: "Keynote Session",
          location: "CAT HALL",
        },
      ],
    },
    {
      left: "Day 2",
      right: "14th February 2026",
      items: [
        {
          time: "10:00 AM TO 1:00 PM",
          kind: "simple",
          title: "Investor’s Summit",
          location: "SEMINAR HALL 1",
        },
        {
          time: "11:00 AM TO 1:00 PM",
          kind: "simple",
          title: "Maze of Markets",
          location: "LH1",
        },
        {
          time: "11:00 PM TO 1:00 PM",
          kind: "simple",
          title: "Fault Lines",
          location: "LH2",
        },
        {
          time: "2:00 PM TO 4:00 PM",
          kind: "simple",
          title: "Workshop by INC42",
          location: "CAT HALL",
        },
        {
          time: "3:00 PM TO 5:00 PM",
          kind: "simple",
          title: "Ad-venture",
          location: "LH2",
        },
        {
          time: "5:30 PM TO 7:00 PM",
          kind: "keynote",
          title: "Keynote Session",
          location: "CAT HALL",
        },
      ],
    },
    {
      left: "Day 3",
      right: "15th February 2026",
      items: [
        {
          time: "10:00 AM TO 1:00 PM",
          kind: "simple",
          title: "B-Plan",
          location: "SEMINAR HALL 1",
        },
        {
          time: "10:00 AM TO 1:00 PM",
          kind: "simple",
          title: "Reverse Shark Tank",
          location: "LH1",
        },
        {
          time: "1:30 PM TO 3:00 PM",
          kind: "keynote",
          title: "Keynote Session",
          location: "CAT HALL",
        },
        {
          time: "2:00 PM TO 4:00 PM",
          kind: "simple",
          title: "UI/UX Arena",
          location: "CLASSROOM",
        },
        {
          time: "2:00 PM TO 4:00 PM",
          kind: "simple",
          title: "Intelligent Investor",
          location: "LH1",
        },
        {
          time: "5:30 PM TO 7:00 PM",
          kind: "simple",
          title:
            "Podcast Session + Prize Distribution + Closing Ceremony",
          location: "GP BIRLA AUDITORIUM / CAT HALL",
        },
      ],
    },
  ];

  return (
    <section id="agenda" className="w-full bg-black text-white">
      <div className="mx-auto w-full px-4 sm:px-6 pt-14 pb-16 md:pt-20">
        <div className="flex items-center gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Event Schedule
          </span>
        </div>

        <h2 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08]">
          <AnimatedBlurText
            lines={["Discover the Full E-Summit'26 ", ""]}
            liteText="Event Schedule"
          />
        </h2>

        <div className="mt-12 space-y-16">
          {days.map((day) => (
            <div key={day.left} className="space-y-8">
              <DayStickyBar leftLabel={day.left} rightLabel={day.right} />

              <div className="space-y-8">
                {day.items.map((ev) => (
                  <div
                    key={`${day.left}-${ev.time}-${ev.title}`}
                    className="grid gap-4 md:grid-cols-[180px_1fr] items-start"
                  >
                    <div className="text-white/80 text-base pt-3 font-medium">
                      {ev.time}
                    </div>
                    <EventCard item={ev} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
