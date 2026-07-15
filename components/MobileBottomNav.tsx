"use client";

import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { isNavLinkActive, resolveNavHref } from "@/lib/nav-links";

const TABS = [
  {
    label: "Home",
    href: "top",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: "Agenda",
    href: "/agenda",
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
  {
    label: "Travel",
    href: "/travel",
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5L3 8c-.2.5 0 1.1.5 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 2.6 5.6c.3.5.8.5 1.3.3l1.3-.7c.5-.2.6-.8.4-1.2Z" />
      </svg>
    ),
  },
  {
    label: "Sponsors",
    href: "/sponsors",
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L14.09 8.26 L21 9.27 L16 14.14 L17.18 21.02 L12 17.77 L6.82 21.02 L8 14.14 L3 9.27 L9.91 8.26 Z" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 200);
  });

  const registerHref = resolveNavHref(
    { label: "Register", href: "register" },
    pathname
  );

  return (
    <motion.nav
      className="mob-nav"
      initial={{ y: 80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 80, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Mobile navigation"
    >
      <div className="mob-nav-tabs">
        {TABS.map((tab) => {
          const active = isNavLinkActive(
            { label: tab.label, href: tab.href, external: tab.external },
            pathname
          );
          const href = tab.external
            ? tab.href
            : resolveNavHref(
                { label: tab.label, href: tab.href },
                pathname
              );
          return (
            <a
              key={tab.label}
              className={`mob-nav-tab${active ? " is-active" : ""}`}
              href={href}
              aria-current={active ? "page" : undefined}
            >
              <span className="mob-nav-icon">{tab.icon}</span>
              <span className="mob-nav-label">{tab.label}</span>
            </a>
          );
        })}
      </div>
      <a className="mob-nav-cta" href={registerHref}>
        Register
      </a>
    </motion.nav>
  );
}
