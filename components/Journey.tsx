"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
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
    label: "New Session Content.",
    heading: "Every keynote and breakout session is brand new.",
    body: "All-new keynote and breakout sessions built around ideas you can apply in your business.",
    image: {
      src: "/images/convention-2026-0254.jpg",
      alt: "Keynote and breakout sessions at Here We Grow",
    },
  },
  {
    id: "owner-led",
    label: "New Owner-Led Sessions",
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
      {photo}
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
    <header className="journey-intro" ref={introRef}>
      <h2 className="journey-heading">
        <span className="journey-intro-line">What&apos;s New</span>
        <span className="journey-intro-line">This Year</span>
      </h2>
      <div className="journey-lede">
        <span className="journey-intro-line">
          Discover what&apos;s new at Here We Grow 2027, from fresh session
          formats to expanded networking opportunities,
        </span>
        <span className="journey-intro-line">
          all designed to help you learn, connect, and grow.
        </span>
      </div>
    </header>
  );
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardLayerRef = useRef<HTMLDivElement>(null);
  const cardTrackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);

  const [staticLayout, setStaticLayout] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const fade = fadeRef.current;
    const stage = stageRef.current;
    const cardLayer = cardLayerRef.current;
    const cardTrack = cardTrackRef.current;
    const intro = introRef.current;
    if (!section || !pin || !fade || !stage || !cardLayer || !cardTrack)
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
        const getTravel = () =>
          Math.max(0, cardTrack.scrollWidth - stage.clientWidth);

        const introLines = intro?.querySelectorAll(".journey-intro-line");
        if (introLines?.length) {
          gsap.set(introLines, { opacity: 0, y: 28 });
        }

        const scrollItems = Array.from(
          cardTrack.querySelectorAll<HTMLElement>(".journey-column")
        );
        gsap.set(scrollItems, { opacity: 0, y: 32 });
        gsap.set(cardLayer, { opacity: 0 });
        gsap.set(fade, { opacity: 0, y: "8vh" });
        gsap.set(cardTrack, { x: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => {
              const travel = getTravel();
              const enterPx = window.innerHeight * 0.35;
              const liftPx = window.innerHeight * 0.3;
              const cardsPx = window.innerHeight * 0.75;
              const trackPx = Math.max(travel, window.innerHeight) * 1.05;
              return `+=${enterPx + liftPx + cardsPx + trackPx}`;
            },
            pin: true,
            pinSpacing: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        /* 1. Section fades in — slight lift from below */
        tl.to(fade, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0);

        /* 2. Intro copy reveals */
        const lineCount = introLines?.length ?? 0;
        const lineStagger = 0.16;
        const lineDur = 0.35;
        if (introLines?.length) {
          tl.fromTo(
            introLines,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: lineDur,
              stagger: lineStagger,
              ease: "power2.out",
              immediateRender: false,
            },
            0.08
          );
        }

        const afterIntro =
          0.08 + Math.max(0, lineCount - 1) * lineStagger + lineDur + 0.08;

        /* 3. Settle to top */
        tl.to(
          fade,
          { y: 0, duration: 0.45, ease: "power3.out" },
          afterIntro
        );

        const afterLift = afterIntro + 0.45 + 0.06;

        /* 4. Card stage appears */
        tl.to(
          cardLayer,
          { opacity: 1, duration: 0.3, ease: "power2.out" },
          afterLift
        );

        /* 5. Reveal first 3 cards — intro exits up out of view */
        const REVEAL_COUNT = 3;
        const cardDur = 0.45;
        const cardStagger = 0.12;
        const revealStart = afterLift + 0.18;
        const revealCards = scrollItems.slice(0, REVEAL_COUNT);
        const restCards = scrollItems.slice(REVEAL_COUNT);

        /* Cards 4+ stay hidden until the first three finish */
        if (restCards.length) {
          gsap.set(restCards, { opacity: 0, y: 0 });
        }

        if (intro) {
          const introExitDur = 0.7;
          gsap.set(intro, { height: intro.offsetHeight });
          tl.to(
            intro,
            {
              y: () => -(intro.offsetHeight + 48),
              opacity: 0,
              duration: introExitDur,
              ease: "power2.inOut",
            },
            revealStart
          );
          tl.to(
            intro,
            {
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0,
              duration: introExitDur,
              ease: "power2.inOut",
            },
            revealStart
          );
        }

        if (revealCards.length) {
          tl.to(
            revealCards,
            {
              opacity: 1,
              y: 0,
              duration: cardDur,
              stagger: cardStagger,
              ease: "power2.out",
            },
            revealStart + 0.12
          );
        }

        const afterReveal =
          revealStart +
          Math.max(0, revealCards.length - 1) * cardStagger +
          cardDur +
          0.25;

        if (restCards.length) {
          tl.set(restCards, { opacity: 1, y: 0 }, afterReveal);
        }

        /* 6. Horizontal scroll through the full track */
        const scrollAt = afterReveal + 0.1;
        const scrollDur = 5.5;
        tl.to(
          cardTrack,
          {
            x: () => -getTravel(),
            ease: "none",
            duration: scrollDur,
          },
          scrollAt
        );
      }, section);

      revert = () => ctx.revert();

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      removeListeners = () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
      };

      /* Layout settles after images/fonts — refresh pin distance */
      requestAnimationFrame(() => {
        requestAnimationFrame(refresh);
      });
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

      {/* Scroll buffer so hero zoom/whiteout can finish before Journey pins */}
      <div className="hero-journey-seam" aria-hidden="true" />

      <div className="journey-pin" ref={pinRef}>
        <div className="journey-fade" ref={fadeRef}>
          <JourneyIntro introRef={introRef} />

          <div className="journey-stage" ref={stageRef}>
            <div className="journey-card-layer" ref={cardLayerRef}>
              <div className="journey-card-track" ref={cardTrackRef}>
                {panels.map((panel, panelIndex) => (
                  <JourneyColumn
                    key={panel.id}
                    panel={panel}
                    variant={
                      COLUMN_VARIANTS[panelIndex % COLUMN_VARIANTS.length]
                    }
                    id={`journey-${panel.id}`}
                    priority={panelIndex === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
