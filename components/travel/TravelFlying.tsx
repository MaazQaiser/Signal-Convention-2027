"use client";

import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import {
  TRAVEL_RESERVATION_INCLUDES,
  TRAVEL_TRANSPORT,
} from "@/lib/travel-info";

const FADE = { once: false as const, amount: 0.22 };

const STAY_FLY_PANELS = [
  {
    id: "stay",
    num: "01",
    title: "Hotel Reservations",
    detail:
      "Your room is reserved during convention registration. Extend nights by selecting preferred dates—subject to availability.",
  },
  {
    id: "included",
    num: "02",
    title: "What's Included",
    detail: null as string | null,
    list: TRAVEL_RESERVATION_INCLUDES,
  },
  {
    id: "fly",
    num: "03",
    title: "Flying to Phoenix",
    detail:
      "Phoenix Sky Harbor (PHX) — 22 miles from the resort. No hotel shuttle; use Uber, Lyft, taxi, or rental car.",
  },
] as const;

export default function TravelFlying() {
  return (
    <section
      className="travel-flying page-surface--light"
      aria-labelledby="travel-flying-heading"
    >
      <div className="wrap travel-flying-head">
        <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
          <p className="travel-flying-kicker">
            <span aria-hidden="true">•</span> Stay &amp; Fly
          </p>
          <h2 className="travel-flying-heading" id="travel-flying-heading">
            Plan Your Stay and Flight
          </h2>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
          <p className="travel-flying-lede">
            Reserve during registration, then fly into Phoenix Sky Harbor—the
            recommended airport for Here We Grow 2027.
          </p>
        </Reveal>
      </div>

      <Reveal delay={REVEAL_CASCADE.media} {...FADE}>
        <div className="travel-flying-strip">
          <ol className="travel-flying-panels">
            {STAY_FLY_PANELS.map((panel) => (
              <li key={panel.id} className="travel-flying-panel">
                <div className="travel-flying-panel-top">
                  <span className="travel-flying-num" aria-hidden="true">
                    {panel.num}
                  </span>
                  <h3 className="travel-flying-panel-title">{panel.title}</h3>
                </div>
                {"list" in panel && panel.list ? (
                  <ul className="travel-flying-panel-list">
                    {panel.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : panel.detail ? (
                  <p className="travel-flying-panel-detail">{panel.detail}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal className="wrap travel-flying-footer" delay={REVEAL_CASCADE.cta} {...FADE}>
        <div className="travel-flying-transport">
          <span className="travel-flying-transport-label">Getting There</span>
          <ul className="travel-flying-transport-list">
            {TRAVEL_TRANSPORT.map((option) => (
              <li key={option.label}>{option.label}</li>
            ))}
          </ul>
        </div>
        <a className="btn btn-orange" href="/#register">
          Reserve During Registration
        </a>
      </Reveal>
    </section>
  );
}
