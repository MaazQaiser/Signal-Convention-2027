"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal, { EASE_SOFT, REVEAL_CASCADE } from "@/components/Reveal";
import { CONVENTION_FAQS, type FaqEntry } from "@/lib/faqs";

const FADE = { once: false as const, amount: 0.2 };

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      className="faq-chevron"
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

function FaqItem({
  item,
  index,
  open,
  onToggle,
  idPrefix,
}: {
  item: FaqEntry;
  index: number;
  open: boolean;
  onToggle: () => void;
  idPrefix: string;
}) {
  const reduceMotion = useReducedMotion();
  const panelId = `${idPrefix}-panel-${index}`;
  const buttonId = `${idPrefix}-button-${index}`;

  return (
    <Reveal
      className="faq-item"
      delay={0.04 + index * 0.04}
      y={18}
      duration={0.75}
      {...FADE}
    >
      <h3 className="faq-item-heading">
        <button
          id={buttonId}
          type="button"
          className="faq-trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="faq-question">{item.q}</span>
          <Chevron open={open} />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="faq-panel"
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
            <div className="faq-panel-inner">
              <p className="faq-answer">{item.a}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Reveal>
  );
}

export default function FaqsList({
  items = CONVENTION_FAQS,
  intro,
}: {
  items?: FaqEntry[];
  intro?: ReactNode;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="faqs-page-list page-surface--light"
      id="faq-list"
      aria-labelledby="faqs-page-list-heading"
    >
      <div className="wrap faqs-page-list-inner">
        <Reveal className="faqs-page-list-intro" {...FADE}>
          <p className="faqs-page-list-label">Answers</p>
          <h2
            className="faqs-page-list-title"
            id="faqs-page-list-heading"
          >
            Everything You Need to Know
          </h2>
          {intro ?? (
            <p className="faqs-page-list-lede">
              Find answers to common questions about registration, your stay,
              and the Here We Grow 2027 experience.
            </p>
          )}
        </Reveal>

        <div className="faqs-page-list-items" role="list">
          {items.map((item, index) => (
            <div key={item.q} role="listitem">
              <FaqItem
                item={item}
                index={index}
                idPrefix="faqs-page"
                open={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) =>
                    current === index ? null : index
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
