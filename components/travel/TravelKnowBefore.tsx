"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal, { EASE_SOFT, REVEAL_CASCADE } from "@/components/Reveal";
import { TRAVEL_KNOW_BEFORE } from "@/lib/travel-info";

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      className="travel-accordion-chevron"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.4, ease: EASE_SOFT }}
    >
      <path
        d="M4.5 6.75L9 11.25L13.5 6.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function AccordionItem({
  id,
  title,
  children,
  open,
  onToggle,
  index,
}: {
  id: string;
  title: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const panelId = `travel-know-panel-${id}`;
  const buttonId = `travel-know-button-${id}`;

  return (
    <Reveal
      className="travel-accordion-item"
      delay={0.04 + index * 0.04}
      y={18}
      duration={0.75}
    >
      <h3 className="travel-accordion-heading">
        <button
          id={buttonId}
          type="button"
          className="travel-accordion-trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span>{title}</span>
          <Chevron open={open} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="travel-accordion-panel"
            initial={
              reduceMotion
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            animate={{ height: "auto", opacity: 1 }}
            exit={
              reduceMotion
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.45, ease: EASE_SOFT },
                    opacity: { duration: 0.35, ease: EASE_SOFT, delay: 0.05 },
                  }
            }
          >
            <div className="travel-accordion-panel-inner">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Reveal>
  );
}

export default function TravelKnowBefore() {
  const [openId, setOpenId] = useState<string | null>(
    TRAVEL_KNOW_BEFORE[0]?.id ?? null
  );

  return (
    <section
      className="travel-know"
      aria-labelledby="travel-know-heading"
    >
      <div className="wrap travel-know-inner">
        <Reveal delay={REVEAL_CASCADE.title}>
          <h2 className="travel-section-heading" id="travel-know-heading">
            Know Before You Go
          </h2>
        </Reveal>
        <div className="travel-accordion">
          {TRAVEL_KNOW_BEFORE.map((item, index) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              title={item.title}
              index={index}
              open={openId === item.id}
              onToggle={() =>
                setOpenId((current) =>
                  current === item.id ? null : item.id
                )
              }
            >
              <p>{item.body}</p>
              {item.href && item.hrefLabel ? (
                <p>
                  <a href={item.href}>{item.hrefLabel}</a>
                </p>
              ) : null}
            </AccordionItem>
          ))}
        </div>
      </div>
    </section>
  );
}
