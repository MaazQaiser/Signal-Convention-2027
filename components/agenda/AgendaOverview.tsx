"use client";

import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";

const FADE = { once: false as const, amount: 0.25 };

export default function AgendaOverview() {
  return (
    <section
      className="agenda-overview agenda-surface--light"
      aria-labelledby="agenda-overview-heading"
    >
      <div className="wrap agenda-overview-grid">
        <Reveal
          className="agenda-overview-copy"
          delay={REVEAL_CASCADE.title}
          {...FADE}
        >
          <p className="eyebrow">Agenda Overview</p>
          <h2
            className="agenda-overview-heading"
            id="agenda-overview-heading"
          >
            Three Days of Learning, Networking &amp; Celebration
          </h2>
          <p className="agenda-overview-lede">
            From keynote sessions and breakout discussions to networking events
            and recognition ceremonies, every day is designed to help you learn,
            connect, and grow.
          </p>
        </Reveal>
        <Reveal
          className="agenda-overview-visual"
          delay={REVEAL_CASCADE.media}
          {...FADE}
        >
          <div className="agenda-overview-media">
            <Image
              src="/images/convention-2026-0254.jpg"
              alt="Here We Grow convention atmosphere"
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className="agenda-overview-img"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
