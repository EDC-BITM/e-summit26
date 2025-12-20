// app/components/Questions.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";

type FAQ = { q: string; a: string };

export default function Questions() {
  const faqs = useMemo<FAQ[]>(
    () => [
      {
        q: "How can I register for the E-Summit'26?",
        a: "The website contains the link for each event which will redirect you to bharatversity from where you can register for all the events.",
      },
      {
        q: "How many members can form a team?",
        a: "One to four members can participate depending upon the event.",
      },
      {
        q: "What is the dress code for the event?",
        a: "The dress code for the Summit is business casual. Feel free to wear something comfortable, but professional, as you'll be networking and engaging with industry leaders and experts.",
      },
      {
        q: "Can I submit my project or research for the summit?",
        a: "While we are not accepting formal submissions for this year's summit, there will be ample networking time where you can share your project or research with fellow attendees and speakers to get feedback and insights.",
      },
      {
        q: "How can I become a sponsor or exhibitor at the event?",
        a: 'To explore sponsorship or exhibitor opportunities, please visit the "Sponsorship" section on our website. Fill out the inquiry form, and our team will get back to you with detailed information about packages and benefits.',
      },
      {
        q: "Will there be opportunities for networking at the summit?",
        a: "Absolutely! The summit includes dedicated networking breaks, lunch sessions, and after-event mixers. You'll have plenty of opportunities to connect with speakers, fellow attendees, and industry leaders in both formal and informal settings.",
      },
    ],
    []
  );

  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <section id="questions" className="w-full bg-black text-white">
      {/* wider container so RIGHT cards get more x-space */}
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-start">
          {/* LEFT */}
          <div>
            <div className="flex items-center gap-3 text-white/85">
              <span className="h-px w-12 bg-white/80" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                Questions
              </span>
            </div>

            {/* heading slightly smaller + more consistent */}
            <h2
              className="
                mt-8
                font-['Inter',ui-sans-serif,system-ui]
                text-4xl sm:text-5xl md:text-6xl
                leading-[1.06]
                tracking-tight
                font-bold
              "
            >
              <span className="block">All the Important</span>
              <span className="block">Details Before Attending</span>
              <span className="block text-white/30 mt-2">E-Summit&apos;26</span>
            </h2>
          </div>

          {/* RIGHT */}
          {/* a bit wider on large screens, so cards breathe on x-axis */}
          <div className="space-y-6 lg:pl-4">
            {faqs.map((item, idx) => {
              const open = idx === openIdx;

              return (
                <div
                  key={item.q}
                  className={[
                    "rounded-2xl",
                    "border border-white/10",
                    "bg-gradient-to-br from-white/[0.04] to-white/[0.02]",
                    "shadow-[0_28px_100px_rgba(0,0,0,0.8)]",
                    "backdrop-blur-xl",
                    "transition-all duration-300",
                    "hover:border-white/15",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? -1 : idx)}
                    className={[
                      "w-full",
                      "px-8 py-7",
                      "flex items-center justify-between gap-8",
                      "text-left",
                      "transition-all duration-300",
                    ].join(" ")}
                    aria-expanded={open}
                  >
                    <div
                      className={[
                        "font-['Inter',ui-sans-serif,system-ui]",
                        "text-lg sm:text-xl",
                        "font-bold tracking-tight",
                        "leading-tight",
                        open ? "text-white" : "text-white/90",
                      ].join(" ")}
                    >
                      {item.q}
                    </div>

                    <span
                      className={[
                        "shrink-0",
                        "grid place-items-center",
                        "h-14 w-14 rounded-full",
                        "bg-white/[0.08] border border-white/15",
                        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        open ? "bg-white/[0.15] border-white/25" : "",
                        "hover:bg-white/[0.12]",
                      ].join(" ")}
                    >
                      <span className="relative h-6 w-6">
                        <Plus
                          size={22}
                          strokeWidth={2.5}
                          className={[
                            "absolute inset-0 m-auto",
                            "text-white",
                            "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            open
                              ? "opacity-0 scale-90 rotate-90"
                              : "opacity-100 scale-100 rotate-0",
                          ].join(" ")}
                        />
                        <Minus
                          size={22}
                          strokeWidth={2.5}
                          className={[
                            "absolute inset-0 m-auto",
                            "text-white",
                            "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            open
                              ? "opacity-100 scale-100 rotate-0"
                              : "opacity-0 scale-90 -rotate-90",
                          ].join(" ")}
                        />
                      </span>
                    </span>
                  </button>

                  <div
                    className={[
                      "grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <div className="px-8 pb-8 -mt-2">
                        <p
                          className="
                            font-['Inter',ui-sans-serif,system-ui]
                            text-base
                            leading-relaxed
                            text-white/70
                            font-medium
                          "
                        >
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
