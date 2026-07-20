"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
import LearnFromOwners from "@/components/LearnFromOwners";
import { loadGsap } from "@/lib/load-gsap";

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

type ColumnVariant = "featured" | "photo-first";

const panels: Panel[] = [
  {
    id: "session-format",
    label: "New Session Format",
    heading: "Fresh Perspectives. Practical Learning.",
    body: "All-new keynote and breakout sessions built around practical ideas you can apply in your business.",
    image: {
      src: "/images/convention-2026-0254.jpg",
      alt: "Keynote and breakout sessions at Here We Grow",
    },
  },
  {
    id: "owner-led",
    label: "Owner-Led Sessions",
    heading: "Learn From Those Doing the Work.",
    body: "Hear directly from franchise owners and their teams as they share what's working in their markets, the lessons they've learned, and the strategies driving growth.",
    image: {
      src: "/images/convention-2026-0777.jpg",
      alt: "Franchise owners sharing what's working in their markets",
    },
  },
  {
    id: "networking",
    label: "Expanded Networking",
    heading: "More Time to Connect.",
    body: "Build stronger relationships with franchise owners, Home Office, and partners through expanded networking opportunities across the convention.",
    image: {
      src: "/images/convention-2026-0692.jpg",
      alt: "Networking across the Here We Grow convention",
    },
  },
  {
    id: "takeaways",
    label: "Actionable Takeaways",
    heading: "Ideas You Can Put Into Practice.",
    body: "Leave with practical strategies and proven approaches you can implement immediately within your business.",
    image: {
      src: "/images/convention-2026-0732.jpg",
      alt: "Practical strategies shared in collaborative sessions",
    },
  },
  {
    id: "vendor-expo",
    label: "Vendor Expo",
    heading: "Meet the Partners Behind Your Success.",
    body: "Explore products, services, and solutions from trusted partners supporting the Signal franchise network.",
    image: {
      src: "/images/convention-2026-1125.jpg",
      alt: "Partner expo supporting the Signal franchise network",
    },
  },
  {
    id: "recognition",
    label: "Network Recognition",
    heading: "Celebrate Success Across the Network.",
    body: "Recognize outstanding achievements and celebrate the people helping move the Signal community forward.",
    image: {
      src: "/images/convention-2026-0977.jpg",
      alt: "Celebrating achievements across the Signal community",
    },
  },
];

const panel2027 = {
  year: "2027",
  location: "Arizona",
  category: "Consistency",
  tagline: "Consistency Defines What's Next",
  logo: "/brand/logo-27-dark.svg",
  logoAlt: "Here We Grow 2027",
};

const COLUMN_VARIANTS: ColumnVariant[] = [
  "featured",
  "photo-first",
  "photo-first",
];

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
        sizes="500px"
        className="journey-column-img"
        priority={priority}
      />
    </div>
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
  const photo = <ColumnPhoto image={panel.image} priority={priority} />;

  // All columns: image on top, copy below
  return (
    <article
      className={`journey-column journey-column--${variant}`}
      aria-labelledby={id}
    >
      {variant === "featured" ? (
        <div className="journey-column-media">{photo}</div>
      ) : (
        photo
      )}
      {copy}
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
      <h2 className="journey-heading">
        <span className="journey-intro-line">What&apos;s New</span>
        <span className="journey-intro-line">This Year</span>
      </h2>
      <div className="journey-lede">
        <span className="journey-intro-line">
          Discover what&apos;s new at Here We Grow 2027—from fresh session
          formats to expanded networking opportunities—
        </span>
        <span className="journey-intro-line">
          all designed to help you learn, connect, and grow.
        </span>
      </div>
    </aside>
  );
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
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
    const fade = fadeRef.current;
    const stage = stageRef.current;
    const cardLayer = cardLayerRef.current;
    const cardTrack = cardTrackRef.current;
    const finaleLayer = finaleLayerRef.current;
    const intro = introRef.current;
    if (
      !section ||
      !pin ||
      !fade ||
      !stage ||
      !cardLayer ||
      !cardTrack ||
      !finaleLayer
    )
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

        gsap.set(finaleLayer, { opacity: 0, scale: 0.985 });
        const finaleSteps =
          finaleRef.current?.querySelectorAll(".journey-finale-step");
        if (finaleSteps?.length) gsap.set(finaleSteps, { opacity: 0, y: 24 });

        const introLines = intro?.querySelectorAll(".journey-intro-line");
        if (introLines?.length) {
          gsap.set(introLines, { opacity: 0, y: 28 });
        }

        const scrollItems = cardTrack.querySelectorAll(".journey-column");
        gsap.set(scrollItems, { opacity: 0 });

        /* Start on white; intro already left-aligned (no center→dock jerk) */
        gsap.set(fade, { opacity: 0 });
        gsap.set(cardTrack, { x: 0 });

        /*
         * Scrub weights (relative). Pin distance scales with track width
         * so horizontal scroll speed stays even — no long empty scrolling.
         */
        const INTRO_SCROLL_VH = 1.55;
        const EXIT_SCROLL_VH = 1.25;
        const SCROLL_PX_PER_VH = 0.92;

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => {
              const intro = window.innerHeight * INTRO_SCROLL_VH;
              const track =
                Math.max(travel(), stage.clientWidth * 0.5) * SCROLL_PX_PER_VH;
              const exit = window.innerHeight * EXIT_SCROLL_VH;
              return `+=${intro + track + exit}`;
            },
            pin: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* 1. Arrive on white — quick handoff from hero */
        tl.to(fade, { opacity: 1, duration: 0.55, ease: "power2.out" }, 0);

        /* 2. Left-aligned text — line by line, paced not glacial */
        const lineCount = introLines?.length ?? 0;
        const lineStagger = 0.32;
        const lineDur = 0.55;
        if (introLines?.length) {
          tl.fromTo(
            introLines,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: lineDur,
              stagger: lineStagger,
              ease: "power2.out",
              immediateRender: false,
            },
            0.3
          );
        }

        /* 3. Brief hold, then cards enter as scroll begins */
        const afterLines =
          0.3 + Math.max(0, lineCount - 1) * lineStagger + lineDur;
        tl.to({}, { duration: 0.28 }, afterLines);

        const revealAt = afterLines + 0.28;
        tl.to(
          scrollItems,
          { opacity: 1, duration: 0.55, ease: "power2.out" },
          revealAt
        );

        /* 4. Horizontal journey — bulk of the pin distance */
        const scrollAt = revealAt + 0.35;
        const scrollDur = 5.2;
        tl.to(
          cardTrack,
          {
            x: () => -travel(),
            ease: "none",
            duration: scrollDur,
          },
          scrollAt
        );

        tl.to(
          cardTrack,
          {
            x: () => -exitTravel(),
            ease: "power2.inOut",
            duration: 1.35,
          },
          scrollAt + scrollDur
        );
        tl.to(
          cardLayer,
          { opacity: 0, duration: 1, ease: "power2.inOut" },
          scrollAt + scrollDur + 0.25
        );

        tl.to(
          finaleLayer,
          { opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
          scrollAt + scrollDur + 0.85
        );

        if (finaleRef.current) {
          const finaleParts =
            finaleRef.current.querySelectorAll(".journey-finale-step");
          tl.fromTo(
            finaleParts,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.1,
              ease: "power3.out",
            },
            scrollAt + scrollDur + 1.05
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
      aria-label="What's new this year"
    >
      <Hero />

      <LearnFromOwners />

      <div className="journey-pin" ref={pinRef}>
        <div className="journey-fade" ref={fadeRef}>
          <div className="journey-stage" ref={stageRef}>
          <div className="journey-card-layer" ref={cardLayerRef}>
            <div className="journey-card-track" ref={cardTrackRef}>
              <JourneyIntro introRef={introRef} />

              {panels.map((panel, panelIndex) => (
                <JourneyColumn
                  key={panel.id}
                  panel={panel}
                  variant={COLUMN_VARIANTS[panelIndex % COLUMN_VARIANTS.length]}
                  id={`journey-${panel.id}`}
                  priority={panelIndex === 0}
                />
              ))}
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
      </div>
    </section>
  );
}
