export const HERO_PHASE = {
  modelToCornerEnd: 0.28,
  handoffEnterEnd: 0.34,
  /** Longer window = slower title fill + body paragraph fades */
  handoffFillEnd: 0.64,
  handoffHoldEnd: 0.7,
  /** Text fully exits before model centers */
  handoffExitEnd: 0.76,
  /** Model settles in center, face-on */
  modelToCenterStart: 0.76,
  modelToCenterEnd: 0.82,
  /** Zoom into bright core */
  modelZoomStart: 0.82,
  modelZoomEnd: 0.9,
  /**
   * Full white — must complete before Journey is reached.
   *
   * These are in *eased* space, so 0.96 lands at raw progress ~0.88: the hero
   * then burned its last 12% of scroll (~114px) sitting on a finished, static
   * white frame. Ending at 0.99 keeps the flash to white but cuts that dead
   * tail to ~40px. The whiteout layer's bottom edge coincides with the hero's,
   * so coverage stays exact and Journey still never peeks.
   */
  whiteOutStart: 0.9,
  whiteOutEnd: 0.99,
  heroConcludeStart: 0.99,
} as const;

export function easeScrollProgress(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function phaseProgress(value: number, start: number, end: number) {
  if (end <= start) return value >= start ? 1 : 0;
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export function getHeroScrollPhases(scrollProgress: number) {
  const eased = easeScrollProgress(scrollProgress);

  const modelToCorner = phaseProgress(
    eased,
    0,
    HERO_PHASE.modelToCornerEnd
  );
  const modelToCenter = phaseProgress(
    eased,
    HERO_PHASE.modelToCenterStart,
    HERO_PHASE.modelToCenterEnd
  );
  const modelZoom = phaseProgress(
    eased,
    HERO_PHASE.modelZoomStart,
    HERO_PHASE.modelZoomEnd
  );

  const introLift = phaseProgress(eased, 0, HERO_PHASE.modelToCornerEnd);
  const metaLift = phaseProgress(eased, 0, HERO_PHASE.modelToCornerEnd * 0.85);

  const handoffEnterRaw = phaseProgress(
    eased,
    HERO_PHASE.modelToCornerEnd,
    HERO_PHASE.handoffEnterEnd
  );
  const handoffFillRaw = phaseProgress(
    eased,
    HERO_PHASE.handoffEnterEnd,
    HERO_PHASE.handoffFillEnd
  );
  const handoffExitRaw = phaseProgress(
    eased,
    HERO_PHASE.handoffHoldEnd,
    HERO_PHASE.handoffExitEnd
  );

  const handoffEnter = easeScrollProgress(handoffEnterRaw);
  /* Linear fill — easing made every line jump ahead and feel pre-filled */
  const handoffFill = handoffFillRaw;
  const handoffExit = easeScrollProgress(handoffExitRaw);

  /*
   * Linear over an already-eased input. Smoothstepping this a second time made
   * the tail asymptotic — it hit 0.99 about 10% of hero scroll early and then
   * crawled, so the hero sat on a finished white frame for ~100px.
   */
  const whiteOut = phaseProgress(
    eased,
    HERO_PHASE.whiteOutStart,
    HERO_PHASE.whiteOutEnd
  );
  const heroConclude = phaseProgress(
    eased,
    HERO_PHASE.heroConcludeStart,
    1
  );

  return {
    eased,
    modelToCorner,
    modelToCenter,
    modelZoom,
    introLift,
    metaLift,
    handoffEnter,
    handoffFill,
    handoffExit,
    whiteOut,
    heroConclude,
    handoffVisible: handoffEnterRaw > 0.02 && handoffExitRaw < 0.98,
    handoffY: (1 - handoffEnter) * 4.5 - handoffExit * 3.5,
  };
}
