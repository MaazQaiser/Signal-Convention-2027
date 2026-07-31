"use client";

import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import BtnArrow from "@/components/BtnArrow";

const FADE = { once: false as const, amount: 0.25 };

export default function FaqsContactCta() {
  return (
    <section
      className="faqs-page-contact page-surface--dark"
      id="contact"
      aria-labelledby="faqs-page-contact-heading"
    >
      <div className="wrap">
        <div className="faqs-page-contact-inner">
          <Reveal delay={REVEAL_CASCADE.title} {...FADE}>
            <h2
              className="faqs-page-contact-heading"
              id="faqs-page-contact-heading"
            >
              Still Have Questions?
            </h2>
          </Reveal>
          <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
            <p className="faqs-page-contact-lede">
              Our Convention Team is ready to help with registration, travel,
              accommodations, and anything else you need before you arrive.
            </p>
          </Reveal>
          <Reveal delay={REVEAL_CASCADE.cta} {...FADE}>
            <a
              className="btn btn-orange faqs-page-contact-btn"
              href="mailto:convention@teamsignal.com"
            >
              Contact Convention Team
              <BtnArrow />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
