"use client";

import { useGLTF, useProgress } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";

const MODEL_PATH = "/models/modal.gltf";
const HOLD_AT_COMPLETE_MS = 480;
const REVEAL_DURATION_MS = 1450;
const FALLBACK_REVEAL_MS = 45000;
/** How quickly the displayed bar chases real load progress (lower = smoother). */
const PROGRESS_LERP = 0.065;

type LoaderPhase = "loading" | "exiting" | "done";

type LoadingGateProps = {
  children: ReactNode;
};

export default function LoadingGate({ children }: LoadingGateProps) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<LoaderPhase>(
    reduceMotion ? "done" : "loading"
  );
  const [shownProgress, setShownProgress] = useState(0);
  const [modelReady, setModelReady] = useState(!!reduceMotion);
  const { progress, active } = useProgress();
  const preloadStarted = useRef(false);
  const targetProgress = useRef(0);
  const displayProgress = useRef(0);
  const phaseRef = useRef(phase);
  const activeRef = useRef(active);
  const rawProgressRef = useRef(progress);
  const modelReadyRef = useRef(modelReady);
  phaseRef.current = phase;
  activeRef.current = active;
  rawProgressRef.current = progress;
  modelReadyRef.current = modelReady;

  useEffect(() => {
    if (reduceMotion || preloadStarted.current) return;
    preloadStarted.current = true;

    /* Warm chunk + GLTF so hero Canvas is ready under the cover */
    void import("@/components/HeroModel3D");

    const warm = async () => {
      try {
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const loader = new GLTFLoader();
        await new Promise<void>((resolve, reject) => {
          loader.load(MODEL_PATH, () => resolve(), undefined, reject);
        });
        /* Also prime drei's cache used by HeroModel3D */
        useGLTF.preload(MODEL_PATH);
        setModelReady(true);
        targetProgress.current = 100;
      } catch {
        useGLTF.preload(MODEL_PATH);
        setModelReady(true);
      }
    };

    void warm();
  }, [reduceMotion]);

  useEffect(() => {
    if (phase === "done") return;
    targetProgress.current = Math.min(
      100,
      Math.max(targetProgress.current, progress)
    );
  }, [progress, phase]);

  useEffect(() => {
    if (reduceMotion || phase === "done") return;

    let raf = 0;
    let holdTimer: number | undefined;

    const tick = () => {
      const target = targetProgress.current;
      const current = displayProgress.current;
      const delta = target - current;

      if (Math.abs(delta) < 0.04) {
        displayProgress.current = target;
      } else {
        displayProgress.current = current + delta * PROGRESS_LERP;
      }

      setShownProgress(displayProgress.current);

      const loadComplete =
        modelReadyRef.current &&
        !activeRef.current &&
        (rawProgressRef.current >= 100 || modelReadyRef.current) &&
        displayProgress.current >= 99.6;

      if (
        phaseRef.current === "loading" &&
        loadComplete &&
        holdTimer === undefined
      ) {
        holdTimer = window.setTimeout(() => {
          setPhase("exiting");
        }, HOLD_AT_COMPLETE_MS);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (holdTimer !== undefined) window.clearTimeout(holdTimer);
    };
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const reveal = window.setTimeout(
      () => setPhase("done"),
      REVEAL_DURATION_MS
    );
    return () => window.clearTimeout(reveal);
  }, [phase]);

  useEffect(() => {
    if (reduceMotion || phase === "done") return;
    const fallback = window.setTimeout(
      () => setPhase("exiting"),
      FALLBACK_REVEAL_MS
    );
    return () => window.clearTimeout(fallback);
  }, [reduceMotion, phase]);

  useEffect(() => {
    const loading = phase === "loading" || phase === "exiting";
    document.body.classList.toggle("is-loading", loading);
    document.body.classList.toggle("is-revealed", phase === "done");
    document.body.style.overflow = loading ? "hidden" : "";

    return () => {
      document.body.classList.remove("is-loading", "is-revealed");
      document.body.style.overflow = "";
    };
  }, [phase]);

  const showCover = phase === "loading" || phase === "exiting";
  const barProgress = Math.min(100, Math.max(0, shownProgress));
  const labelProgress = Math.round(barProgress);
  /* Keep content in the layout (visibility visible) so WebGL can warm under the cover */
  const contentWarming = phase !== "done";

  return (
    <>
      <SmoothScroll active={phase === "done"} />

      {showCover ? (
        <div
          className={`cover-loader${
            phase === "exiting" ? " cover-loader--exiting" : ""
          }`}
          role="status"
          aria-live="polite"
          aria-label={`Loading site ${labelProgress} percent`}
        >
          <div className="cover-loader__mark" aria-hidden="true">
            <img
              src="/brand/logo-stroke.svg"
              alt=""
              className="cover-loader__logo"
              width={1000}
              height={1000}
              draggable={false}
            />
          </div>

          <p className="cover-loader__percent">
            <span className="cover-loader__value">{labelProgress}</span>
            <span className="cover-loader__symbol">%</span>
          </p>

          <div className="cover-loader__track" aria-hidden="true">
            <div
              className="cover-loader__bar"
              style={{ transform: `scaleX(${barProgress / 100})` }}
            />
          </div>
        </div>
      ) : null}

      <div
        className={`loading-gate__content${
          phase === "done" ? " loading-gate__content--visible" : ""
        }${contentWarming ? " loading-gate__content--warming" : ""}`}
      >
        {children}
      </div>
    </>
  );
}
