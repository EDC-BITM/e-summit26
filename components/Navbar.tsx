"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  X,
  Home,
  Users,
  Calendar,
  MapPin,
  Mail,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Speakers", href: "/speakers", icon: Users },
  { label: "Events", href: "/events", icon: Calendar },
  { label: "Venue", href: "/venue", icon: MapPin },
  { label: "Contact", href: "/contact", icon: Mail },
];

const PILL_VARIANTS: Variants = {
  initial: { y: 0 },
  hover: { y: "-110%" },
};

const PILL_BG_VARIANTS: Variants = {
  initial: { y: "110%" },
  hover: { y: 0 },
};

const TRANSITION_CONFIG = {
  duration: 0.22,
  ease: "linear" as const,
};

const SIDEBAR_VARIANTS: Variants = {
  closed: {
    x: "100%",
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1],
    },
  },
};

const BACKDROP_VARIANTS: Variants = {
  closed: {
    opacity: 0,
    pointerEvents: "none",
  },
  open: {
    opacity: 1,
    pointerEvents: "auto",
  },
};

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
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center text-white"
    >
      <motion.div
        initial="initial"
        whileHover="hover"
        className="rounded-full relative bg-white/10 px-4 py-2 overflow-hidden transition-colors duration-500"
      >
        <motion.span
          variants={PILL_VARIANTS}
          transition={TRANSITION_CONFIG}
          className="block text-gray-200/80 will-change-transform"
        >
          {children}
        </motion.span>
        <motion.span
          variants={PILL_BG_VARIANTS}
          transition={TRANSITION_CONFIG}
          className="absolute inset-0 bg-[#733080] rounded-full flex items-center justify-center will-change-transform"
        >
          {children}
        </motion.span>
      </motion.div>
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [compact, setCompact] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const smoothJump = useMemo(
    () => (e: React.MouseEvent) => {
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
    },
    []
  );

  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      setIsSidebarOpen(false);

      setTimeout(() => {
        // ✅ Route navigation (e.g. /speakers)
        if (href.startsWith("/")) {
          router.push(href);
          return;
        }

        // ✅ In-page anchors
        if (href === "#top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    },
    [router]
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50",
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          compact
            ? [
                "bg-black/18",
                "backdrop-blur-md",
                "border-b border-white/8",
                "shadow-[0_10px_40px_rgba(0,0,0,0.25)]",
              ].join(" ")
            : "bg-transparent backdrop-blur-0 border-b border-transparent shadow-none"
        )}
        style={{
          willChange: compact
            ? "background, backdrop-filter, border-color, box-shadow"
            : "auto",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <div className="relative flex items-center">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 -translate-x-4",
                "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "opacity-100 translate-y-0"
              )}
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
                className="h-10 sm:h-12 w-auto select-none"
              />
            </Link>

            <div className="ml-auto flex items-center gap-4 pr-2 sm:pr-5">
              <nav
                className={cn(
                  "hidden md:flex items-center space-x-3",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  compact
                    ? "opacity-0 translate-x-10 pointer-events-none"
                    : "opacity-100 translate-x-0"
                )}
                aria-label="Primary"
                style={{ willChange: compact ? "auto" : "opacity, transform" }}
              >
                {LINKS.map((l) => (
                  <NavPill key={l.href} href={l.href} onClick={smoothJump}>
                    {l.label}
                  </NavPill>
                ))}
              </nav>

              <motion.button
                type="button"
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                className={cn(
                  "inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center",
                  compact
                    ? "rounded-full border border-white/12 bg-white/6 backdrop-blur-md"
                    : "rounded-full border border-white/15 bg-white/10 backdrop-blur-xl",
                  "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  compact
                    ? "opacity-100 translate-x-0"
                    : "opacity-100 translate-x-0 md:opacity-0 md:translate-x-4 md:pointer-events-none"
                )}
                onClick={toggleSidebar}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isSidebarOpen ? "open" : "closed"}
                  variants={{
                    closed: { rotate: 0 },
                    open: { rotate: 180 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isSidebarOpen ? (
                    <X size={20} className="text-white/90" />
                  ) : (
                    <div className="flex flex-col gap-1.25">
                      <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                      <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                      <span className="h-0.5 w-5 rounded-full bg-white/85 shadow-[0_0_18px_rgba(176,94,194,0.35)]" />
                    </div>
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={BACKDROP_VARIANTS}
              className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
              onClick={toggleSidebar}
              transition={{ duration: 0.3 }}
            />

            {/* ===== FIXED SIDEBAR (no cut, no scrollbar, better mobile sizing) ===== */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={SIDEBAR_VARIANTS}
              className="fixed right-0 top-0 z-70 h-svh w-full md:w-100 overflow-hidden bg-linear-to-b from-black/95 to-black backdrop-blur-xl border-l border-white/10 shadow-2xl"
              style={{
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-[clamp(14px,2.2vh,20px)] border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Image
                      width={120}
                      height={120}
                      src="/esummit_logo.png"
                      alt="E-Summit 26"
                      className="h-10 w-auto"
                    />
                    {/* <span className="text-xl font-bold text-white">Menu</span> */}
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                    aria-label="Close menu"
                  >
                    <X size={24} className="text-white" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 min-h-0 px-6 py-[clamp(14px,3vh,30px)]">
                  {/* NOTE: no overflow-y-auto (no scrollbar). We instead clamp paddings + sizes so it always fits. */}
                  <div className="h-full flex flex-col justify-start gap-[clamp(6px,1.1vh,12px)]">
                    {/* Links */}
                    {LINKS.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={cn(
                            "group flex items-center gap-4 rounded-2xl px-5 py-[clamp(14px,2.6vh,18px)] transition-all duration-300 active:scale-[0.98] relative overflow-hidden",
                            isActive
                              ? "bg-linear-to-r from-[#733080]/20 via-[#733080]/10 to-transparent shadow-[0_0_20px_rgba(115,48,128,0.15)]"
                              : "hover:bg-white/10"
                          )}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-linear-to-b from-transparent via-[#733080] to-transparent rounded-r-full" />
                          )}
                          <div
                            className={cn(
                              "grid place-items-center rounded-xl bg-linear-to-br transition-all duration-300",
                              isActive
                                ? "from-[#733080] to-[#733080]/70 shadow-[0_0_15px_rgba(115,48,128,0.4)]"
                                : "from-white/5 to-white/2 group-hover:from-[#733080] group-hover:to-[#733080]/70"
                            )}
                            style={{
                              width: "clamp(46px, 6vh, 56px)",
                              height: "clamp(46px, 6vh, 56px)",
                            }}
                          >
                            <Icon
                              size={24}
                              className={cn(
                                "transition-all duration-300",
                                isActive
                                  ? "text-white"
                                  : "text-white/80 group-hover:text-white"
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <span
                              className={cn(
                                "font-semibold text-[clamp(18px,2.4vh,22px)] transition-all duration-300",
                                isActive ? "text-white" : "text-white/90"
                              )}
                            >
                              {link.label}
                            </span>
                          </div>
                          {isActive ? (
                            <div className="w-2 h-2 rounded-full bg-[#733080] shadow-[0_0_8px_rgba(115,48,128,0.6)]" />
                          ) : (
                            <ChevronRight
                              size={24}
                              className="text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all duration-300"
                            />
                          )}
                        </a>
                      );
                    })}
                  </div>
                </nav>

                {/* Removed the bottom “E-Summit 2025” pill completely (as requested) */}
                <div
                  className="border-t border-white/10"
                  style={{
                    paddingBottom: "max(12px, env(safe-area-inset-bottom))",
                  }}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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

        /* Touch improvements for mobile */
        @media (max-width: 640px) {
          .rb-pill {
            height: 2.5rem;
            font-size: 0.95rem;
            padding-left: 1.3rem;
            padding-right: 1.3rem;
          }

          body.sidebar-open {
            overflow: hidden;
            position: fixed;
            width: 100%;
          }
        }

        aside a {
          -webkit-tap-highlight-color: rgba(255, 255, 255, 0.1);
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}
