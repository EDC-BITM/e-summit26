"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScrolling() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
