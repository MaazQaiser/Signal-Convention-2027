"use client";

import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import BtnArrow from "@/components/BtnArrow";

const FADE = { once: false as const, amount: 0.25 };

export default function SponsorsBecomeCta() {
  return (
    <section
      className="sponsors-page-become sponsors-surface--light"
      id="become"
      aria-labelledby="sponsors-page-become-heading"
    >
      <div className="wrap sponsors-page-become-inner">
        <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
          <h2
            className="sponsors-page-become-heading"
            id="sponsors-page-become-heading"
          >
            Become a Sponsor
          </h2>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
          <p className="sponsors-page-become-lede">
            Ready to support Here We Grow 2027? Sponsorship packages are
            coordinated directly with our Convention Team—we&apos;ll help you
            find the right fit for your brand.
          </p>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.cta} {...FADE}>
          <a
            className="btn btn-orange sponsors-page-become-btn"
            href="mailto:convention@teamsignal.com"
          >
            Contact Convention Team
            <BtnArrow />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
