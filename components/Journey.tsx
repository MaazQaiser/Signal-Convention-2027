"use client";

import Image from "next/image";
import Hero from "@/components/Hero";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";

type JourneyImage = {
  src: string;
  alt: string;
};

type Panel = {
  id: string;
  label: string;
  heading: string;
  body: string;
  image: JourneyImage;
};

const panels: Panel[] = [
  {
    id: "session-format",
    label: "New Session Content",
    heading: "Every keynote and breakout session is brand new.",
    body: "All-new keynote and breakout sessions built around ideas you can apply in your business.",
    image: {
      src: "/images/journey-session-content.jpg",
      alt: "Keynote and breakout sessions at Here We Grow",
    },
  },
  {
    id: "owner-led",
    label: "New Owner-Led Sessions",
    heading: "Learn From Those Doing the Work.",
    body: "Hear directly from franchise owners and their teams as they share what's working in their markets, the lessons they've learned, and the strategies driving growth.",
    image: {
      src: "/images/journey-owner-led.jpg",
      alt: "Franchise owners sharing what's working in their markets",
    },
  },
  {
    id: "networking",
    label: "Expanded Networking",
    heading: "More Time to Connect.",
    body: "Build stronger relationships with franchise owners, Home Office, and partners through expanded networking opportunities across the convention.",
    image: {
      src: "/images/journey-networking.jpg",
      alt: "Networking across the Here We Grow convention",
    },
  },
];

const FADE = { once: false as const, amount: 0.2 };

function ColumnCopy({ panel, id }: { panel: Panel; id: string }) {
  return (
    <div className="journey-column-copy">
      <p className="journey-column-label">{panel.label}</p>
      <h3 className="journey-column-title" id={id}>
        {panel.heading}
      </h3>
      <p className="journey-column-body">{panel.body}</p>
    </div>
  );
}

function ColumnPhoto({
  image,
  priority,
}: {
  image: JourneyImage;
  priority?: boolean;
}) {
  return (
    <div className="journey-column-photo">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 900px) 85vw, 32vw"
        className="journey-column-img"
        priority={priority}
      />
    </div>
  );
}

function JourneyColumn({
  panel,
  id,
  priority,
}: {
  panel: Panel;
  id: string;
  priority?: boolean;
}) {
  return (
    <article className="journey-column journey-column--photo-first" aria-labelledby={id}>
      <ColumnPhoto image={panel.image} priority={priority} />
      <ColumnCopy panel={panel} id={id} />
    </article>
  );
}

export default function Journey() {
  return (
    <section
      className="story-unified journey-section journey-section--grid"
      id="journey"
      aria-label="What's new this year"
    >
      <Hero />

      <div className="journey-pin">
        <div className="journey-fade">
          <header className="journey-intro">
            <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
              <h2 className="journey-heading">
                <span className="journey-intro-line">What&apos;s New</span>
                <span className="journey-intro-line">This Year</span>
              </h2>
            </Reveal>
            <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
              <div className="journey-lede">
                <span className="journey-intro-line">
                  Discover what&apos;s new at Here We Grow 2027, from fresh
                  session formats to expanded networking opportunities,
                </span>
                <span className="journey-intro-line">
                  all designed to help you learn, connect, and grow.
                </span>
              </div>
            </Reveal>
          </header>

          <div className="journey-stage">
            <div className="journey-card-layer">
              <div className="journey-card-track">
                {panels.map((panel, panelIndex) => (
                  <Reveal
                    key={panel.id}
                    className="journey-card-item"
                    delay={REVEAL_CASCADE.media + panelIndex * 0.08}
                    {...FADE}
                  >
                    <JourneyColumn
                      panel={panel}
                      id={`journey-${panel.id}`}
                      priority={panelIndex === 0}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
