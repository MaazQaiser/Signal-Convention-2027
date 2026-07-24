"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import { TRAVEL_HOTEL_IMAGES } from "@/lib/travel-info";

const FADE = { once: false as const, amount: 0.2 };

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="28" height="28" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {direction === "right" ? (
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M13 8H3M7 4L3 8l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function TravelHotel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = TRAVEL_HOTEL_IMAGES.length;

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(total - 1, next));
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[clamped] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    setIndex(clamped);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    setIndex(Math.max(0, Math.min(total - 1, next)));
  };

  return (
    <section
      id="hotel"
      className="travel-hotel page-surface--light"
      aria-labelledby="travel-hotel-heading"
    >
      <div className="wrap">
        <Reveal className="travel-hotel-intro" delay={REVEAL_CASCADE.title} {...FADE}>
          <p className="eyebrow">JW Marriott Desert Ridge Resort &amp; Spa</p>
          <h2 className="travel-hotel-heading" id="travel-hotel-heading">
            Resort Amenities
          </h2>
          <p className="travel-hotel-lede">
            Nestled in the serene Sonoran Desert, this destination offers
            breathtaking views and a luxurious resort experience. Guests can
            enjoy exceptional amenities, including 17 pickleball courts, five
            pools, a lazy river, private cabana cottages, and two championship
            golf courses featuring PGA instruction and custom club fittings.
          </p>
        </Reveal>

        <Reveal delay={REVEAL_CASCADE.media} {...FADE}>
          <div
            className="travel-hotel-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Resort amenity photos"
          >
            <div
              className="travel-hotel-carousel-track"
              ref={trackRef}
              onScroll={onScroll}
              tabIndex={0}
            >
              {TRAVEL_HOTEL_IMAGES.map((image, i) => (
                <div
                  key={image.src}
                  className="travel-hotel-carousel-slide"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 72rem"
                    className="travel-hotel-carousel-img"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {index > 0 ? (
              <button
                type="button"
                className="travel-hotel-carousel-arrow travel-hotel-carousel-arrow--left"
                onClick={() => goTo(index - 1)}
                aria-label="Previous amenity photo"
              >
                <ArrowIcon direction="left" />
              </button>
            ) : null}

            {index < total - 1 ? (
              <button
                type="button"
                className="travel-hotel-carousel-arrow travel-hotel-carousel-arrow--right"
                onClick={() => goTo(index + 1)}
                aria-label="Next amenity photo"
              >
                <ArrowIcon direction="right" />
              </button>
            ) : null}

            <div className="travel-hotel-carousel-dots" role="tablist" aria-label="Slides">
              {TRAVEL_HOTEL_IMAGES.map((image, i) => (
                <button
                  key={image.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`travel-hotel-carousel-dot${
                    i === index ? " is-active" : ""
                  }`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
