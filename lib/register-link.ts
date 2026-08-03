/**
 * Cvent registration — the single source of truth for every Register CTA.
 *
 * Previously each button pointed at the in-page `#register` section (and the
 * closing CTA at a bare `#`, which went nowhere). Registration now happens off
 * site, so change it here and every button follows.
 *
 * The `/#register` section itself is intentionally left in place: it still
 * carries the closing copy, and lib/section-nav.ts uses that id for scroll
 * tracking.
 */
export const REGISTER_URL = "https://cvent.me/9E4wo5";
