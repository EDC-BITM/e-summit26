import { Instagram, Linkedin } from "lucide-react";

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
            font-['Inter',ui-sans-serif,system-ui]
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

        {/* Grid */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((sp) => (
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
                    alt={sp.name}
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

                  {/* socials (always visible like the reference) */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <SocialBadge
                      href={sp.instagramHref ?? "#"}
                      label="Instagram"
                    >
                      <Instagram size={18} />
                    </SocialBadge>
                    <SocialBadge href={sp.linkedinHref ?? "#"} label="LinkedIn">
                      <Linkedin size={18} />
                    </SocialBadge>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="mt-4">
                <div className="text-base font-semibold tracking-tight text-white">
                  {sp.name}
                </div>
                <div className="mt-1 text-sm text-white/55">{sp.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
