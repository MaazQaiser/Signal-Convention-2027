"use client";

import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";

const FADE = { once: false as const, amount: 0.25 };

export default function SponsorsWhy() {
  return (
    <section
      id="overview"
      className="sponsors-page-overview sponsors-surface--light"
      aria-labelledby="sponsors-page-overview-heading"
    >
      <div className="wrap sponsors-page-overview-grid">
        <Reveal
          className="sponsors-page-overview-copy"
          delay={REVEAL_CASCADE.title}
          {...FADE}
        >
          <p className="eyebrow">Why Partner</p>
          <h2
            className="sponsors-page-overview-heading"
            id="sponsors-page-overview-heading"
          >
            Reach franchise owners where growth happens.
          </h2>
          <p className="sponsors-page-overview-lede">
            Sponsorship packages are tailored with the Convention Team. Connect
            with Signal franchise owners, build brand presence across the
            convention experience, and align with a network committed to growth.
          </p>
        </Reveal>
        <Reveal
          className="sponsors-page-overview-visual"
          delay={REVEAL_CASCADE.media}
          {...FADE}
        >
          <div className="sponsors-page-overview-media">
            <Image
              src="/images/convention-2026-0643.jpg"
              alt="Here We Grow convention networking atmosphere"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className="sponsors-page-overview-img"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
