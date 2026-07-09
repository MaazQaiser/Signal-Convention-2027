"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const VIDEO_ID = "3voCunvlSs4";
const START_SECONDS = 64;

function buildEmbedUrl(origin?: string) {
  const params = new URLSearchParams({
    start: String(START_SECONDS),
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: VIDEO_ID,
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
  });

  if (origin) {
    params.set("origin", origin);
  }

  return `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?${params.toString()}`;
}

export default function Agenda() {
  const videoRef = useRef<HTMLDivElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const loadVideo = () => {
      setVideoSrc(
        (current) => current ?? buildEmbedUrl(window.location.origin)
      );
    };

    if (window.location.hash === "#agenda") {
      loadVideo();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadVideo();
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "400px 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="agenda"
      id="agenda"
      aria-labelledby="agenda-heading"
    >
      <div className="agenda-bg" aria-hidden="true" />
      <div className="agenda-glow" aria-hidden="true" />

      <div className="agenda-inner">
        <Reveal>
          <p className="agenda-eyebrow">Inside the Convention</p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="agenda-heading" id="agenda-heading">
            An Experience Built Around Growth, Leadership, Connection, and
            Momentum
          </h2>
        </Reveal>

        <div className="agenda-video" ref={videoRef}>
          {videoSrc ? (
            <iframe
              src={videoSrc}
              title="Inside the Here We Grow Convention"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="agenda-video-loading" aria-hidden="true" />
          )}
        </div>
      </div>
    </section>
  );
}
