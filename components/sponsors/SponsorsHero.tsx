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
                Sponsors &amp; Partners
              </h1>
            </Reveal>
            <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
              <p className="sponsors-page-hero-lede">
                Meet the organizations that power Here We Grow 2027 and help
                our franchise network grow—then learn how to join them.
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
                <span>{SPONSOR_TIERS.length} Partnership Tiers</span>
              </li>
              <li>
                <span>{PARTNER_COUNT} Partner Brands</span>
              </li>
              <li>
                <span>Here We Grow 2027</span>
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
