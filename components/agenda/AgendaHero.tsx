"use client";

import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";

const FADE = { once: false as const, amount: 0.25 };

export default function AgendaHero() {
  return (
    <section
      className="agenda-page-hero"
      id="top"
      aria-labelledby="agenda-page-heading"
    >
      <div className="agenda-page-hero-glow" aria-hidden="true" />
      <div className="wrap agenda-page-hero-inner">
        <div className="agenda-page-hero-top">
          <div className="agenda-page-hero-copy">
            <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
              <h1 className="agenda-page-hero-title" id="agenda-page-heading">
                Convention Agenda
              </h1>
            </Reveal>
            <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
              <p className="agenda-page-hero-lede">
                Explore the complete schedule for Here We Grow 2027 and plan
                your convention experience from January 17–19 in Phoenix,
                Arizona.
              </p>
            </Reveal>
          </div>
          <Reveal
            className="agenda-page-hero-meta-wrap"
            delay={REVEAL_CASCADE.media}
            {...FADE}
          >
            <ul className="agenda-page-hero-meta" aria-label="Quick info">
              <li>
                <svg
                  className="agenda-page-hero-meta-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="2"
                    y="3.5"
                    width="12"
                    height="11"
                    rx="1.25"
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
                <span>January 17–19, 2027</span>
              </li>
              <li>
                <svg
                  className="agenda-page-hero-meta-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 13.5V5.2L8 2.5l5 2.7v8.3"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 13.5V9.5h4v4"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>JW Marriott Desert Ridge Resort &amp; Spa</span>
              </li>
              <li>
                <svg
                  className="agenda-page-hero-meta-icon"
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
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal
          className="agenda-page-hero-visual"
          delay={REVEAL_CASCADE.cta}
          {...FADE}
        >
          <div className="agenda-page-hero-media">
            <Image
              src="/images/convention-2026-2106.jpg"
              alt="Here We Grow convention floor"
              fill
              sizes="100vw"
              className="agenda-page-hero-img"
              priority
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
