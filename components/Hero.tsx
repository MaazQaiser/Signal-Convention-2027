"use client";

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
/* Eager — LoadingGate also imports this so the model warms under the cover */
import HeroModel3D from "@/components/HeroModel3D";

/** Explicit lines so each fills L→R (not a vertical wipe across the block). */
const HANDOFF_LINES = [
  "Here We Grow is the Signal",
  "franchise convention where",
  "our network gathers to",
  "shape culture, share strategy,",
  "and write the next chapter",
  "together.",
] as const;

function lineFillPercent(progress: number, index: number, total: number) {
  const t = Math.min(1, Math.max(0, progress));
  /* Strict sequence: finish one line before the next starts */
  const span = 1 / total;
  const start = index * span;
  const end = (index + 1) * span;
  const local = Math.min(1, Math.max(0, (t - start) / (end - start)));
  return local * 100;
}

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

  /* UI fades out; model stays until whiteout covers the dive */
  const stageOpacity = Math.max(
    0,
    1 - Math.max(phases.heroConclude, phases.modelZoom * 0.35)
  );
  const bgOpacity = Math.max(0, 1 - phases.whiteOut);
  const modelOpacity = Math.max(0, 1 - phases.whiteOut * 0.15);

  const heroStyle = {
    "--hero-scroll": phases.eased,
    "--hero-model-corner": phases.modelToCorner,
    "--hero-model-center": phases.modelToCenter,
    "--hero-model-zoom": phases.modelZoom,
    "--hero-conclude": phases.heroConclude,
    "--hero-whiteout": phases.whiteOut,
  } as CSSProperties;

  useEffect(() => {
    const section = heroRef.current?.closest(
      ".journey-section"
    ) as HTMLElement | null;
    if (!section) return;
    section.style.setProperty("--hero-scroll", String(phases.eased));
    section.style.setProperty(
      "--hero-seam",
      String(Math.max(phases.whiteOut, phases.heroConclude))
    );
  }, [phases.eased, phases.whiteOut, phases.heroConclude]);

  return (
    <header
      className="hero"
      id="top"
      ref={heroRef}
      style={heroStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="hero-bg"
        aria-hidden="true"
        style={{ opacity: bgOpacity }}
      >
        <div className="hero-scrim" />
        <div className="hero-glow" />
      </div>

      <div
        className="hero-text-scrim"
        aria-hidden="true"
        style={{ opacity: bgOpacity }}
      />

      <div
        className="hero-model"
        aria-hidden="true"
        style={{ opacity: modelOpacity }}
      >
        <div className="hero-model-inner">
          <HeroModel3D
            pointer={pointer}
            scrollProgress={scrollProgress}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>

      <div className="hero-stage" style={{ opacity: stageOpacity }}>
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
            transform: `translate3d(0, calc(-50% + ${phases.handoffY} * 1vh), 0)`,
          }}
        >
          <p className="hero-handoff-statement">
            {HANDOFF_LINES.map((line, index) => (
              <span
                key={line}
                className="hero-handoff-line"
                style={
                  {
                    "--line-fill": `${
                      reduceMotion
                        ? 100
                        : lineFillPercent(
                            phases.handoffFill,
                            index,
                            HANDOFF_LINES.length
                          )
                    }%`,
                  } as CSSProperties
                }
              >
                {line}
              </span>
            ))}
          </p>
        </aside>
      </div>

      <div
        className="hero-whiteout"
        aria-hidden="true"
        style={{ opacity: phases.whiteOut }}
      />
    </header>
  );
}
