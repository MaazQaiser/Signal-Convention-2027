"use client";

import { useEffect, useRef, useState } from "react";
import Reveal, { REVEAL_CASCADE } from "./Reveal";
import BtnArrow from "./BtnArrow";

/** Convention opens Jan 17, 2027 — Phoenix does not observe DST (MST, UTC−7). */
const PHOENIX_TZ = "America/Phoenix";
const CONVENTION_YEAR = 2027;
const CONVENTION_MONTH = 1; // January
const CONVENTION_DAY = 17;
const CONVENTION_HOUR = 8;
const CONVENTION_MINUTE = 30;

const COUNTDOWN_UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "mins", label: "Minutes" },
  { key: "secs", label: "Seconds" },
] as const;

/** Phoenix wall-clock → UTC ms (MST year-round). */
function phoenixToUtcMs(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
) {
  return Date.UTC(year, month - 1, day, hour + 7, minute, second);
}

const TARGET_MS = phoenixToUtcMs(
  CONVENTION_YEAR,
  CONVENTION_MONTH,
  CONVENTION_DAY,
  CONVENTION_HOUR,
  CONVENTION_MINUTE
);

function phoenixParts(ms: number) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: PHOENIX_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));

  const read = (type: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((part) => part.type === type)?.value ?? "0";
    return Number(value);
  };

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

function remaining() {
  const now = Date.now();
  const diff = Math.max(0, TARGET_MS - now);

  if (diff <= 0) {
    return { days: "0", hours: "00", mins: "00", secs: "00" };
  }

  const nowP = phoenixParts(now);
  const todayStartMs = phoenixToUtcMs(nowP.year, nowP.month, nowP.day);
  const targetDayStartMs = phoenixToUtcMs(
    CONVENTION_YEAR,
    CONVENTION_MONTH,
    CONVENTION_DAY
  );

  const calendarDays = Math.max(
    0,
    Math.round((targetDayStartMs - todayStartMs) / 864e5)
  );

  const hours = String(Math.floor((diff % 864e5) / 36e5)).padStart(2, "0");
  const mins = String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0");
  const secs = String(Math.floor((diff % 6e4) / 1e3)).padStart(2, "0");

  return {
    days: String(calendarDays),
    hours,
    mins,
    secs,
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
    <section className="agenda" id="agenda" aria-labelledby="agenda-heading">
      <div className="agenda-bg" aria-hidden="true" />
      <div className="agenda-glow" aria-hidden="true" />

      <div className="wrap">
        <div className="agenda-top">
          <div className="agenda-copy">
            <Reveal delay={REVEAL_CASCADE.eyebrow}>
              <p className="agenda-eyebrow">The Destination</p>
            </Reveal>

            <Reveal delay={REVEAL_CASCADE.title}>
              <h2 className="agenda-heading" id="agenda-heading">
                Join Us in Phoenix
              </h2>
            </Reveal>

            <Reveal delay={REVEAL_CASCADE.body}>
              <p className="agenda-lede">
                Join us at the JW Marriott Desert Ridge Resort &amp; Spa in
                Phoenix, Arizona, where the Sonoran Desert views meet
                world-class amenities. Whether you&apos;re connecting with
                other franchisees between sessions or unwinding after a full
                day of learning, it&apos;s the perfect setting to recharge,
                build relationships and prepare for another year of growth.
              </p>
            </Reveal>

            <Reveal delay={REVEAL_CASCADE.cta}>
              <a className="btn btn-orange agenda-cta" href="#register">
                Register Today
                <BtnArrow />
              </a>
            </Reveal>
          </div>

          <div className="agenda-aside">
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
        </div>

        <div className="agenda-video">
          <video
            ref={videoRef}
            className="agenda-video-el"
            src="/videos/cnv-27-reveal.mp4"
            poster="/images/resort-desert-ridge.jpg"
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
