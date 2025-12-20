"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const LINKS = [
  { label: "Speakers", href: "#speakers" },
  { label: "Events", href: "#events" },
  { label: "Venue", href: "#venue" },
  { label: "Contact", href: "#contact" },
];

function NavPill({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <a href={href} onClick={onClick} className="flex items-center text-white">
      <motion.div
        initial="initial"
        whileHover="hover"
        className="rounded-full relative bg-white/10 px-4 py-2 overflow-hidden transition-colors duration-500"
      >
        <motion.span
          variants={{
            initial: { y: 0 },
            hover: { y: "-110%" },
          }}
          transition={{ duration: 0.22, ease: "linear" }}
          className="block text-gray-200/80 will-change-transform"
        >
          {children}
        </motion.span>
        <motion.span
          variants={{
            initial: { y: "110%" },
            hover: { y: 0 },
          }}
          transition={{ duration: 0.22, ease: "linear" }}
          className="absolute inset-0 bg-[#733080] rounded-full flex items-center justify-center will-change-transform"
        >
          {children}
        </motion.span>
      </motion.div>
    </a>
  );
}

export default function Navbar() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothJump = (e: React.MouseEvent) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    e.preventDefault();

    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.querySelector(href);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className={[
          "fixed left-0 right-0 top-0 z-50",
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          // Bar should only appear after scroll
          compact
            ? [
                "bg-black/18", // reduced opacity
                "backdrop-blur-md", // reduced blur
                "border-b border-white/8",
                "shadow-[0_10px_40px_rgba(0,0,0,0.25)]",
              ].join(" ")
            : "bg-transparent backdrop-blur-0 border-b border-transparent shadow-none",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-1 py-4">
          <div className="relative flex items-center">
            {/* Left logo */}
            <a
              href="#top"
              onClick={smoothJump}
              className={[
                "flex items-center gap-3 -translate-x-4",
                "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "opacity-100 translate-y-0",
              ].join(" ")}
              aria-label="Home"
            >
              <Image
                width={200}
                height={200}
                priority={true}
                loading="eager"
                src="/esummit_logo.png"
                alt="E-Summit 26"
                draggable={false}
                className="h-12 w-auto select-none"
              />
            </a>

            {/* Right side controls */}
            <div className="ml-auto flex items-center gap-4 pr-5">
              {/* Pills (desktop only; slide out on scroll) */}
              <nav
                className={[
                  "hidden md:flex items-center space-x-3",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  compact
                    ? "opacity-0 translate-x-10 pointer-events-none"
                    : "opacity-100 translate-x-0",
                ].join(" ")}
                aria-label="Primary"
              >
                {LINKS.map((l) => (
                  <NavPill key={l.href} href={l.href} onClick={smoothJump}>
                    {l.label}
                  </NavPill>
                ))}
              </nav>

              {/* Hamburger (unchanged behavior) */}
              <button
                type="button"
                aria-label="Menu"
                className={[
                  "inline-flex h-11 w-11 items-center justify-center",
                  // slightly softer when compact so it merges with bar nicely
                  compact
                    ? "rounded-full border border-white/12 bg-white/6 backdrop-blur-md"
                    : "rounded-full border border-white/15 bg-white/10 backdrop-blur-xl",
                  "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  compact
                    ? "opacity-100 translate-x-0"
                    : "opacity-100 translate-x-0 md:opacity-0 md:translate-x-4 md:pointer-events-none",
                ].join(" ")}
              >
                <span className="sr-only">Open menu</span>
                <span className="flex flex-col gap-1.25">
                  <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                  <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                  <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hover animation CSS (unchanged) */}
      <style jsx global>{`
        .rb-pill {
          position: relative;
          display: inline-flex;
          height: 3rem;
          align-items: center;
          border-radius: 9999px;
          padding-left: 1.7rem;
          padding-right: 1.7rem;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial;
          font-size: 1.05rem;
          font-weight: 640;
          letter-spacing: -0.04em;
          color: rgba(255, 255, 255, 0.92);
          text-decoration: none;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .rb-inner,
        .rb-inner-hover,
        .rb-inner-static {
          pointer-events: none;
          display: block;
        }

        .rb-inner {
          position: relative;
          z-index: 2;
        }

        .rb-inner-hover {
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          transform: translateY(70%);
        }

        .rb-bg {
          overflow: hidden;
          border-radius: 9999px;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scale(1);
          transition: transform 1.6s cubic-bezier(0.19, 1, 0.22, 1);
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(10px);
        }

        .rb-bg-layers {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -60%;
          aspect-ratio: 1 / 1;
          width: max(210%, 10rem);
        }

        .rb-bg-layer {
          border-radius: 9999px;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform: scale(0);
          opacity: 1;
        }

        .rb-bg-layer.-blue {
          background: rgba(92, 130, 255, 0.92);
        }

        .rb-bg-layer.-purple {
          background: rgba(142, 76, 190, 0.92);
        }

        .rb-pill:hover .rb-inner-static {
          opacity: 0;
          transform: translateY(-70%);
          transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1),
            opacity 0.25s linear;
        }

        .rb-pill:hover .rb-inner-hover {
          opacity: 1;
          transform: translateY(0);
          transition: transform 1.2s cubic-bezier(0.19, 1, 0.22, 1),
            opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .rb-pill:hover .rb-bg-layer {
          transition: transform 1.1s cubic-bezier(0.19, 1, 0.22, 1),
            opacity 0.25s linear;
        }

        .rb-pill:hover .rb-bg-layer-1 {
          transform: scale(1);
        }

        .rb-pill:hover .rb-bg-layer-2 {
          transition-delay: 0.08s;
          transform: scale(1);
        }
      `}</style>
    </>
  );
}
