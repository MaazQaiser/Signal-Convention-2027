"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type Lenis from "lenis";
import "lenis/dist/lenis.css";
import { loadGsap, refreshScrollTrigger } from "@/lib/load-gsap";

type SmoothScrollProps = {
  /** When false, Lenis is stopped (loader / exiting). */
  active: boolean;
};

export default function SmoothScroll({ active }: SmoothScrollProps) {
  const reduceMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add("lenis-reduced");
      return () => {
        document.documentElement.classList.remove("lenis-reduced");
      };
    }

    document.documentElement.classList.remove("lenis-reduced");

    let disposed = false;
    let removeTicker: (() => void) | undefined;
    let removeResize: (() => void) | undefined;

    void (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadGsap(),
      ]);

      if (disposed) return;

      const lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      removeTicker = () => {
        gsap.ticker.remove(tick);
      };

      const onResize = () => {
        lenis.resize();
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);
      removeResize = () => window.removeEventListener("resize", onResize);

      if (activeRef.current) {
        lenis.start();
        ScrollTrigger.refresh();
      } else {
        lenis.stop();
      }
    })();

    return () => {
      disposed = true;
      removeTicker?.();
      removeResize?.();
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = lenisRef.current;
    if (!lenis) return;

    if (active) {
      lenis.start();
      void refreshScrollTrigger();
    } else {
      lenis.stop();
    }
  }, [active, reduceMotion]);

  return null;
}
