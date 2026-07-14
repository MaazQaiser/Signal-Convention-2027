"use client";

import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";

const FADE = { once: false as const, amount: 0.25 };

export default function AgendaHotelCta() {
  return (
    <section
      className="agenda-hotel-cta agenda-surface--dark"
      aria-labelledby="agenda-hotel-heading"
    >
      <div className="wrap agenda-hotel-inner">
        <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
          <h2 className="agenda-hotel-heading" id="agenda-hotel-heading">
            Planning Your Visit?
          </h2>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
          <p className="agenda-hotel-lede">
            Find hotel information, travel details, and everything you need
            before arriving in Phoenix.
          </p>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.cta} {...FADE}>
          <a className="btn btn-orange agenda-hotel-btn" href="/travel">
            Explore Hotel &amp; Travel
          </a>
        </Reveal>
      </div>
    </section>
  );
}
