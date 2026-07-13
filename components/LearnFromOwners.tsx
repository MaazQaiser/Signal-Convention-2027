"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { loadGsap } from "@/lib/load-gsap";

const CARDS = {
  left: {
    src: "/images/convention-2026-0777.jpg",
    alt: "Franchise owners connecting at Here We Grow",
    label: "Franchise Owners",
    caption: "What's driving results in their markets",
  },
  right: {
    src: "/images/convention-2026-0692.jpg",
    alt: "Franchise teams sharing ideas at the convention",
    label: "Their Teams",
    caption: "Lessons learned from the floor",
  },
} as const;

const TITLE_LINES = [
  "Learn From Franchise Owners",
  "and Their Teams",
] as const;

const CARD_HEADING_LINES = [
  "The Best Ideas",
  "Come From the Field.",
] as const;

const BODY_COPY =
  "Learn from the people leading teams, serving customers, and growing their businesses every day.";

export default function LearnFromOwners() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [staticLayout, setStaticLayout] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;
    if (!section || !pin || !title || !grid) return;

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

    void loadGsap().then(({ gsap }) => {
      if (disposed) return;

      const titleLines = title.querySelectorAll(".learn-line");
      const copyCard = grid.querySelector(".learn-card--copy");
      const mediaCards = grid.querySelectorAll(".learn-card--media");
      const overlayLines = grid.querySelectorAll(
        ".learn-card--media .learn-line"
      );
      const gridCards = grid.querySelectorAll(".learn-card");

      const ctx = gsap.context(() => {
        gsap.set(titleLines, { opacity: 0, y: 22 });
        gsap.set(gridCards, { opacity: 0, y: 28 });
        gsap.set(overlayLines, { opacity: 0, y: 14 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${window.innerHeight * 2.8}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          titleLines,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.38,
            ease: "power2.out",
          },
          0.12
        );

        const afterTitle = 0.12 + titleLines.length * 0.38 + 0.35;

        // Title first, then all three cards together (copy never ahead of photos)
        tl.to(
          gridCards,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
          },
          afterTitle
        );
        tl.to(
          overlayLines,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.16,
            ease: "power2.out",
          },
          afterTitle + 0.35
        );

        // Keep copy text fully opaque once the card is in (avoids stuck-hidden lines)
        if (copyCard) {
          tl.set(
            copyCard.querySelectorAll(".learn-line, .learn-card-body"),
            { opacity: 1, y: 0 },
            afterTitle
          );
        }

        tl.to({}, { duration: 0.85 }, afterTitle + 1.1);
      }, section);

      revert = () => ctx.revert();
    });

    return () => {
      disposed = true;
      revert?.();
    };
  }, []);

  return (
    <section
      className={`learn-owners${staticLayout ? " learn-owners--static" : ""}`}
      id="learn"
      ref={sectionRef}
      aria-labelledby="learn-owners-title"
    >
      <div className="learn-owners-pin" ref={pinRef}>
        <div className="learn-owners-inner">
          <h2
            className="learn-owners-title"
            id="learn-owners-title"
            ref={titleRef}
          >
            {TITLE_LINES.map((line) => (
              <span key={line} className="learn-line">
                {line}
              </span>
            ))}
          </h2>

          <div className="learn-owners-grid" ref={gridRef}>
            <article className="learn-card learn-card--media">
              <Image
                src={CARDS.left.src}
                alt={CARDS.left.alt}
                fill
                sizes="(max-width: 900px) 100vw, 32vw"
                className="learn-card-img"
                priority
              />
              <div className="learn-card-overlay">
                <span className="learn-card-label learn-line">
                  {CARDS.left.label}
                </span>
                <span className="learn-card-caption learn-line">
                  {CARDS.left.caption}
                </span>
              </div>
            </article>

            <article className="learn-card learn-card--copy">
              <div className="learn-card-copy-stack">
                <h3 className="learn-card-heading">
                  {CARD_HEADING_LINES.map((line) => (
                    <span key={line} className="learn-line">
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="learn-card-body">{BODY_COPY}</p>
              </div>
            </article>

            <article className="learn-card learn-card--media learn-card--media-dark">
              <Image
                src={CARDS.right.src}
                alt={CARDS.right.alt}
                fill
                sizes="(max-width: 900px) 100vw, 32vw"
                className="learn-card-img"
              />
              <div className="learn-card-overlay">
                <span className="learn-card-label learn-line">
                  {CARDS.right.label}
                </span>
                <span className="learn-card-caption learn-line">
                  {CARDS.right.caption}
                </span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
