"use client";

import { useGLTF, useProgress } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BRANDMARK_MODEL_PATH } from "@/lib/brandmark-model";
import SmoothScroll from "./SmoothScroll";

const MODEL_PATH = BRANDMARK_MODEL_PATH;
/*
 * Decoded byte size of the brandmark glb, used only to render the progress bar.
 * Update alongside BRANDMARK_MODEL_PATH when the asset is regenerated.
 *
 * The bar used to be driven by drei's useProgress, which is item-count based
 * (itemsLoaded / itemsTotal). With a handful of registered items the small
 * ones resolved instantly and the bar jumped to a fraction — 33% — then sat
 * there for the entire multi-megabyte model download, which read as a hang.
 *
 * Byte progress can't come from the ProgressEvent: Vercel serves the .glb
 * brotli-encoded with no Content-Length, so `event.total` is 0. Comparing
 * `event.loaded` against the known decoded size is what's left. If the asset
 * is replaced and this constant drifts, the bar is merely less accurate —
 * completion is still driven by the load callback, never by this number.
 */
const MODEL_DECODED_BYTES = 9_039_324;
/*
 * How long the cover will wait for the brandmark once the page shell itself is
 * ready. Under this, the reveal happens with the mark already in place — the
 * polished case, and the common one now the model is 8.6MB. Over it, the cover
 * leaves anyway and the mark fades in when it lands, so a slow connection gets
 * a usable page in ~1.5s instead of staring at an opaque cover.
 */
const SHELL_GRACE_MS = 1500;
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
  const [shellReady, setShellReady] = useState(!!reduceMotion);
  const [forceReveal, setForceReveal] = useState(false);
  const { progress, active } = useProgress();
  const preloadStarted = useRef(false);
  const forceRevealRef = useRef(forceReveal);
  forceRevealRef.current = forceReveal;
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

    /* Warm chunk + GLTF so hero Canvas is ready under the cover. Once the
       chunk lands the page shell can render, which is what starts the grace
       clock below — the model is no longer a hard prerequisite for paint. */
    void import("@/components/HeroModel3D").then(
      () => setShellReady(true),
      () => setShellReady(true)
    );

    const warm = async () => {
      try {
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const { MeshoptDecoder } = await import(
          "three/examples/jsm/libs/meshopt_decoder.module.js"
        );
        const loader = new GLTFLoader();
        /* Model ships meshopt-compressed; drei's useGLTF wires this up itself. */
        loader.setMeshoptDecoder(MeshoptDecoder);
        await new Promise<void>((resolve, reject) => {
          loader.load(
            MODEL_PATH,
            () => resolve(),
            (event) => {
              /* `event.total` is 0 behind brotli, so measure against the
                 known decoded size. Hold below 100 so only the load
                 callback can declare completion. */
              const fraction = event.loaded / MODEL_DECODED_BYTES;
              const pct = Math.min(99, Math.max(0, fraction * 100));
              targetProgress.current = Math.max(targetProgress.current, pct);
            },
            reject
          );
        });
        /* Also prime drei's cache used by HeroModel3D */
        useGLTF.preload(MODEL_PATH);
        setModelReady(true);
        targetProgress.current = 100;
      } catch (error) {
        /*
         * Previously this swallowed the error AND left targetProgress where it
         * stalled, so a failed model load left the cover sitting at a partial
         * percentage until FALLBACK_REVEAL_MS (45s) elapsed. Release the gate
         * immediately instead — the hero is perfectly usable without the
         * brandmark — and surface the reason rather than hiding it.
         */
        console.error("[LoadingGate] brandmark preload failed", error);
        useGLTF.preload(MODEL_PATH);
        setModelReady(true);
        targetProgress.current = 100;
      }
    };

    void warm();
  }, [reduceMotion]);

  /*
   * Once the shell can paint, give the brandmark SHELL_GRACE_MS to show up and
   * then reveal regardless. This is what takes the model off the critical path:
   * first paint is bounded by the shell, not by however long the asset takes.
   */
  useEffect(() => {
    if (reduceMotion || !shellReady || modelReady || phase !== "loading") return;
    const t = window.setTimeout(() => {
      /* Nothing further is being waited on, so let the bar complete rather
         than leaving it stranded mid-count as the cover pulls away. */
      targetProgress.current = 100;
      setForceReveal(true);
    }, SHELL_GRACE_MS);
    return () => window.clearTimeout(t);
  }, [reduceMotion, shellReady, modelReady, phase]);

  /* Fades the brandmark in if it arrives after the cover has already gone. */
  useEffect(() => {
    document.body.classList.toggle("brandmark-ready", modelReady);
    return () => document.body.classList.remove("brandmark-ready");
  }, [modelReady]);

  /*
   * `progress` from useProgress deliberately no longer feeds the bar. It is
   * itemsLoaded/itemsTotal, so it can only ever report coarse fractions —
   * that is what pinned the display at 33% while the model streamed. The bar
   * is driven by real bytes in warm()'s onProgress instead; useProgress is
   * still consumed below, but only for its `active` flag.
   */

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

      /*
       * Two ways out: the brandmark genuinely arrived, or the grace period
       * expired and we are revealing without it. The `!active` guard only
       * applies to the first — when forcing, drei's loading manager is still
       * mid-flight by definition, so requiring it idle would deadlock.
       */
      const loadComplete =
        displayProgress.current >= 99.6 &&
        (forceRevealRef.current ||
          (modelReadyRef.current && !activeRef.current));

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
  /*
   * Reveal the content when the cover STARTS leaving, not when it finishes.
   *
   * The cover fades over 1.25s (.cover-loader) but "done" only arrives after
   * REVEAL_DURATION_MS (1.45s), and the content faded up from opacity 0 only
   * from that point. So the cover went fully transparent ~280ms before
   * anything replaced it, and then the page faded up *from black* — several
   * seconds of darkness after the loader hit 100%.
   *
   * Marking the content visible during "exiting" turns that hand-off into a
   * crossfade: the content is already lit underneath while the cover fades
   * away over it.
   */
  const contentVisible = phase === "exiting" || phase === "done";

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
          contentVisible ? " loading-gate__content--visible" : ""
        }${contentWarming ? " loading-gate__content--warming" : ""}`}
      >
        {children}
      </div>
    </>
  );
}
