"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "framer-motion";
import { getHeroScrollPhases } from "@/lib/hero-scroll-phases";

const HeroModel3D = dynamic(
  () => import("@/components/HeroModel3D").then((mod) => mod.default),
  { ssr: false }
);

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollProgress = useCallback(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const scrollable = Math.max(hero.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [updateScrollProgress]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (reduceMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setPointer({
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
      });
    },
    [reduceMotion]
  );

  const handlePointerLeave = useCallback(() => {
    setPointer({ x: 0, y: 0 });
  }, []);

  const phases = getHeroScrollPhases(
    reduceMotion ? (scrollProgress > 0.5 ? 1 : 0) : scrollProgress
  );

  const heroLayerOpacity = 1 - phases.heroConclude;

  const heroStyle = {
    "--hero-scroll": phases.eased,
    "--hero-model-corner": phases.modelToCorner,
    "--hero-model-center": phases.modelToCenter,
    "--hero-conclude": phases.heroConclude,
    background: `rgba(8, 9, 12, ${heroLayerOpacity})`,
  } as CSSProperties;

  useEffect(() => {
    const section = heroRef.current?.closest(
      ".journey-section"
    ) as HTMLElement | null;
    if (!section) return;
    section.style.setProperty("--hero-scroll", String(phases.eased));
    section.style.zIndex = phases.heroConclude > 0.08 ? "20" : "1";
  }, [phases.eased, phases.heroConclude]);

  return (
    <header
      className="hero"
      id="top"
      ref={heroRef}
      style={heroStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="hero-bg" aria-hidden="true" style={{ opacity: heroLayerOpacity }}>
        <div className="hero-scrim" />
        <div className="hero-glow" />
      </div>

      <div
        className="hero-text-scrim"
        aria-hidden="true"
        style={{ opacity: heroLayerOpacity }}
      />

      <div
        className="hero-model"
        aria-hidden="true"
        style={{ opacity: heroLayerOpacity }}
      >
        <HeroModel3D
          pointer={pointer}
          scrollProgress={scrollProgress}
          reduceMotion={reduceMotion}
        />
      </div>

      <div
        className="hero-stage"
        style={{ opacity: heroLayerOpacity }}
      >
        <div
          className="hero-copy"
          style={{
            opacity: Math.max(0, 1 - phases.introLift * 1.35),
            visibility: phases.introLift < 0.92 ? "visible" : "hidden",
            transform: `translateY(calc(${-phases.introLift * 58} * 1vh))`,
          }}
        >
          <h1 className="hero-title">The Next Chapter Starts Here</h1>
          <p className="hero-sub">
            One community. One vision. Limitless growth.
          </p>
        </div>

        <div
          className="hero-meta hero-meta--intro"
          style={{
            opacity: Math.max(0, 1 - phases.metaLift * 1.4),
            visibility: phases.metaLift < 0.9 ? "visible" : "hidden",
            transform: `translateY(calc(${-phases.metaLift * 92} * 1vh))`,
          }}
        >
          <p className="hero-meta-row hero-meta-date">
            <svg
              className="hero-meta-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="3"
                width="12"
                height="11"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.25" />
              <path
                d="M5 1.5v3M11 1.5v3"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
            </svg>
            <span>Dec 10&ndash;12, 2027</span>
          </p>
          <p className="hero-meta-row hero-meta-loc">
            <svg
              className="hero-meta-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 14s4.5-3.2 4.5-7A4.5 4.5 0 1 0 3.5 7C3.5 10.8 8 14 8 14Z"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="7" r="1.5" fill="currentColor" />
            </svg>
            <span>Phoenix, Arizona</span>
          </p>
        </div>

        <aside
          className="hero-handoff-copy"
          aria-label="Convention story"
          style={{
            opacity: phases.handoffEnter * (1 - phases.handoffExit),
            visibility: phases.handoffVisible ? "visible" : "hidden",
            transform: `translate(-50%, calc(-50% + ${phases.handoffY} * 1vh))`,
          }}
        >
          <p className="hero-handoff-statement">
            Here We Grow is the Signal franchise convention where our network
            gathers to shape culture, share strategy, and write the next chapter
            together.
          </p>
        </aside>
      </div>
    </header>
  );
}
