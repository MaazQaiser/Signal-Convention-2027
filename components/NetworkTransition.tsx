"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const BRANDS = [
  {
    id: "signal",
    logo: "/brand/signal.svg",
    logoWidth: 132,
    logoHeight: 38,
    tagline: "Building the foundation for a stronger, smarter future.",
  },
  {
    id: "filtergo",
    logo: "/brand/filtergo.svg",
    logoWidth: 132,
    logoHeight: 40,
    tagline: "Innovating how we work today to shape what's next.",
  },
] as const;

function fadeUp(delay: number, reduceMotion: boolean | null) {
  if (reduceMotion) {
    return { initial: false, animate: { opacity: 1, y: 0 } };
  }

  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: EASE, delay },
  };
}

export default function NetworkTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const active = isInView || reduceMotion;

  const eyebrow = fadeUp(0, reduceMotion);
  const heading = fadeUp(0.08, reduceMotion);
  const body = fadeUp(0.16, reduceMotion);
  const cards = fadeUp(0.24, reduceMotion);
  const signalCard = fadeUp(0.34, reduceMotion);
  const filtergoCard = fadeUp(0.48, reduceMotion);

  return (
    <section
      className="network-transition"
      ref={sectionRef}
      aria-labelledby="network-transition-heading"
    >
      <div className="network-transition-inner">
        <div className="network-transition-copy">
          <motion.p
            className="network-transition-eyebrow"
            {...eyebrow}
            animate={active ? eyebrow.animate : eyebrow.initial}
          >
            Our Growing Network
          </motion.p>

          <motion.h2
            className="network-transition-heading"
            id="network-transition-heading"
            {...heading}
            animate={active ? heading.animate : heading.initial}
          >
            From One Brand to a Growing Community.
          </motion.h2>

          <motion.p
            className="network-transition-body"
            {...body}
            animate={active ? body.animate : body.initial}
          >
            What began with Signal continues to grow. In 2027, we&apos;re proud
            to welcome the Filtergo community to Here We Grow.
          </motion.p>
        </div>

        <motion.div
          className="network-transition-cards"
          {...cards}
          animate={active ? cards.animate : cards.initial}
        >
          <motion.article
            className="network-transition-card network-transition-card--signal"
            {...signalCard}
            animate={active ? signalCard.animate : signalCard.initial}
          >
            <Image
              src={BRANDS[0].logo}
              alt="Signal"
              width={BRANDS[0].logoWidth}
              height={BRANDS[0].logoHeight}
              className="network-transition-card-logo"
            />
            <span className="network-transition-card-rule" aria-hidden="true" />
            <p className="network-transition-card-tagline">{BRANDS[0].tagline}</p>
          </motion.article>

          <motion.article
            className="network-transition-card network-transition-card--filtergo"
            {...filtergoCard}
            animate={active ? filtergoCard.animate : filtergoCard.initial}
          >
            <Image
              src={BRANDS[1].logo}
              alt="Filtergo"
              width={BRANDS[1].logoWidth}
              height={BRANDS[1].logoHeight}
              className="network-transition-card-logo"
            />
            <span className="network-transition-card-rule" aria-hidden="true" />
            <p className="network-transition-card-tagline">{BRANDS[1].tagline}</p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
