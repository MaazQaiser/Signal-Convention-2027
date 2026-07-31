"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { HERO_PHASE } from "@/lib/hero-scroll-phases";
import { getSectionNav, type SectionNavItem } from "@/lib/section-nav";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Home: show from "Grow Through Consistency" handoff. Other pages: after #top. */
function useShowAfterHero(pathname: string) {
  const [visible, setVisible] = useState(false);
  const isHome = pathname === "/" || pathname === "";

  useEffect(() => {
    setVisible(false);

    if (isHome) {
      const update = () => {
        const hero = document.getElementById("top");
        if (!hero) {
          setVisible(true);
          return;
        }
        const scrollable = Math.max(hero.offsetHeight - window.innerHeight, 1);
        const progress = Math.min(
          1,
          Math.max(0, -hero.getBoundingClientRect().top / scrollable)
        );
        setVisible(progress >= HERO_PHASE.modelToCornerEnd);
      };

      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }

    const hero = document.getElementById("top");
    if (!hero) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname, isHome]);

  return visible;
}

export default function SectionNav() {
  const pathname = usePathname();
  const sections = getSectionNav(pathname);
  const [activeId, setActiveId] = useState("");
  const pastHero = useShowAfterHero(pathname);

  useEffect(() => {
    const next = getSectionNav(pathname);
    setActiveId(next[0]?.id ?? "");
  }, [pathname]);

  useEffect(() => {
    const pageSections = getSectionNav(pathname);
    if (pageSections.length === 0) return;

    const elements = pageSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const visible = new Map<string, number>();

    const pickActive = (list: SectionNavItem[]) => {
      if (visible.size === 0) return;
      let bestId = list[0].id;
      let bestRatio = -1;
      for (const section of list) {
        const ratio = visible.get(section.id);
        if (ratio != null && ratio > bestRatio) {
          bestRatio = ratio;
          bestId = section.id;
        }
      }
      setActiveId(bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }
        pickActive(pageSections);
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  if (sections.length === 0 || !pastHero) return null;

  const onClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToSection(id);
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className="section-nav" aria-label="Page sections">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={
            activeId === section.id
              ? "section-nav-dash is-active"
              : "section-nav-dash"
          }
          aria-label={section.label}
          aria-current={activeId === section.id ? "true" : undefined}
          onClick={(e) => onClick(e, section.id)}
        >
          <span className="section-nav-label">{section.label}</span>
        </a>
      ))}
    </nav>
  );
}
