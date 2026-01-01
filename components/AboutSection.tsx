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
      <div className="w-full px-6 py-20 md:py-24">
        {/* Eyebrow */}
        <div className="flex items-center justify-start gap-3 text-white/85">
          <span className="h-px w-10 bg-white/80" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            About E-Summit
          </span>
        </div>

        {/* Heading */}
        <AnimatedBlurText
          lines={["Why You Absolutely Should ", "Attend "]}
          liteText="E-Summit'26"
          className="
            mt-6 text-left
            text-3xl sm:text-5xl md:text-6xl
            font-medium tracking-tight
          "
        />

        {/* 50 / 50 layout */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left: Icons */}
          <div className="w-full h-full flex items-center justify-center lg:justify-start">
            <div className="flex items-center gap-8 sm:gap-10 lg:gap-12">
              {icons.map((c, i) => (
                <Image
                  key={c.alt}
                  src={c.img}
                  alt={c.alt}
                  width={160}
                  height={160}
                  draggable={false}
                  className="
                    select-none opacity-95 mix-blend-screen
                    w-28 sm:w-32 md:w-36 lg:w-40 h-auto
                    transition-all duration-700
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                  "
                  style={{ transitionDelay: `${140 + i * 160}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Right: Text */}
          <div
            className="
              w-full h-full flex items-center
              text-sm sm:text-base md:text-lg
              text-white/75 leading-relaxed
              transition-all duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
            "
            style={{ transitionDelay: "520ms" }}
          >
            <div>
              <p>
                <span className="font-semibold text-white/90">E-Summit</span> is
                BIT Mesra’s flagship entrepreneurship festival, organised by
                EDC. It brings together bold dreamers, aspiring entrepreneurs,
                industry experts, investors, mentors and innovators from across
                India.
              </p>
              <p className="mt-4">
                Whether you’re an aspiring founder, tech-enthusiast, designer,
                investor or simply curious, E-Summit&apos;26 offers something
                for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Banner */}
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
            src="/photo-1507525428034-b723cf961d3e.avif"
            alt="E-Summit banner"
            width={2000}
            height={800}
            className="w-full object-cover h-64 sm:h-80 md:h-96"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
