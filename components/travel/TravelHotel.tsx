"use client";

import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import {
  TRAVEL_AMENITIES,
  TRAVEL_HOTEL_MOSAIC,
} from "@/lib/travel-info";

const FADE = { once: false as const, amount: 0.2 };

function AmenityIcon({ id }: { id: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "pools":
      return (
        <svg {...common}>
          <path d="M4 18c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
          <path d="M4 14c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
          <path d="M8 6.5c0-1.5 1.2-2.5 2.5-2.5S13 5 13 6.5 11.5 10 10.5 12" />
        </svg>
      );
    case "river":
      return (
        <svg {...common}>
          <path d="M3 8c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
          <path d="M3 13c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
          <path d="M3 18c2 2 4 2 6 0s4-2 6 0 4 2 6 0" />
        </svg>
      );
    case "cabanas":
      return (
        <svg {...common}>
          <path d="M4 20V10l8-6 8 6v10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case "pickleball":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M8 10.5h.01M12 9h.01M15.5 11h.01M10 14h.01M14 15.5h.01" />
        </svg>
      );
    case "golf":
      return (
        <svg {...common}>
          <path d="M8 21V4l10 4-10 4" />
          <path d="M6 21h8" />
        </svg>
      );
    case "dining":
      return (
        <svg {...common}>
          <path d="M8 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3" />
          <path d="M10 12v9" />
          <path d="M16 3v18" />
          <path d="M16 8h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3" />
        </svg>
      );
    case "spa":
      return (
        <svg {...common}>
          <path d="M12 3c-2.5 3-4 5.5-4 8a4 4 0 0 0 8 0c0-2.5-1.5-5-4-8Z" />
          <path d="M8 20h8" />
        </svg>
      );
    case "fitness":
      return (
        <svg {...common}>
          <path d="M6 9v6M18 9v6M9 7v10M15 7v10M6 12h12" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
}

function getAmenity(id: string) {
  return TRAVEL_AMENITIES.find((a) => a.id === id);
}

export default function TravelHotel() {
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
            Between sessions, enjoy world-class amenities while connecting with
            fellow franchise owners and teams.
          </p>
        </Reveal>

        <Reveal delay={REVEAL_CASCADE.media} {...FADE}>
          <ul className="travel-hotel-mosaic" aria-label="Resort amenities">
            {TRAVEL_HOTEL_MOSAIC.map((cell, index) => {
              if (cell.type === "image") {
                return (
                  <li key={`img-${index}`} className="travel-hotel-cell travel-hotel-cell--image">
                    <Image
                      src={cell.src}
                      alt={cell.alt}
                      fill
                      sizes="(max-width: 900px) 50vw, 25vw"
                      className="travel-hotel-cell-img"
                    />
                  </li>
                );
              }

              const amenity = getAmenity(cell.amenityId);
              if (!amenity) return null;

              return (
                <li
                  key={amenity.id}
                  className="travel-hotel-cell travel-hotel-cell--text"
                >
                  <span className="travel-hotel-cell-icon">
                    <AmenityIcon id={amenity.id} />
                  </span>
                  <span className="travel-hotel-cell-label">{amenity.label}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
