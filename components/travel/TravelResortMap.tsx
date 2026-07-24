"use client";

import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import BtnArrow from "@/components/BtnArrow";

export default function TravelResortMap() {
  return (
    <section
      id="map"
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
                alt="JW Marriott Phoenix Desert Ridge resort map with numbered locations and legend"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={REVEAL_CASCADE.cta}>
          <div className="travel-map-cta">
            <p className="travel-map-cta-lede">
              Ready to lock in your stay at JW Marriott Desert Ridge?
            </p>
            <a className="btn btn-orange" href="/#register">
              Reserve Your Hotel
              <BtnArrow />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
