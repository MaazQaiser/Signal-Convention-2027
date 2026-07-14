"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal, { EASE_SOFT, REVEAL_CASCADE } from "@/components/Reveal";
import { TRAVEL_FAQS } from "@/lib/travel-info";

const FADE = { once: false as const, amount: 0.18 };

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

export default function TravelFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="travel-faqs page-surface--light"
      id="faq"
      aria-labelledby="travel-faqs-heading"
    >
      <div className="wrap travel-faqs-inner">
        <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
          <h2 className="travel-section-heading" id="travel-faqs-heading">
            Frequently Asked Travel Questions
          </h2>
        </Reveal>
        <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
          <p className="travel-section-lede travel-faqs-lede">
            Answers to the most common questions about getting to Phoenix and
            staying at the convention hotel.
          </p>
        </Reveal>

        <div className="travel-accordion" role="list">
          {TRAVEL_FAQS.map((item, index) => {
            const open = openIndex === index;
            const panelId = `travel-faq-panel-${index}`;
            const buttonId = `travel-faq-button-${index}`;

            return (
              <div key={item.q} role="listitem">
                <Reveal
                  className="travel-accordion-item"
                  delay={0.04 + index * 0.03}
                  y={18}
                  duration={0.75}
                  {...FADE}
                >
                  <h3 className="travel-accordion-heading">
                    <button
                      id={buttonId}
                      type="button"
                      className="travel-accordion-trigger"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenIndex((current) =>
                          current === index ? null : index
                        )
                      }
                    >
                      <span>{item.q}</span>
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
                                opacity: {
                                  duration: 0.35,
                                  ease: EASE_SOFT,
                                  delay: 0.05,
                                },
                              }
                        }
                      >
                        <div className="travel-accordion-panel-inner">
                          <p>{item.a}</p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
