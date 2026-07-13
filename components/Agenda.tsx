"use client";

import { useEffect, useRef, useState } from "react";
import Reveal, { REVEAL_CASCADE } from "./Reveal";

const TARGET = new Date("2027-01-17T08:30:00-07:00").getTime();

const COUNTDOWN_UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "mins", label: "Minutes" },
  { key: "secs", label: "Seconds" },
] as const;

function remaining() {
  const d = Math.max(0, TARGET - Date.now());
  return {
    days: String(Math.floor(d / 864e5)),
    hours: String(Math.floor((d % 864e5) / 36e5)).padStart(2, "0"),
    mins: String(Math.floor((d % 36e5) / 6e4)).padStart(2, "0"),
    secs: String(Math.floor((d % 6e4) / 1e3)).padStart(2, "0"),
  };
}

export default function Agenda() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState({
    days: "0",
    hours: "00",
    mins: "00",
    secs: "00",
  });

  useEffect(() => {
    setT(remaining());
    const id = setInterval(() => setT(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      el.muted = true;
      const play = el.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {
          /* Autoplay can be blocked until interaction; muted loop still ready */
        });
      }
    };

    if (el.readyState >= 2) {
      tryPlay();
    } else {
      el.addEventListener("canplay", tryPlay, { once: true });
    }

    const onVisible = ([entry]: IntersectionObserverEntry[]) => {
      if (!entry.isIntersecting) {
        el.pause();
        return;
      }
      tryPlay();
    };

    const observer = new IntersectionObserver(onVisible, {
      threshold: 0.15,
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      el.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <section
      className="agenda"
      id="agenda"
      aria-labelledby="agenda-heading"
    >
      <div className="agenda-bg" aria-hidden="true" />
      <div className="agenda-glow" aria-hidden="true" />

      <div className="agenda-inner">
        <div className="agenda-top">
          <div className="agenda-copy">
            <Reveal delay={REVEAL_CASCADE.eyebrow}>
              <p className="agenda-eyebrow">The Destination</p>
            </Reveal>

            <Reveal delay={REVEAL_CASCADE.title}>
              <h2 className="agenda-heading" id="agenda-heading">
                Join Us in Phoenix.
              </h2>
            </Reveal>

            <Reveal delay={REVEAL_CASCADE.body}>
              <p className="agenda-lede">
                Experience Here We Grow 2027 at the JW Marriott Desert Ridge
                Resort &amp; Spa, where inspiring surroundings, exceptional
                amenities, and meaningful connections come together to create
                an unforgettable convention experience.
              </p>
            </Reveal>

            <Reveal delay={REVEAL_CASCADE.cta}>
              <a className="btn btn-orange agenda-cta" href="#register">
                Explore Hotel &amp; Travel
              </a>
            </Reveal>
          </div>

          <Reveal
            className="agenda-countdown"
            delay={REVEAL_CASCADE.media}
            y={24}
          >
            <p className="agenda-countdown-label">Countdown to Convention</p>
            <div className="agenda-count" aria-live="polite">
              {COUNTDOWN_UNITS.map((unit, index) => (
                <div key={unit.key} className="agenda-count-unit">
                  <b>{t[unit.key]}</b>
                  <span>{unit.label}</span>
                  {index < COUNTDOWN_UNITS.length - 1 ? (
                    <span className="agenda-count-sep" aria-hidden="true">
                      :
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="agenda-video">
          <video
            ref={videoRef}
            className="agenda-video-el"
            src="/videos/destination.mp4"
            poster="/images/convention-2026-2067.jpg"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            controls={false}
            aria-label="Here We Grow 2027 — Phoenix destination film"
          />
        </div>
      </div>
    </section>
  );
}
