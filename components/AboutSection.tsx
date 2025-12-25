import Image from "next/image";
import AnimatedBlurText from "./AnimatedBlurText";
import { cn } from "@/lib/utils";

export default function AboutSection() {
  const icons = [
    { img: "/Triangle.png", alt: "Triangle" },
    { img: "/Cube.png", alt: "Cube" },
    { img: "/Stack.png", alt: "Stack" },
  ];

  return (
    <section id="about" className="w-full bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        {/* Eyebrow (left aligned) */}

        <div className="flex items-center justify-start gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            About E-Summit
          </span>
        </div>

        {/* Heading (forced 2 lines, left aligned) */}
        <AnimatedBlurText
          lines={["Why You Absolutely ", "Attend "]}
          liteText="E-Summit'26"
          className="
            mt-6 text-left
            text-3xl sm:text-5xl md:text-6xl
            font-medium tracking-tight
          "
        />

        {/* 50/50 row: icons (left) + paragraph (right) */}
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left: icons in a single line */}
          <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8">
            {icons.map((c, i) => (
              <Image
                width={120}
                height={120}
                key={c.alt}
                src={c.img}
                alt={c.alt}
                draggable={false}
                className={[
                  "select-none opacity-95 mix-blend-screen",
                  "w-19.5 sm:w-23 md:w-27 lg:w-30 h-auto",
                  "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                ].join(" ")}
                style={{ transitionDelay: `${140 + i * 160}ms` }}
              />
            ))}
          </div>

          {/* Right: paragraph */}
          <div
            className={[
              "text-sm sm:text-base text-white/75 leading-relaxed",
              "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            ].join(" ")}
            style={{ transitionDelay: "520ms" }}
          >
            <p>
              <span className="font-semibold text-white/90">E-Summit</span> is
              BIT Mesra’s flagship entrepreneurship festival, organised by EDC.
              It brings together bold dreamers, aspiring entrepreneurs, industry
              experts, investors, mentors and innovators from across India.
            </p>
            <p className="mt-4">
              Whether you’re an aspiring founder, tech-enthusiast, designer,
              investor or simply curious, E-Summit&apos;26 offers something for
              everyone.
            </p>
          </div>
        </div>

        {/* Banner image (full width, below) */}
        <div
          className={cn(
            "mt-12 overflow-hidden rounded-2xl sticky top-0",
            "border border-white/10 bg-white/4",
            "shadow-[0_30px_120px_rgba(0,0,0,0.55)]",
            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          )}
          style={{ transitionDelay: "720ms" }}
        >
          <Image
            width={2000}
            height={800}
            src="/photo-1507525428034-b723cf961d3e.avif"
            alt="E-Summit banner"
            className="h-65 sticky top-0 w-full object-cover sm:h-80 md:h-95"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
