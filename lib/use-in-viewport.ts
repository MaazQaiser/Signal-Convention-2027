"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is near the viewport.
 *
 * Both brandmark canvases render the same 2.4M-triangle scene, and R3F's
 * default frameloop keeps drawing them even when they are scrolled far out of
 * view — so the closing model was costing frames while you read the hero, and
 * vice versa. Gate `frameloop` on this instead.
 *
 * `rootMargin` deliberately leads the viewport so the loop is already running
 * by the time the canvas is visible.
 */
export function useInViewport<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
