"use client";

import Reveal, { REVEAL_CASCADE } from "./Reveal";

export default function Register() {
  return (
    <section
      className="register"
      id="register"
      aria-labelledby="register-heading"
    >
      <div className="wrap closing-cta">
        <div className="closing-cta-copy">
          <Reveal delay={REVEAL_CASCADE.title}>
            <h2 className="closing-cta-title" id="register-heading">
              Ready to Grow?
            </h2>
          </Reveal>
          <Reveal delay={REVEAL_CASCADE.body}>
            <p className="closing-cta-lede">
              We can&apos;t wait to welcome you to Here We Grow 2027. Register
              today.
            </p>
          </Reveal>
        </div>

        <Reveal className="closing-cta-action" delay={REVEAL_CASCADE.cta}>
          <a className="btn btn-orange closing-cta-btn" href="#">
            Register Today
          </a>
        </Reveal>
      </div>
    </section>
  );
}
