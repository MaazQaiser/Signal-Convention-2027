"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Aftermovie() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);

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

  return (
    <AnimatePresence>
      {!dismissed && ready ? (
        <motion.aside
          className="recap-float"
          aria-labelledby="recap-float-heading"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
            <button
              type="button"
              className="recap-float-close"
              onClick={() => setDismissed(true)}
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
          </div>
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
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
