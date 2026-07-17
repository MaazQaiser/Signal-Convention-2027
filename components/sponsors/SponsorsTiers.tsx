"use client";

import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import {
  SPONSOR_TIERS,
  type Sponsor,
  type SponsorTier,
} from "@/lib/sponsors";

const FADE = { once: false as const, amount: 0.25 };

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <span className="sponsor-logo">
      <img src={sponsor.src} alt="" loading="lazy" decoding="async" />
    </span>
  );

  if (sponsor.href) {
    return (
      <a
        className="sponsor-card"
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={sponsor.name}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="sponsor-card" role="img" aria-label={sponsor.name}>
      {content}
    </div>
  );
}

function TierBlock({ tier, index }: { tier: SponsorTier; index: number }) {
  const shortTitle = tier.title
    .replace(/ Sponsors?$/, "")
    .replace(" Partners", "");

  return (
    <Reveal delay={0.04 + index * 0.05} y={24} duration={0.8} {...FADE}>
      <article
        className={`sponsors-page-tier sponsor-tier--${tier.id}`}
        aria-labelledby={`sponsors-page-tier-title-${tier.id}`}
      >
        <div className="sponsors-page-tier-head">
          <h3
            className="sponsors-page-tier-title"
            id={`sponsors-page-tier-title-${tier.id}`}
          >
            {shortTitle}
          </h3>
          {tier.note ? (
            <p className="sponsors-page-tier-label">{tier.note}</p>
          ) : null}
        </div>
        <div className="sponsors-page-tier-panel">
          <div className="sponsor-grid" aria-label={`${tier.title} logos`}>
            {tier.sponsors.map((sponsor) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} />
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function SponsorsTiers() {
  return (
    <section
      id="tiers"
      className="sponsors-page-tiers sponsors-surface--dark"
      aria-labelledby="sponsors-page-tiers-heading"
    >
      <div className="wrap">
        <Reveal className="sponsors-page-tiers-intro" {...FADE}>
          <p className="sponsors-page-tiers-intro-label">Partner Roster</p>
          <h2
            className="sponsors-page-tiers-intro-title"
            id="sponsors-page-tiers-heading"
          >
            2027
          </h2>
        </Reveal>

        <div className="sponsors-page-tiers-list">
          {SPONSOR_TIERS.map((tier, index) => (
            <TierBlock key={tier.id} tier={tier} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
