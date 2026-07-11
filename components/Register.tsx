"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "./Reveal";

const TARGET = new Date("2027-12-10T08:30:00-07:00").getTime();

function remaining() {
  const d = Math.max(0, TARGET - Date.now());
  return {
    days: String(Math.floor(d / 864e5)),
    hours: String(Math.floor((d % 864e5) / 36e5)).padStart(2, "0"),
    mins: String(Math.floor((d % 36e5) / 6e4)).padStart(2, "0"),
    secs: String(Math.floor((d % 6e4) / 1e3)).padStart(2, "0"),
  };
}

const COUNTDOWN_UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "mins", label: "Minutes" },
  { key: "secs", label: "Seconds" },
] as const;

export default function Register() {
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

  return (
    <section className="register" id="register">
      <div className="register-bg" aria-hidden="true">
        <Image
          src="/images/convention-2026-2067.jpg"
          alt=""
          fill
          sizes="100vw"
          className="register-bg-img"
        />
        <div className="register-scrim" />
        <div className="register-hue" aria-hidden="true">
          <Image
            src="/brand/hero-hue-overlay.svg"
            alt=""
            fill
            sizes="140vw"
            className="register-hue-img"
          />
        </div>
      </div>

      <div className="register-inner">
        <Reveal delay={REVEAL_CASCADE.eyebrow}>
          <span className="eyebrow">The Countdown Is On</span>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.title}>
          <h2 className="register-title">
            We&apos;ll See You at Here We Grow 2027.
          </h2>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.body}>
          <p className="register-lede">
            Join the Signal and FilterGo communities for three days of learning,
            leadership, and lasting connections.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="register-count" aria-live="polite">
            {COUNTDOWN_UNITS.map((unit, index) => (
              <span key={unit.key} className="register-count-unit">
                <b>{t[unit.key]}</b>
                <span>{unit.label}</span>
                {index < COUNTDOWN_UNITS.length - 1 ? (
                  <span className="register-count-sep" aria-hidden="true" />
                ) : null}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.cta}>
          <div className="register-actions">
            <a className="btn btn-orange" href="#">
              Reserve Your Spot
            </a>
            <a className="btn btn-ghost" href="#">
              Plan Your Stay
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
