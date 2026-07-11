"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { EASE_SOFT } from "./Reveal";

const links = [
  { label: "Home", href: "#top" },
  { label: "Merch", href: "#merch" },
  { label: "Experience", href: "#agenda" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  return (
    <motion.nav
      className={`nav${scrolled ? " scrolled" : ""}`}
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.15, ease: EASE_SOFT, delay: 0.55 }}
    >
      <a className="nav-brand" href="#top" aria-label="Signal 2027 — Here We Grow">
        <img
          src="/brand/nav-logo-27-dark.svg"
          alt="Signal 2027 — Here We Grow"
          height={28}
        />
      </a>
      <div className="nav-links">
        {links.map((l) => (
          <a key={l.label} className="nav-pill" href={l.href}>
            {l.label}
          </a>
        ))}
        <a className="nav-reserve" href="#register">
          Reserve your spot
        </a>
      </div>
    </motion.nav>
  );
}
