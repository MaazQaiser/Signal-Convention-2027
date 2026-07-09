"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Brands() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label="Signal and Filtergo">
      <div className="brands">
        <motion.div
          className="brand-half brand-signal"
          initial={reduceMotion ? false : { x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* Official Signal logo — white/orange, on dark */}
          <img src="/brand/signal.svg" alt="Signal" height={40} />
        </motion.div>
        <motion.div
          className="brand-half brand-filtergo"
          initial={reduceMotion ? false : { x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          {/* Official Filtergo logo — green, on light */}
          <img src="/brand/filtergo.svg" alt="Filtergo" height={38} />
        </motion.div>
      </div>
      <p className="brand-note">Signal is grown by Filtergo.</p>
    </section>
  );
}
