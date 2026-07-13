"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { loadGsap } from "@/lib/load-gsap";

type Sponsor = {
  name: string;
  src: string;
  href?: string;
};

type TierData = {
  id: string;
  title: string;
  note?: string;
  sponsors: Sponsor[];
};

const TIERS: TierData[] = [
  {
    id: "diamond",
    title: "Diamond Sponsors",
    sponsors: [
      {
        name: "Federal Signal",
        src: "/sponsors/federal-signal.png",
        href: "https://www.federalsignal.com/",
      },
      {
        name: "Revolution Wraps",
        src: "/sponsors/revolution-wraps.svg",
        href: "https://www.revolutionwraps.com/",
      },
    ],
  },
  {
    id: "platinum",
    title: "Platinum Sponsor",
    sponsors: [
      {
        name: "CI Shirts",
        src: "/sponsors/ci-shirts.png",
        href: "https://cishirts.com/",
      },
    ],
  },
  {
    id: "gold",
    title: "Gold Sponsors",
    sponsors: [
      {
        name: "aiAVENU",
        src: "/sponsors/aiavenu.png",
        href: "https://www.avenu.ai/",
      },
      {
        name: "Community Boss",
        src: "/sponsors/community-boss-white.svg",
        href: "https://communityboss.app/",
      },
      {
        name: "Design8 Studios",
        src: "/sponsors/design8.png",
        href: "https://design8studios.com/",
      },
    ],
  },
  {
    id: "silver",
    title: "Silver Sponsors",
    sponsors: [
      {
        name: "Quo",
        src: "/sponsors/quo-white.svg",
        href: "https://www.openphone.com/",
      },
      {
        name: "Immix",
        src: "/sponsors/immix.png",
        href: "https://www.immixprotect.com/",
      },
      {
        name: "ADP",
        src: "/sponsors/adp.svg",
        href: "https://www.adp.com/",
      },
      {
        name: "Propper Manufacturing",
        src: "/sponsors/propper.png",
        href: "https://www.propper.com/",
      },
      {
        name: "Woodhouse",
        src: "/sponsors/woodhouse.png",
        href: "https://www.woodhousespas.com/",
      },
      {
        name: "SimpliVerified",
        src: "/sponsors/simpliverified.png",
        href: "https://simpliverified.com/",
      },
      {
        name: "Total Filtration Service",
        src: "/sponsors/total-filtration.png",
        href: "https://totalfiltrationservices.com/",
      },
      {
        name: "FirstNet",
        src: "/sponsors/firstnet.png",
        href: "https://www.firstnet.com/",
      },
      {
        name: "Midwest Security Systems",
        src: "/sponsors/midwest-security-white.svg",
      },
      {
        name: "CRC Wholesale Group",
        src: "/sponsors/crc-wholesale.png",
        href: "https://www.crcgroup.com/",
      },
    ],
  },
  {
    id: "philanthropic",
    title: "Philanthropic Partners",
    note: "Giving Back Together",
    sponsors: [
      {
        name: "Chariots 4 Hope",
        src: "/sponsors/chariots-4-hope.png",
        href: "https://chariots4hope.org/",
      },
      {
        name: "Soldier's Wish",
        src: "/sponsors/soldiers-wish.png",
        href: "https://soldierswish.org/",
      },
    ],
  },
];

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const content = (
    <span className="sponsor-logo">
      <img src={sponsor.src} alt="" loading="lazy" decoding="async" />
    </span>
  );

  if (sponsor.href) {
    return (
      <a
        className="sponsor-card"
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={sponsor.name}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="sponsor-card" role="img" aria-label={sponsor.name}>
      {content}
    </div>
  );
}

function TierPanel({ tier }: { tier: TierData }) {
  return (
    <article
      className={`sponsor-tier sponsor-tier--${tier.id}`}
      aria-labelledby={`sponsor-tier-${tier.id}`}
    >
      <div className="sponsor-tier-head">
        <h3 className="sponsor-tier-title" id={`sponsor-tier-${tier.id}`}>
          {tier.title}
        </h3>
        {tier.note ? <p className="sponsor-tier-note">{tier.note}</p> : null}
      </div>
      <div className="sponsor-grid" aria-label={`${tier.title} logos`}>
        {tier.sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.name} sponsor={sponsor} />
        ))}
      </div>
    </article>
  );
}

export default function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [staticLayout, setStaticLayout] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !pin || !stage || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mobile = window.matchMedia("(max-width: 900px)").matches;

    if (reduceMotion || mobile) {
      setStaticLayout(true);
      return;
    }

    setStaticLayout(false);

    let disposed = false;
    let revert: (() => void) | undefined;
    let removeListeners: (() => void) | undefined;

    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (disposed) return;

      const panels = Array.from(
        track.querySelectorAll<HTMLElement>(".sponsor-tier")
      );
      if (panels.length < 2) {
        setStaticLayout(true);
        return;
      }

      const ctx = gsap.context(() => {
        const travel = () => {
          const last = panels[panels.length - 1];
          return Math.max(0, last.offsetTop);
        };

        gsap.set(track, { y: 0 });
        gsap.set(panels, { opacity: 0.28, scale: 0.985 });
        gsap.set(panels[0], { opacity: 1, scale: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () =>
              `+=${Math.max(
                window.innerHeight * 0.9,
                travel() + window.innerHeight * 0.35
              )}`,
            pin: true,
            scrub: 0.55,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          track,
          {
            y: () => -travel(),
            duration: 1,
            ease: "none",
          },
          0
        );

        panels.forEach((panel, index) => {
          if (index === 0) return;
          const start = (index - 0.45) / (panels.length - 1);
          const mid = index / (panels.length - 1);
          const end = Math.min(1, (index + 0.45) / (panels.length - 1));

          tl.fromTo(
            panel,
            { opacity: 0.28, scale: 0.985 },
            { opacity: 1, scale: 1, duration: mid - start, ease: "power2.out" },
            start
          );

          const prev = panels[index - 1];
          tl.to(
            prev,
            {
              opacity: 0.22,
              scale: 0.97,
              duration: mid - start,
              ease: "power2.in",
            },
            start
          );

          if (index < panels.length - 1) {
            tl.to(
              panel,
              {
                opacity: 0.22,
                scale: 0.97,
                duration: end - mid,
                ease: "power2.in",
              },
              mid
            );
          }
        });

        tl.to({}, { duration: 0.12 }, 1);
      }, section);

      revert = () => ctx.revert();

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      removeListeners = () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
      };
    });

    return () => {
      disposed = true;
      revert?.();
      removeListeners?.();
    };
  }, []);

  return (
    <section
      className={`sponsors${staticLayout ? " sponsors--static" : ""}`}
      id="sponsors"
      ref={sectionRef}
      aria-labelledby="sponsors-heading"
    >
      <div className="sponsors-pin" ref={pinRef}>
        <div className="sponsors-inner wrap">
          <div className="sponsors-layout">
            <div className="sponsors-copy">
              <p className="sponsors-eyebrow">Our Partners</p>
              <h2 className="sponsors-heading" id="sponsors-heading">
                Powered by Partners Who Help Us Grow.
              </h2>
              <p className="sponsors-lede">
                We&apos;re proud to partner with organizations that support our
                franchise network and help make the Here We Grow convention
                experience possible.
              </p>
              <a className="btn btn-orange sponsors-cta-btn" href="#register">
                Become a Sponsor
              </a>
            </div>

            <div className="sponsors-stage" ref={stageRef}>
              <div className="sponsors-track" ref={trackRef}>
                {TIERS.map((tier) => (
                  <TierPanel key={tier.id} tier={tier} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
