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

/** Display order: Platinum above Diamond, then Gold → Silver → Vision → Philanthropic. */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "platinum",
    title: "Platinum Sponsors",
    sponsors: [
      {
        name: "CI Shirts",
        src: "/sponsors/ci-shirts.png",
        href: "https://cishirts.com/",
      },
    ],
  },
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
    id: "vision",
    title: "Vision Vendors",
    sponsors: [
      {
        name: "AccuSourceHR",
        src: "/sponsors/accusourcehr-white.png",
        href: "https://www.accusourcehr.com/",
      },
      {
        name: "Synergi",
        src: "/sponsors/synergi-white.png",
        href: "https://getsynergi.com/",
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
