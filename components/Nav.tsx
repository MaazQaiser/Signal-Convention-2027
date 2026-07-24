"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { EASE_SOFT } from "./Reveal";
import {
  getNavLinks,
  isNavLinkActive,
  resolveNavHref,
} from "@/lib/nav-links";

const LIGHT_SURFACE_SELECTOR = [
  "[data-nav-theme='light']",
  ".page-surface--light",
  ".agenda-surface--light",
  ".journey-pin",
  ".hero-whiteout.is-held",
].join(", ");

function isOverlappingLightSurface(navBottom: number, navTop: number) {
  const sampleY = (navTop + navBottom) / 2;
  const surfaces = document.querySelectorAll(LIGHT_SURFACE_SELECTOR);

  for (const surface of surfaces) {
    const rect = surface.getBoundingClientRect();
    if (rect.top < navBottom && rect.bottom > navTop) {
      // Prefer the surface that actually covers the nav midline
      if (rect.top <= sampleY && rect.bottom >= sampleY) {
        return true;
      }
    }
  }

  // Fallback: any light surface overlapping the nav band
  for (const surface of surfaces) {
    const rect = surface.getBoundingClientRect();
    if (rect.top < navBottom && rect.bottom > navTop) {
      return true;
    }
  }

  return false;
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const { scrollY } = useScroll();
  const links = getNavLinks();

  const syncTheme = useCallback(() => {
    const nav = document.querySelector<HTMLElement>(".nav");
    if (!nav) return;
    const { top, bottom } = nav.getBoundingClientRect();
    setOnLight(isOverlappingLightSurface(bottom, top));
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        syncTheme();
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const lenis = window.__lenis;
    lenis?.on("scroll", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      lenis?.off("scroll", update);
    };
  }, [pathname, syncTheme]);

  const homeHref = resolveNavHref({ label: "Overview", href: "top" }, pathname);
  const registerHref = resolveNavHref(
    { label: "Register", href: "register" },
    pathname
  );

  return (
    <motion.nav
      className={`nav${scrolled ? " scrolled" : ""}${onLight ? " on-light" : ""}`}
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
          src={
            onLight
              ? "/brand/nav-logo-27-light.svg"
              : "/brand/nav-logo-27-dark.svg"
          }
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
