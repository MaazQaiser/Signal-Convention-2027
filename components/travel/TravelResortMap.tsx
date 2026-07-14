"use client";

import { useState } from "react";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import { TRAVEL_MAP_MARKERS } from "@/lib/travel-info";

export default function TravelResortMap() {
  const [activeId, setActiveId] = useState<string | null>(
    TRAVEL_MAP_MARKERS[0]?.id ?? null
  );

  return (
    <section
      className="travel-map page-surface--dark"
      aria-labelledby="travel-map-heading"
    >
      <div className="wrap">
        <Reveal delay={REVEAL_CASCADE.title}>
          <h2 className="travel-section-heading" id="travel-map-heading">
            Explore the Resort
          </h2>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.body}>
          <p className="travel-section-lede travel-map-lede">
            Find key convention spaces before you arrive.
          </p>
        </Reveal>

        <Reveal delay={REVEAL_CASCADE.media}>
          <div className="travel-map-frame">
            <div className="travel-map-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="travel-map-image"
                src="/images/resort-map.png"
                alt="JW Marriott Desert Ridge resort map showing convention spaces"
              />
              {TRAVEL_MAP_MARKERS.map((marker) => (
                <button
                  key={marker.id}
                  type="button"
                  className={`travel-map-pin${
                    activeId === marker.id ? " is-active" : ""
                  }`}
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                  aria-pressed={activeId === marker.id}
                  aria-label={marker.label}
                  onClick={() => setActiveId(marker.id)}
                >
                  <span className="travel-map-pin-dot" />
                  <span className="travel-map-pin-label">{marker.label}</span>
                </button>
              ))}
            </div>

            <ul className="travel-map-legend" aria-label="Convention spaces">
              {TRAVEL_MAP_MARKERS.map((marker) => (
                <li key={marker.id}>
                  <button
                    type="button"
                    className={`travel-map-legend-btn${
                      activeId === marker.id ? " is-active" : ""
                    }`}
                    onClick={() => setActiveId(marker.id)}
                  >
                    {marker.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={REVEAL_CASCADE.cta}>
          <div className="travel-map-cta">
            <p className="travel-map-cta-lede">
              Ready to lock in your stay at JW Marriott Desert Ridge?
            </p>
            <a className="btn btn-orange" href="/#register">
              Reserve Your Hotel
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
