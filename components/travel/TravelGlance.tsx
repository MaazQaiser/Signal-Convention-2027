"use client";

import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import { TRAVEL_GLANCE } from "@/lib/travel-info";

const FADE = { once: false as const, amount: 0.22 };

function GlanceIcon({ id }: { id: string }) {
  const common = {
    className: "travel-glance-icon",
    width: 18,
    height: 18,
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": true as const,
  };

  switch (id) {
    case "venue":
      return (
        <svg {...common}>
          <path
            d="M3 13.5V5.2L8 2.5l5 2.7v8.3"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path
            d="M6 13.5V9.5h4v4"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "convention":
      return (
        <svg {...common}>
          <rect
            x="2"
            y="3.5"
            width="12"
            height="11"
            rx="1.25"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M5 1.5v3M11 1.5v3"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      );
    case "check-in":
      return (
        <svg {...common}>
          <circle
            cx="8"
            cy="8"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M8 5v3.2L10.2 10"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "check-out":
      return (
        <svg {...common}>
          <circle
            cx="8"
            cy="8"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <path
            d="M8 5v3.2L5.8 10"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "airport":
      return (
        <svg
          className="travel-glance-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5L3 8c-.2.5 0 1.1.5 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 2.6 5.6c.3.5.8.5 1.3.3l1.3-.7c.5-.2.6-.8.4-1.2Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      );
    case "distance":
      return (
        <svg {...common}>
          <path
            d="M8 14s4.5-3.2 4.5-7A4.5 4.5 0 1 0 3.5 7C3.5 10.8 8 14 8 14Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="7" r="1.5" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export default function TravelGlance() {
  return (
    <section
      className="travel-glance page-surface--light"
      aria-labelledby="travel-glance-heading"
    >
      <div className="wrap">
        <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
          <h2 className="travel-section-heading" id="travel-glance-heading">
            At a Glance
          </h2>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
          <ul className="travel-glance-grid" aria-label="Convention facts">
            {TRAVEL_GLANCE.map((fact) => (
              <li key={fact.id} className="travel-glance-item">
                <span className="travel-glance-label">
                  <GlanceIcon id={fact.id} />
                  {fact.label}
                </span>
                <span className="travel-glance-value">{fact.value}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
