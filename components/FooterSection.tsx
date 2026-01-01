// app/components/FooterSection.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

const LINKS: NavLink[] = [
  { label: "Speakers", href: "/speakers" },
  { label: "Events", href: "/events" },
  { label: "Venue", href: "/venue" },
  { label: "Contact", href: "/contact" },
];

function NavPill({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center",
        "h-11 px-8 rounded-full",
        "bg-white/15 border border-white/10",
        "text-white/90 text-sm font-medium",
        "backdrop-blur-xl",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:bg-white/20 hover:border-white/15 hover:text-white",
        "active:scale-[0.98]"
      )}
    >
      {children}
    </Link>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "grid place-items-center",
        "h-11 w-11 rounded-full",
        "border border-white/25 bg-white/0",
        "text-white/90",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:bg-white/10 hover:border-white/35 hover:text-white",
        "active:scale-[0.98]"
      )}
    >
      {children}
    </Link>
  );
}

export default function FooterSection() {
  return (
    <footer className="relative w-full bg-black text-white">
      {/* Upper Section - Socials & Navigation (solid black) */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex items-start justify-between gap-6 pt-12">
          <div>
            <div className="text-sm font-medium text-white/90">Our Socials</div>
            <div className="mt-4 flex items-center gap-4">
              <SocialIcon
                href="https://www.facebook.com/edcbitmesra/"
                label="Facebook"
              >
                <Facebook size={18} />
              </SocialIcon>
              <SocialIcon
                href="https://www.instagram.com/edcbitmesra/"
                label="Instagram"
              >
                <Instagram size={18} />
              </SocialIcon>
              <SocialIcon
                href="https://www.linkedin.com/company/edcbitmesra/"
                label="LinkedIn"
              >
                <Linkedin size={18} />
              </SocialIcon>
            </div>
          </div>

          {/* Desktop pills aligned to icon row */}
          <nav
            className="hidden md:flex items-center gap-3 mt-4"
            aria-label="Footer navigation"
          >
            {LINKS.map((l) => (
              <NavPill key={l.href} href={l.href}>
                {l.label}
              </NavPill>
            ))}
          </nav>
        </div>

        {/* Mobile pills */}
        <nav
          className="mt-8 flex flex-wrap gap-3 md:hidden"
          aria-label="Footer navigation mobile"
        >
          {LINKS.map((l) => (
            <NavPill key={l.href} href={l.href}>
              {l.label}
            </NavPill>
          ))}
        </nav>

        <div className="mt-10 h-px w-full bg-white/10" />
      </div>

      {/* Lower Section - Background & Copyright (starts from divider) */}
      <div className="relative isolate min-h-[60vh] w-full overflow-hidden">
        {/* Background (shorter, covers only lower section) */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              width: "90vh",
              height: "90vw",
              transform:
                "translate(-50%, -50%) rotate(90deg) scale(1.1) translateZ(0)",
              transformOrigin: "center",
              willChange: "transform",
            }}
          >
            <Image
              src="/FooterBG.jpg"
              alt="Footer Background"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{
                filter: "brightness(1.12) contrast(1.05) saturate(1.10)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>

          {/* Light overlays */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/60" />

          {/* Subtle brand glow */}
          <div className="absolute -right-40 -bottom-40 h-100 w-100 rounded-full bg-[#B05EC2]/22 blur-[120px]" />
          <div className="absolute -left-40 -top-40 h-100 w-100 rounded-full bg-[#B05EC2]/16 blur-[120px]" />
        </div>

        {/* Copyright Content - Moved above the logo */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-10">
          <div className="flex flex-col gap-6 text-sm text-white/90 md:flex-row md:items-center md:justify-between">
            <div>All copyrights @2025 EDC, BIT Mesra</div>
            <div className="md:text-right">Designed By Team EDC</div>
          </div>
        </div>

        {/* Full width logo - Updated to be full width */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-[45vh] w-full">
          <Image
            src="/esummit_logo.png"
            alt="E-Summit Logo"
            fill
            className="object-contain object-bottom opacity-[0.8] mix-blend-screen"
            priority
            sizes="100vw"
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </footer>
  );
}
