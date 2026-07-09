export const HERO_PHASE = {
  modelToCornerEnd: 0.38,
  handoffEnterEnd: 0.52,
  handoffHoldEnd: 0.62,
  handoffExitEnd: 0.72,
  modelToCenterStart: 0.62,
  heroConcludeStart: 0.88,
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
    1
  );

  const introLift = phaseProgress(eased, 0, HERO_PHASE.modelToCornerEnd);
  const metaLift = phaseProgress(eased, 0, HERO_PHASE.modelToCornerEnd * 0.85);

  const handoffEnter = phaseProgress(
    eased,
    HERO_PHASE.modelToCornerEnd,
    HERO_PHASE.handoffEnterEnd
  );
  const handoffExit = phaseProgress(
    eased,
    HERO_PHASE.handoffHoldEnd,
    HERO_PHASE.handoffExitEnd
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
    introLift,
    metaLift,
    handoffEnter,
    handoffExit,
    heroConclude,
    handoffVisible: handoffEnter > 0.02 && handoffExit < 0.98,
    handoffY: (1 - handoffEnter) * 14 - handoffExit * 10,
  };
}
