"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Aftermovie() {
  return (
    <section className="movie">
      {/* PLACEHOLDER: replace this frame with <video autoPlay muted loop playsInline poster="..."> */}
      <motion.div
        className="movie-frame"
        role="button"
        tabIndex={0}
        aria-label="Play the 2026 aftermovie"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
      >
        {/* 2026 convention photo with brand gradient overlay (per guide imagery rule) */}
        <Image
          className="movie-bg"
          src="/images/convention-2026-1151.jpg"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="play">
          <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
            <path d="M0 0L22 13L0 26V0Z" fill="#FFFFFF" />
          </svg>
        </div>
        <h3>This is what a signal sounds like.</h3>
        <span>2026 AFTERMOVIE · TAP FOR SOUND</span>
      </motion.div>
    </section>
  );
}
