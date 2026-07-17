"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import { loadGsap } from "@/lib/load-gsap";
import { TRAVEL_ARRIVAL_STEPS } from "@/lib/travel-info";

const FADE = { once: false as const, amount: 0.22 };

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {direction === "right" ? (
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M13 8H3M7 4L3 8l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function TravelArrivalGuide() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const triggerRef = useRef<ScrollTriggerType | null>(null);
  const [staticLayout, setStaticLayout] = useState(false);
  const [progress, setProgress] = useState(0);
  const [staticProgress, setStaticProgress] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const scroll = scrollRef.current;
    const track = trackRef.current;
    if (!section || !pin || !scroll || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobile = window.matchMedia("(max-width: 900px)").matches;

    if (reduceMotion || mobile) {
      setStaticLayout(true);
      return;
    }

    setStaticLayout(false);

    let disposed = false;
    let revert: (() => void) | undefined;
    let removeListeners: (() => void) | undefined;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (disposed) return;

      const getTravel = () =>
        Math.max(0, track.scrollWidth - scroll.clientWidth);

      if (getTravel() < 40) {
        setStaticLayout(true);
        return;
      }

      const ctx = gsap.context(() => {
        gsap.set(track, { x: 0 });

        const tween = gsap.to(track, {
          x: () => -getTravel(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${Math.max(window.innerHeight, getTravel() * 1.15)}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setProgress(self.progress),
          },
        });

        triggerRef.current = tween.scrollTrigger ?? null;
      }, section);

      revert = () => {
        triggerRef.current = null;
        ctx.revert();
      };

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      removeListeners = () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
      };

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      disposed = true;
      revert?.();
      removeListeners?.();
    };
  }, []);

  useLayoutEffect(() => {
    if (!staticLayout) return;
    const scroll = scrollRef.current;
    if (!scroll) return;

    const onScroll = () => {
      const max = Math.max(1, scroll.scrollWidth - scroll.clientWidth);
      setStaticProgress(scroll.scrollLeft / max);
    };

    onScroll();
    scroll.addEventListener("scroll", onScroll, { passive: true });
    return () => scroll.removeEventListener("scroll", onScroll);
  }, [staticLayout]);

  const activeProgress = staticLayout ? staticProgress : progress;
  const canGoBack = activeProgress > 0.02;
  const canGoForward = activeProgress < 0.98;

  const moveSection = (direction: "left" | "right") => {
    const dir = direction === "right" ? 1 : -1;

    if (staticLayout) {
      const scroll = scrollRef.current;
      if (!scroll) return;
      const panel = scroll.querySelector(
        ".travel-arrival-panel"
      ) as HTMLElement | null;
      const amount = panel?.offsetWidth ?? Math.round(scroll.clientWidth * 0.7);
      scroll.scrollBy({ left: dir * amount, behavior: "smooth" });
      return;
    }

    const st = triggerRef.current;
    if (!st) return;

    const range = st.end - st.start;
    const steps = Math.max(1, TRAVEL_ARRIVAL_STEPS.length - 1);
    const step = range / steps;
    const next = Math.min(
      st.end,
      Math.max(st.start, window.scrollY + dir * step)
    );

    if (window.__lenis) {
      window.__lenis.scrollTo(next);
    } else {
      window.scrollTo({ top: next, behavior: "smooth" });
    }
  };

  return (
    <section
      id="arrival"
      className={`travel-arrival page-surface--dark${
        staticLayout ? " travel-arrival--static" : ""
      }`}
      ref={sectionRef}
      aria-labelledby="travel-arrival-heading"
    >
      <div className="travel-arrival-pin" ref={pinRef}>
        <div className="travel-arrival-head wrap">
          <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
            <p className="travel-arrival-kicker">
              <span aria-hidden="true">•</span> Arrival Guide
            </p>
            <h2
              className="travel-arrival-heading"
              id="travel-arrival-heading"
            >
              Before You Arrive
            </h2>
          </Reveal>
        </div>

        <div
          className="travel-arrival-scroll"
          ref={scrollRef}
          tabIndex={staticLayout ? 0 : -1}
        >
          <ol className="travel-arrival-panels" ref={trackRef}>
            {TRAVEL_ARRIVAL_STEPS.map((step, index) => {
              const num = String(index + 1).padStart(2, "0");
              return (
                <li key={step.title} className="travel-arrival-panel">
                  <div className="travel-arrival-panel-top">
                    <span className="travel-arrival-num" aria-hidden="true">
                      {num}
                    </span>
                    <h3 className="travel-arrival-title">{step.title}</h3>
                  </div>
                  {step.detail ? (
                    <p className="travel-arrival-detail">{step.detail}</p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        {canGoBack ? (
          <button
            type="button"
            className="travel-arrival-arrow travel-arrival-arrow--left"
            onClick={() => moveSection("left")}
            aria-label="Previous arrival step"
          >
            <ArrowIcon direction="left" />
          </button>
        ) : null}

        {canGoForward ? (
          <button
            type="button"
            className="travel-arrival-arrow travel-arrival-arrow--right"
            onClick={() => moveSection("right")}
            aria-label="Next arrival step"
          >
            <ArrowIcon direction="right" />
          </button>
        ) : null}
      </div>
    </section>
  );
}
