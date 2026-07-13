"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal, { EASE_SOFT, REVEAL_CASCADE } from "./Reveal";

type FaqEntry = {
  q: string;
  a: ReactNode;
};

const FAQS: FaqEntry[] = [
  {
    q: "When and where is Here We Grow 2027?",
    a: "The 2027 Here We Grow Convention takes place January 17–19, 2027, at JW Marriott Desert Ridge Resort & Spa in Phoenix, Arizona.",
  },
  {
    q: "How do I reserve my hotel room?",
    a: "Hotel reservations can be made during the registration process. Additional nights may be requested based on hotel availability.",
  },
  {
    q: "What does registration include?",
    a: "Signal registration includes convention access, hotel accommodations for two attendees and select meals throughout the convention.",
  },
  {
    q: "What is the dress code?",
    a: "Business casual is recommended for most convention activities. Special evening events may require different attire.",
  },
  {
    q: "Can I bring a guest?",
    a: "Guests attending convention programming or meals must be registered as attendees.",
  },
  {
    q: "Still have another question?",
    a: (
      <>
        Contact{" "}
        <a href="mailto:convention@teamsignal.com">
          convention@teamsignal.com
        </a>{" "}
        and our team will be happy to assist you.
      </>
    ),
  },
];

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
}: {
  item: FaqEntry;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <Reveal
      className="faq-item"
      delay={0.04 + index * 0.05}
      y={18}
      duration={0.75}
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq" id="faq" aria-labelledby="faq-heading">
      <div className="faq-inner wrap">
        <div className="faq-layout">
          <div className="faq-left">
            <Reveal delay={REVEAL_CASCADE.eyebrow}>
              <p className="faq-eyebrow">Frequently Asked Questions</p>
            </Reveal>
            <Reveal delay={REVEAL_CASCADE.title}>
              <h2 className="faq-heading" id="faq-heading">
                Everything You Need to Know Before You Arrive.
              </h2>
            </Reveal>
            <Reveal delay={REVEAL_CASCADE.body}>
              <p className="faq-lede">
                Find answers to common questions about registration, travel,
                accommodations and your Here We Grow 2027 experience.
              </p>
            </Reveal>
          </div>

          <div className="faq-right" role="list">
            {FAQS.map((item, index) => (
              <div key={item.q} role="listitem">
                <FaqItem
                  item={item}
                  index={index}
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
      </div>
    </section>
  );
}
