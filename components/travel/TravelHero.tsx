"use client";

import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import BtnArrow from "@/components/BtnArrow";

const FADE = { once: false as const, amount: 0.25 };

export default function TravelHero() {
  return (
    <section
      className="travel-page-hero"
      id="top"
      aria-labelledby="travel-page-heading"
    >
      <div className="travel-page-hero-glow" aria-hidden="true" />
      <div className="wrap travel-page-hero-inner">
        <div className="travel-page-hero-top">
          <div className="travel-page-hero-copy">
            <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
              <h1 className="travel-page-hero-title" id="travel-page-heading">
                Hotel &amp; Travel
              </h1>
            </Reveal>
          </div>
          <Reveal
            className="travel-page-hero-meta-wrap"
            delay={REVEAL_CASCADE.media}
            {...FADE}
          >
            <ul className="travel-page-hero-meta" aria-label="Quick info">
              <li>
                <svg
                  className="travel-page-hero-meta-icon"
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
                  className="travel-page-hero-meta-icon"
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
                  className="travel-page-hero-meta-icon"
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
            <a
              className="btn btn-orange travel-page-hero-cta"
              href="/#register"
            >
              Reserve Your Hotel
              <BtnArrow />
            </a>
          </Reveal>
        </div>

        <Reveal
          className="travel-page-hero-visual"
          delay={REVEAL_CASCADE.cta}
          {...FADE}
        >
          <div className="travel-page-hero-media">
            <Image
              src="/images/convention-2026-2067.jpg"
              alt="JW Marriott Desert Ridge Resort & Spa"
              fill
              sizes="100vw"
              className="travel-page-hero-img"
              priority
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
