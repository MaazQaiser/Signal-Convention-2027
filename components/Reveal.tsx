"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Trionn-matched soft decelerate */
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/** Cascade delays: eyebrow → title → body → media/CTA */
export const REVEAL_CASCADE = {
  eyebrow: 0,
  title: 0.08,
  body: 0.16,
  media: 0.28,
  cta: 0.32,
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  duration = 0.9,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, ease: EASE_SOFT, delay }}
    >
      {children}
    </motion.div>
  );
}
