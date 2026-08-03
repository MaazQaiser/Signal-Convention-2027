"use client";

import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";

const FADE = { once: false as const, amount: 0.25 };

export default function FaqsHero() {
  return (
    <section
      className="faqs-page-hero"
      id="top"
      aria-labelledby="faqs-page-heading"
    >
      <div className="faqs-page-hero-glow" aria-hidden="true" />
      <div className="wrap faqs-page-hero-inner">
        <div className="faqs-page-hero-top">
          <div className="faqs-page-hero-copy">
            <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
              <h1 className="faqs-page-hero-title" id="faqs-page-heading">
                Frequently Asked Questions
              </h1>
            </Reveal>
            <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
              <p className="faqs-page-hero-lede">
                Everything you need to know before you arrive—registration,
                dress code, guests, travel, and how to reach the Convention
                Team.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal
          className="faqs-page-hero-visual"
          delay={REVEAL_CASCADE.cta}
          {...FADE}
        >
          <div className="faqs-page-hero-media">
            <Image
              /* 3840x2561 regenerated from the 8192px master. The .jpg is
                 2000px wide, which this sizes="100vw" hero stretched ~1.5x on
                 a 2x display. Same file weight, 1.9x the linear resolution. */
              src="/images/convention-2026-0977.avif"
              alt="Here We Grow attendees connecting at convention"
              fill
              sizes="100vw"
              className="faqs-page-hero-img"
              priority
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
