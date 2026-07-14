export type Sponsor = {
  name: string;
  src: string;
  href?: string;
};

export type SponsorTier = {
  id: string;
  title: string;
  note?: string;
  sponsors: Sponsor[];
};

export type SponsorWhyPillar = {
  id: string;
  title: string;
  body: string;
};

export const SPONSOR_TIERS: SponsorTier[] = [
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

export const SPONSOR_WHY_PILLARS: SponsorWhyPillar[] = [
  {
    id: "reach",
    title: "Reach Franchise Owners",
    body: "Connect directly with Signal franchise owners and their teams gathered for three days of learning, networking, and collaboration.",
  },
  {
    id: "presence",
    title: "Brand Presence at Here We Grow",
    body: "Showcase your brand across convention experiences—from recognition moments to on-site visibility aligned with your partnership level.",
  },
  {
    id: "growth",
    title: "Align with a Growth Culture",
    body: "Stand alongside a network committed to operational excellence and long-term growth—partners who help us grow, together.",
  },
];
