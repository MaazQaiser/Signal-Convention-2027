let registered = false;

export async function loadGsap() {
  const gsapModule = await import("gsap");
  const scrollTriggerModule = await import("gsap/ScrollTrigger");

  const gsap = gsapModule.default ?? gsapModule.gsap;
  const ScrollTrigger =
    scrollTriggerModule.ScrollTrigger ?? scrollTriggerModule.default;

  if (!gsap || !ScrollTrigger) {
    throw new Error("Failed to load GSAP or ScrollTrigger");
  }

  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }

  return { gsap, ScrollTrigger };
}
