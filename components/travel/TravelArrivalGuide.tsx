"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import { loadGsap } from "@/lib/load-gsap";
import { TRAVEL_ARRIVAL_STEPS } from "@/lib/travel-info";

const FADE = { once: false as const, amount: 0.22 };

export default function TravelArrivalGuide() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [staticLayout, setStaticLayout] = useState(false);

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

        gsap.to(track, {
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
          },
        });
      }, section);

      revert = () => ctx.revert();

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
      </div>
    </section>
  );
}
