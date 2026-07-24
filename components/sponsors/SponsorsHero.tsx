"use client";

import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import { SPONSOR_TIERS } from "@/lib/sponsors";

const FADE = { once: false as const, amount: 0.25 };

const PARTNER_COUNT = SPONSOR_TIERS.reduce(
  (sum, tier) => sum + tier.sponsors.length,
  0
);

export default function SponsorsHero() {
  return (
    <section
      className="sponsors-page-hero"
      id="top"
      aria-labelledby="sponsors-page-heading"
    >
      <div className="sponsors-page-hero-glow" aria-hidden="true" />
      <div className="wrap sponsors-page-hero-inner">
        <div className="sponsors-page-hero-top">
          <div className="sponsors-page-hero-copy">
            <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
              <h1
                className="sponsors-page-hero-title"
                id="sponsors-page-heading"
              >
                Sponsors &amp;&nbsp;Partners
              </h1>
            </Reveal>
            <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
              <p className="sponsors-page-hero-lede">
                Meet the organizations that power Here We Grow 2027 and help
                our franchise network grow.
              </p>
            </Reveal>
          </div>
          <Reveal
            className="sponsors-page-hero-meta-wrap"
            delay={REVEAL_CASCADE.media}
            {...FADE}
          >
            <ul className="sponsors-page-hero-meta" aria-label="Quick info">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                <span>{SPONSOR_TIERS.length} Partnership Tiers</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <span>{PARTNER_COUNT} Partner Brands</span>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal
          className="sponsors-page-hero-visual"
          delay={REVEAL_CASCADE.cta}
          {...FADE}
        >
          <div className="sponsors-page-hero-media">
            <Image
              src="/images/convention-2026-1125.jpg"
              alt="Here We Grow convention partners and attendees"
              fill
              sizes="100vw"
              className="sponsors-page-hero-img"
              priority
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
