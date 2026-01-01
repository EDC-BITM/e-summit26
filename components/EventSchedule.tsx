import { cn } from "@/lib/utils";
import AnimatedBlurText from "./AnimatedBlurText";
import Image from "next/image";

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

function SpeakerChip({ img, name, role }: Speaker) {
  return (
    <div className="flex items-center gap-4">
      <Image
        height={100}
        width={100}
        src={img}
        alt={name}
        loading="lazy"
        className="h-14 w-14 rounded-full object-cover ring-2 ring-white/15"
      />
      <div className="leading-tight">
        <div className="text-lg font-bold text-white/95 font-sans">{name}</div>
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
          <Image
            height={100}
            width={100}
            src={p.img}
            alt={p.name}
            loading="lazy"
            className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/15"
          />
          <div className="leading-tight">
            <div className="text-base font-bold text-white/90 font-sans">
              {p.name}
            </div>
            <div className="text-sm text-white/60">{p.role}</div>
            <div className="text-sm text-white/45">{p.org}</div>
          </div>
        </div>
      ))}
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
      <div className="text-white/95 font-bold tracking-tight text-xl sm:text-2xl font-sans">
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
  const days: DayBlock[] = [
    {
      left: "Kickoff",
      right: "Day 1 : Opening Ceremony",
      items: [
        {
          time: "09.30-10.30 AM",
          kind: "simple",
          title: "Opening Remarks",
          desc: "Welcome to the E-Summit. Kick off the day with an introduction from the event organizers and a sneak peek of what's in store.",
        },
        {
          time: "10.30-11.30 AM",
          kind: "keynote",
          title: "Keynote Address: Revolutionizing the Future with AI",
          desc: "By Dr. Emma Parker, Chief AI Scientist at InnovateX Labs. Explore the transformative impact of AI on industries and society.",
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
          desc: "A lively discussion on how AI is being implemented in sectors like healthcare, finance, and logistics, with industry experts.",
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
          desc: "Catch up with fellow attendees over coffee before diving into another exciting day of learning.",
        },
        {
          time: "11.30-12.30 PM",
          kind: "keynote",
          title: "Keynote Address: The Intersection of AI and Blockchain",
          desc: "By John Mitchell, Co-Founder & CEO at AI Solutions Corp. Understand how AI and blockchain can work together to create innovative solutions.",
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
          desc: "Panelists explore how AI-powered automation is driving the future of manufacturing and supply chain.",
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
          desc: "Learn how businesses can use AI to optimize operations, increase profitability, and drive growth.",
        },
        {
          time: "02.30-03.30 PM",
          kind: "keynote",
          title: "Fireside Chat: The Future of AI in Consumer Products",
          desc: "Join Olivia Reynolds, Principal Engineer at AlphaTech, as she discusses the role of AI in creating personalized consumer experiences.",
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
          desc: "A final wrap-up of the E-Summit, with acknowledgments to all speakers, sponsors, and attendees. Looking forward to seeing you next year!",
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
