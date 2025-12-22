// app/components/VenueReveal.tsx
"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import AnimatedBlurText from "./AnimatedBlurText";

type Thumb = { src: string; alt: string };

const ease = [0.22, 1, 0.36, 1] as const;

function StaggerWrap({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
            }}
        >
            {children}
        </motion.div>
    );
}

function Reveal({
    children,
    y = 14,
    delay = 0,
}: {
    children: React.ReactNode;
    y?: number;
    delay?: number;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y, filter: "blur(6px)" },
                show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, ease, delay },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export default function VenueReveal() {
    const thumbs = useMemo<Thumb[]>(
        () => [
            {
                src: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80",
                alt: "Venue greenery",
            },
            {
                src: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80",
                alt: "City lights",
            },
        ],
        []
    );

    return (
        <section id="venue" className="w-full bg-black text-white">
            <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-20">
                {/* Header */}
                <StaggerWrap>
                    <Reveal y={10}>
                        <div className="flex items-center gap-3 text-white/85">
                            <span className="h-px w-10 bg-white/80" />
                            <span className="text-xs font-semibold tracking-[0.22em] uppercase">
                                Event Venue
                            </span>
                        </div>
                    </Reveal>

                
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
                                lines={["Explore the E-summit", " "]}
                                liteText="Venues and Locations"
                            />
                        </h2>
                </StaggerWrap>

                {/* Hero image */}
                <div className="mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.8, ease }}
                        className="relative w-full overflow-hidden bg-black"
                    >
                        {/* Main photo */}
                        <div className="relative h-[360px] sm:h-[460px] md:h-[520px] lg:h-[560px] w-full">
                            <img
                                src="https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=2400&q=80"
                                alt="Marina Bay Sands, Singapore"
                                draggable={false}
                                className="h-full w-full object-cover"
                            />

                            {/* Image bottom fade (like ref) */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-black" />

                            {/* Top-right label */}
                            <motion.div
                                initial={{ opacity: 0, x: 18, y: 6, filter: "blur(8px)" }}
                                whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: true, amount: 0.35 }}
                                transition={{ duration: 0.7, ease, delay: 0.05 }}
                                className="
                  absolute
                  right-6 top-8
                  sm:right-10 sm:top-10
                  max-w-[520px]
                  text-right
                  font-['Inter',ui-sans-serif,system-ui]
                  text-2xl sm:text-3xl md:text-4xl
                  font-semibold
                  leading-[1.12]
                  tracking-tight
                  text-white
                "
                                style={{
                                    textShadow:
                                        "0 10px 60px rgba(0,0,0,0.65), 0 0 24px rgba(0,0,0,0.35)",
                                }}
                            >
                                <div>Marin bay Conventional centre,</div>
                                <div>Singapore</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Body text */}
                <div className="mt-10">
                    <StaggerWrap delay={0.05}>
                        <Reveal y={12}>
                            <p className="max-w-4xl text-sm sm:text-base leading-relaxed text-white/85">
                                The Alcron Tech Summit is the ultimate gathering for tech enthusiasts,
                                industry leaders, and innovators to delve into the world of AI, machine
                                learning, and the future of emerging technologies. This summit offers a
                                unique opportunity to hear from top experts, engage in insightful
                                discussions, and explore groundbreaking AI innovations. Whether youre a
                                startup founder, developer,
                            </p>
                        </Reveal>

                        <Reveal y={12}>
                            <p className="mt-6 max-w-4xl text-sm sm:text-base leading-relaxed text-white/85">
                                You will have the chance to explore real-world use cases, witness
                                cutting-edge demos, and connect with others who are driving change in the
                                tech world. Be part of the conversation thats shaping the future.
                            </p>
                        </Reveal>
                    </StaggerWrap>
                </div>

                {/* Thumbnails */}
                <div className="mt-12">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={{
                            hidden: {},
                            show: { transition: { staggerChildren: 0.1 } },
                        }}
                        className="grid gap-10 md:grid-cols-3"
                    >
                        {thumbs.map((t) => (
                            <motion.div
                                key={t.src}
                                variants={{
                                    hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
                                    show: {
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                        transition: { duration: 0.8, ease },
                                    },
                                }}
                                className="
                  overflow-hidden
                  rounded-[26px]
                  bg-white/[0.03]
                  ring-1 ring-white/10
                  shadow-[0_28px_120px_rgba(0,0,0,0.75)]
                "
                            >
                                <div className="relative aspect-[16/10] w-full">
                                    <img
                                        src={t.src}
                                        alt={t.alt}
                                        draggable={false}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
