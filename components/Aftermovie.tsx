"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Aftermovie() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (dismissed || !ready) return;
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      el.muted = true;
      const play = el.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {});
      }
    };

    if (el.readyState >= 2) {
      tryPlay();
    } else {
      el.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      el.removeEventListener("canplay", tryPlay);
    };
  }, [dismissed, ready]);

  useEffect(() => {
    if (!expanded) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const el = videoRef.current;
    if (!el) return;
    void el.play().catch(() => {});
  }, [expanded]);

  const openFullscreen = () => setExpanded(true);
  const minimize = (e: MouseEvent) => {
    e.stopPropagation();
    setExpanded(false);
  };
  const dismiss = (e: MouseEvent) => {
    e.stopPropagation();
    setExpanded(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {!dismissed && ready ? (
        <motion.aside
          className={
            expanded ? "recap-float recap-float--expanded" : "recap-float"
          }
          aria-labelledby="recap-float-heading"
          aria-expanded={expanded}
          role={expanded ? "dialog" : undefined}
          aria-modal={expanded || undefined}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          onClick={expanded ? undefined : openFullscreen}
        >
          <div className="recap-float-media">
            <video
              ref={videoRef}
              className="recap-float-video"
              src="/videos/destination.mp4"
              poster="/images/convention-2026-1151.jpg"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              controls={false}
              aria-label="Here We Grow 2026 convention recap"
            />

            {expanded ? (
              <button
                type="button"
                className="recap-float-minimize"
                onClick={minimize}
                aria-label="Minimize 2026 recap"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect
                    x="2.75"
                    y="2.75"
                    width="10.5"
                    height="10.5"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className="recap-float-close"
                onClick={dismiss}
                aria-label="Dismiss 2026 recap"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 2l8 8M10 2L2 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {!expanded ? (
            <p className="recap-float-label" id="recap-float-heading">
              Convention 2026 Recap
              <svg
                className="recap-float-label-arrow"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>
          ) : (
            <p className="recap-float-expanded-title" id="recap-float-heading">
              Convention 2026 Recap
            </p>
          )}
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
