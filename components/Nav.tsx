"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { EASE_SOFT } from "./Reveal";
import {
  getNavLinks,
  isNavLinkActive,
  resolveNavHref,
} from "@/lib/nav-links";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const links = getNavLinks();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const homeHref = resolveNavHref({ label: "Overview", href: "top" }, pathname);
  const registerHref = resolveNavHref(
    { label: "Register", href: "register" },
    pathname
  );

  return (
    <motion.nav
      className={`nav${scrolled ? " scrolled" : ""}`}
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.15, ease: EASE_SOFT, delay: 0.55 }}
    >
      <a
        className="nav-brand"
        href={homeHref}
        aria-label="Signal 2027 — Here We Grow"
      >
        <img
          src="/brand/nav-logo-27-dark.svg"
          alt="Signal 2027 — Here We Grow"
          height={36}
        />
      </a>
      <div className="nav-links">
        {links.map((l) => {
          const href = resolveNavHref(l, pathname);
          const active = isNavLinkActive(l, pathname);
          return (
            <a
              key={l.label}
              className={`nav-pill${active ? " is-active" : ""}`}
              href={href}
              aria-current={active ? "page" : undefined}
            >
              {l.label}
            </a>
          );
        })}
        <a className="nav-reserve" href={registerHref}>
          Register
        </a>
      </div>
    </motion.nav>
  );
}
