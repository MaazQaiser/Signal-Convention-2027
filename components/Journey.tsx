"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import Hero from "@/components/Hero";
import { loadGsap } from "@/lib/load-gsap";

type JourneyImage = {
  src: string;
  alt: string;
};

type Panel = {
  year: string;
  location: string;
  category: string;
  theme: string;
  body: string;
  images: JourneyImage[];
  logo: string;
  logoAlt: string;
};

type ColumnVariant = "featured" | "text-first" | "photo-first";

const panels: Panel[] = [
  {
    year: "2025",
    location: "Arizona",
    category: "Culture",
    theme: "Holding Tight to Core Values",
    body: "The inaugural Here We Grow convention established the foundation of our shared culture, bringing franchisees together around the values that continue to guide our network.",
    images: [
      {
        src: "/images/convention-2026-0643.jpg",
        alt: "Franchisees gathered at the inaugural Here We Grow convention",
      },
      {
        src: "/images/convention-2026-0692.jpg",
        alt: "Convention attendees connecting during the inaugural year",
      },
      {
        src: "/images/convention-2026-0254.jpg",
        alt: "Opening session at the first Here We Grow convention",
      },
    ],
    logo: "/brand/here-we-grow-25-mark.png",
    logoAlt: "Here We Grow 2025",
  },
  {
    year: "2026",
    location: "Florida",
    category: "Community",
    theme: "Interconnected With Those You Serve",
    body: "As the network expanded, the convention focused on strengthening relationships, encouraging collaboration, and building a more connected franchise community.",
    images: [
      {
        src: "/images/convention-2026-0777.jpg",
        alt: "Franchisees connecting at the Here We Grow convention in Florida",
      },
      {
        src: "/images/convention-2026-0732.jpg",
        alt: "Collaborative sessions at the 2026 convention",
      },
      {
        src: "/images/convention-2026-0977.jpg",
        alt: "Community moments from the Florida convention",
      },
    ],
    logo: "/brand/here-we-grow-26-mark.png",
    logoAlt: "Here We Grow 2026",
  },
];

const panel2027 = {
  year: "2027",
  location: "Arizona",
  category: "Consistency",
  tagline: "Consistency Defines What's Next",
  logo: "/brand/here-we-grow-27-dark.png",
  logoAlt: "Here We Grow 2027",
};

const COLUMN_VARIANTS: ColumnVariant[] = [
  "featured",
  "text-first",
  "photo-first",
];

function ColumnMeta({ panel }: { panel: Panel }) {
  const items = [panel.location, panel.category, panel.year];
  return (
    <div className="journey-meta">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ColumnCopy({ panel, id }: { panel: Panel; id: string }) {
  return (
    <div className="journey-column-copy">
      <h3 className="journey-column-title" id={id}>
        {panel.logoAlt}
      </h3>
      <p className="journey-column-body">{panel.body}</p>
      <ColumnMeta panel={panel} />
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
        sizes="500px"
        className="journey-column-img"
        priority={priority}
      />
    </div>
  );
}

function JourneyColumnLogo({ panel }: { panel: Panel }) {
  return (
    <img
      src={panel.logo}
      alt=""
      className="journey-column-logo"
      aria-hidden="true"
    />
  );
}

function JourneyColumn({
  panel,
  variant,
  id,
  priority,
}: {
  panel: Panel;
  variant: ColumnVariant;
  id: string;
  priority?: boolean;
}) {
  const copy = <ColumnCopy panel={panel} id={id} />;
  const photo = <ColumnPhoto image={panel.images[0]} priority={priority} />;

  if (variant === "featured") {
    return (
      <article
        className="journey-column journey-column--featured"
        aria-labelledby={id}
      >
        <div className="journey-column-media">
          <JourneyColumnLogo panel={panel} />
          {photo}
        </div>
        {copy}
      </article>
    );
  }

  return (
    <article
      className={`journey-column journey-column--${variant}`}
      aria-labelledby={id}
    >
      {variant === "text-first" ? (
        <>
          {copy}
          {photo}
        </>
      ) : (
        <>
          {photo}
          {copy}
        </>
      )}
    </article>
  );
}

function JourneyIntro({
  introRef,
}: {
  introRef: RefObject<HTMLElement | null>;
}) {
  return (
    <aside className="journey-intro" ref={introRef}>
      <span className="journey-label journey-intro-step">The Here We Grow Legacy</span>
      <h2 className="journey-heading journey-intro-step">
        Every Year Builds the Next.
      </h2>
      <p className="journey-lede journey-intro-step">
        Every year introduces a new focus. Together, they tell the story of a
        growing network united by a shared purpose. Each convention represents
        a chapter in a much larger story.
      </p>
    </aside>
  );
}

function JourneyBeacon({ year }: { year: "2025" | "2026" | "2027" }) {
  const reduceMotion = useReducedMotion();
  const src = `/brand/beacon-${year}.svg`;

  return (
    <div
      className={`journey-beacon journey-beacon--${year}`}
      aria-hidden="true"
    >
      <motion.div
        className="journey-beacon-spin"
        animate={reduceMotion ? undefined : { rotate: [180, 540] }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
      >
        <img src={src} alt="" className="journey-beacon-img" />
      </motion.div>
    </div>
  );
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardLayerRef = useRef<HTMLDivElement>(null);
  const cardTrackRef = useRef<HTMLDivElement>(null);
  const finaleLayerRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);

  const [staticLayout, setStaticLayout] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    const cardLayer = cardLayerRef.current;
    const cardTrack = cardTrackRef.current;
    const finaleLayer = finaleLayerRef.current;
    const intro = introRef.current;
    if (!section || !pin || !stage || !cardLayer || !cardTrack || !finaleLayer)
      return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobile = window.matchMedia("(max-width: 900px)").matches;

    if (reduceMotion || mobile) {
      setStaticLayout(true);
      return;
    }

    let disposed = false;
    let revert: (() => void) | undefined;
    let removeListeners: (() => void) | undefined;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (disposed) return;

      const ctx = gsap.context(() => {
        const travel = () =>
          Math.max(0, cardTrack.scrollWidth - stage.clientWidth);
        const exitTravel = () =>
          cardTrack.scrollWidth + stage.clientWidth * 0.2;

        gsap.set(finaleLayer, { opacity: 0, scale: 0.98 });
        const finaleSteps =
          finaleRef.current?.querySelectorAll(".journey-finale-step");
        if (finaleSteps?.length) gsap.set(finaleSteps, { opacity: 0, y: 28 });

        const introSteps = intro?.querySelectorAll(".journey-intro-step");

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${window.innerHeight * 6}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to({}, { duration: 1.5 }, 0);

        if (introSteps?.length) {
          tl.fromTo(
            introSteps,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.1,
              ease: "power2.out",
              immediateRender: false,
            },
            0
          );
        }

        tl.to(
          cardTrack,
          { x: () => -travel(), ease: "none", duration: 5.5 },
          1.5
        );

        tl.to(
          cardTrack,
          { x: () => -exitTravel(), ease: "power2.inOut", duration: 2 },
          7
        );
        tl.to(cardLayer, { opacity: 0, duration: 1.5, ease: "power2.in" }, 7.5);

        tl.to(
          finaleLayer,
          { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" },
          9
        );

        if (finaleRef.current) {
          const finaleParts =
            finaleRef.current.querySelectorAll(".journey-finale-step");
          tl.fromTo(
            finaleParts,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.15,
              ease: "power2.out",
            },
            9.4
          );
        }
      }, section);

      revert = () => ctx.revert();

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      removeListeners = () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
      };
    });

    return () => {
      disposed = true;
      removeListeners?.();
      revert?.();
    };
  }, []);

  return (
    <section
      className={`story-unified journey-section${staticLayout ? " journey-section--static" : ""}`}
      id="journey"
      ref={sectionRef}
      aria-label="Convention story"
    >
      <Hero />

      <div className="journey-pin" ref={pinRef}>
        <div className="journey-stage" ref={stageRef}>
          <div className="journey-card-layer" ref={cardLayerRef}>
            <div className="journey-card-track" ref={cardTrackRef}>
              <JourneyIntro introRef={introRef} />

              {panels.map((panel, panelIndex) => (
                <div className="journey-year-group" key={panel.year}>
                  <JourneyBeacon
                    year={panel.year as "2025" | "2026" | "2027"}
                  />
                  {COLUMN_VARIANTS.map((variant, variantIndex) => (
                    <JourneyColumn
                      key={`${panel.year}-${variant}`}
                      panel={panel}
                      variant={variant}
                      id={`journey-${panel.year}-${variant}`}
                      priority={panelIndex === 0 && variantIndex === 0}
                    />
                  ))}
                </div>
              ))}

              <JourneyBeacon year="2027" />
            </div>
          </div>

          <div className="journey-finale-layer" ref={finaleLayerRef}>
            <div className="journey-finale-panel" ref={finaleRef}>
              <img
                src={panel2027.logo}
                alt={panel2027.logoAlt}
                className="journey-finale-logo journey-finale-step"
              />
              <p className="journey-finale-tagline journey-finale-step">
                {panel2027.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
