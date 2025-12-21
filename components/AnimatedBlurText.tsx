"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface AnimatedBlurTextProps {
  lines: string[];
  liteText?: string;
  className?: string;
  charDelay?: number;
  duration?: number;
  inView?: boolean;
}

export default function AnimatedBlurText({
  lines,
  liteText,
  className = "",
  charDelay = 0.03,
  duration = 0.8,
}: AnimatedBlurTextProps) {
  // Calculate total length of all lines except the last one for delay calculation
  const getTotalPreviousLength = (lineIdx: number): number => {
    return lines.slice(0, lineIdx).reduce((acc, line) => acc + line.length, 0);
  };

  // Memoize animation variants to prevent recreation on every render
  const charVariants = useMemo(
    () => ({
      hidden: { opacity: 0, filter: "blur(8px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    }),
    []
  );

  const easing = useMemo(() => [0.22, 1, 0.36, 1] as const, []);

  return (
    <motion.div className={className}>
      {lines.map((line, lineIdx) => {
        const previousCharsCount = getTotalPreviousLength(lineIdx);
        const isLastLine = lineIdx === lines.length - 1;

        return (
          <div aria-hidden key={lineIdx}>
            {line.split("").map((char, charIdx) => (
              <motion.span
                aria-hidden
                key={`char-${lineIdx}-${charIdx}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                variants={charVariants}
                transition={{
                  duration,
                  ease: easing,
                  delay: (previousCharsCount + charIdx) * charDelay,
                }}
                style={{ willChange: "opacity, filter" }}
              >
                {char}
              </motion.span>
            ))}
            {isLastLine && liteText && (
              <motion.span
                aria-hidden
                key={`lite-text-${lineIdx}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                variants={charVariants}
                transition={{
                  duration: 0.5,
                  ease: easing,
                  delay: (previousCharsCount + line.length + 1) * charDelay,
                }}
                className="text-white/30"
                style={{ willChange: "opacity, filter" }}
              >
                {liteText}
              </motion.span>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
