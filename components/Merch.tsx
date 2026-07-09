"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { loadGsap } from "@/lib/load-gsap";

function power2Out(value: number) {
  return 1 - (1 - value) * (1 - value);
}

type FloatItem = {
  id: string;
  src: string;
  alt: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width: number;
  rotate: number;
  kind: "photo" | "asset";
  revealAt: number;
};

const FLOATS: FloatItem[] = [
  {
    id: "tee",
    src: "/brand/LOGO_27_DARKMODE_CMYK.svg",
    alt: "2027 tee",
    top: "5%",
    left: "44%",
    width: 168,
    rotate: -8,
    kind: "asset",
    revealAt: 0.08,
  },
  {
    id: "crewneck",
    src: "/images/convention-2026-1151.jpg",
    alt: "Convention crewneck",
    top: "24%",
    left: "3%",
    width: 210,
    rotate: 9,
    kind: "photo",
    revealAt: 0.18,
  },
  {
    id: "pin",
    src: "/brand/beacon-2025.svg",
    alt: "Year pin",
    top: "30%",
    right: "4%",
    width: 118,
    rotate: -14,
    kind: "asset",
    revealAt: 0.28,
  },
  {
    id: "notebook",
    src: "/images/convention-2026-0777.jpg",
    alt: "Convention notebook",
    top: "54%",
    left: "6%",
    width: 198,
    rotate: 6,
    kind: "photo",
    revealAt: 0.42,
  },
  {
    id: "hoodie",
    src: "/images/convention-2026-1125.jpg",
    alt: "Convention hoodie",
    top: "10%",
    left: "10%",
    width: 176,
    rotate: -5,
    kind: "photo",
    revealAt: 0.52,
  },
  {
    id: "beacon",
    src: "/brand/beacon-2026.svg",
    alt: "2026 mark",
    top: "48%",
    right: "7%",
    width: 132,
    rotate: 12,
    kind: "asset",
    revealAt: 0.62,
  },
  {
    id: "socks",
    src: "/images/convention-2026-0692.jpg",
    alt: "Convention merch",
    top: "36%",
    right: "14%",
    width: 164,
    rotate: -7,
    kind: "photo",
    revealAt: 0.74,
  },
];

export default function Merch() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    if (!section || !pin || !stage) return;

    const floats = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-merch-float]")
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      floats.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    let ctx: { revert: () => void } | undefined;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      ctx = gsap.context(() => {
        floats.forEach((el) => {
          const item = FLOATS.find((f) => f.id === el.dataset.merchFloat);
          const rotate = item?.rotate ?? 0;

          gsap.set(el, {
            opacity: 0,
            scale: 0.82,
            y: 48,
            rotate,
          });
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.75}`,
          pin: pin,
          scrub: 0.6,
          onUpdate: (self) => {
            const progress = self.progress;

            floats.forEach((el) => {
              const item = FLOATS.find((f) => f.id === el.dataset.merchFloat);
              if (!item) return;

              const local = gsap.utils.clamp(
                0,
                1,
                (progress - item.revealAt) / 0.22
              );
              const eased = power2Out(local);

              gsap.set(el, {
                opacity: eased,
                scale: 0.82 + eased * 0.18,
                y: 48 * (1 - eased),
                rotate: item.rotate + (1 - eased) * 6,
              });
            });
          },
        });
      }, section);

      ScrollTrigger.refresh();
    });

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <section className="merch" id="merch" ref={sectionRef}>
      <div className="merch-pin" ref={pinRef}>
        <div className="merch-stage" ref={stageRef}>
          {FLOATS.map((item) => (
            <div
              key={item.id}
              className={`merch-float merch-float--${item.kind}`}
              data-merch-float={item.id}
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                bottom: item.bottom,
                width: item.width,
              }}
            >
              {item.kind === "photo" ? (
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={Math.round(item.width * 1.15)}
                  className="merch-float-photo"
                  sizes={`${item.width}px`}
                />
              ) : (
                <div className="merch-float-card">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.width}
                    className="merch-float-asset"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="merch-copy">
            <p className="merch-eyebrow eyebrow">Convention Exclusives</p>
            <h2 className="merch-heading">Take the Experience With You.</h2>
            <p className="merch-lede">
              Apparel • Accessories • Collectibles • Event Essentials
            </p>
          </div>
        </div>

        <p className="merch-note">AVAILABLE ONLY AT HERE WE GROW 2027</p>
      </div>
    </section>
  );
}
