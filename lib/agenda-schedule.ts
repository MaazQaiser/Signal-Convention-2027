export type AgendaItem = {
  title: string;
  /** Display range, e.g. "10:30 a.m. – 3:30 p.m." */
  time: string;
  /** Large clock in the date column, e.g. "10:30" */
  timePrimary: string;
  /** Secondary line under clock, e.g. "a.m." or "a.m. – 3:30 p.m." */
  timeSecondary: string;
  tags: string[];
  description?: string;
  image: { src: string; alt: string };
  highlight?: boolean;
};

export type AgendaDay = {
  id: "sun" | "mon" | "tue";
  label: string;
  dateLabel: string;
  /** Fluxum-style period title, e.g. "Jan 17" */
  periodLabel: string;
  yearLabel: string;
  items: AgendaItem[];
};

export type PreConventionBlock = {
  label: string;
  dateLabel: string;
  periodLabel: string;
  yearLabel: string;
  items: AgendaItem[];
};

/** Saturday block shown above Day 1. */
export const PRE_CONVENTION: PreConventionBlock = {
  label: "Pre-Convention",
  dateLabel: "Saturday, January 16",
  periodLabel: "Jan 16",
  yearLabel: "2027",
  items: [
    {
      title: "$5M Legacy Club Dinner",
      time: "6:30 p.m. – 10:00 p.m.",
      timePrimary: "6:30",
      timeSecondary: "p.m. – 10:00 p.m.",
      tags: ["Legacy Club", "Dinner"],
      image: {
        src: "/images/convention-2026-1626.jpg",
        alt: "Pre-convention $5M Legacy Club Dinner gathering",
      },
    },
  ],
};

export const AGENDA_DAYS: AgendaDay[] = [
  {
    id: "sun",
    label: "Sunday",
    dateLabel: "Sunday, January 17",
    periodLabel: "Jan 17",
    yearLabel: "2027",
    items: [
      {
        time: "10:30 a.m. – 3:30 p.m.",
        timePrimary: "10:30",
        timeSecondary: "a.m. – 3:30 p.m.",
        title: "$5M and $2.5M Legacy Club Event",
        tags: ["Legacy Club"],
        image: {
          src: "/images/convention-2026-1125.jpg",
          alt: "Legacy Club event",
        },
      },
      {
        time: "4:00 p.m. – 5:30 p.m.",
        timePrimary: "4:00",
        timeSecondary: "p.m. – 5:30 p.m.",
        title: "Registration Check-In Opens",
        tags: ["Registration"],
        image: {
          src: "/images/convention-2026-0692.jpg",
          alt: "Registration check-in",
        },
      },
      {
        time: "5:30 p.m. – 8:00 p.m.",
        timePrimary: "5:30",
        timeSecondary: "p.m. – 8:00 p.m.",
        title: "Welcome Reception",
        tags: ["Networking", "Reception"],
        description:
          "Open Here We Grow 2027 with networking, food, and fun.",
        image: {
          src: "/images/convention-2026-0254.jpg",
          alt: "Welcome Reception",
        },
      },
    ],
  },
  {
    id: "mon",
    label: "Monday",
    dateLabel: "Monday, January 18",
    periodLabel: "Jan 18",
    yearLabel: "2027",
    items: [
      {
        time: "7:30 a.m. – 8:30 a.m.",
        timePrimary: "7:30",
        timeSecondary: "a.m. – 8:30 a.m.",
        title: "Key Employee Breakfast",
        tags: ["Breakfast"],
        description:
          "Start the day with a special breakfast specific to key employees.",
        image: {
          src: "/images/convention-2026-0732.jpg",
          alt: "Key Employee Breakfast",
        },
      },
      {
        time: "8:45 a.m. – 9:30 a.m.",
        timePrimary: "8:45",
        timeSecondary: "a.m. – 9:30 a.m.",
        title: "Opening & General Session (All)",
        tags: ["General Session", "All"],
        image: {
          src: "/images/convention-2026-0777.jpg",
          alt: "Opening and general session",
        },
      },
      {
        time: "9:30 a.m. – 11:30 a.m.",
        timePrimary: "9:30",
        timeSecondary: "a.m. – 11:30 a.m.",
        title: "Signal General Sessions",
        tags: ["Signal", "Session"],
        image: {
          src: "/images/convention-2026-0977.jpg",
          alt: "Signal general sessions",
        },
      },
      {
        time: "9:30 a.m. – 11:30 a.m.",
        timePrimary: "9:30",
        timeSecondary: "a.m. – 11:30 a.m.",
        title: "Filtergo Breakout Session",
        tags: ["Filtergo", "Breakout"],
        image: {
          src: "/images/convention-2026-1151.jpg",
          alt: "Filtergo breakout session",
        },
      },
      {
        time: "11:30 a.m. – 12:45 p.m.",
        timePrimary: "11:30",
        timeSecondary: "a.m. – 12:45 p.m.",
        title: "Main Lunch (All) — Sponsored by Federal Signal",
        tags: ["Lunch", "All", "Sponsored"],
        image: {
          src: "/images/convention-2026-0643.jpg",
          alt: "Main lunch",
        },
      },
      {
        time: "11:30 a.m. – 12:45 p.m.",
        timePrimary: "11:30",
        timeSecondary: "a.m. – 12:45 p.m.",
        title: "$1M Legacy Club Lunch",
        tags: ["Legacy Club", "Lunch"],
        image: {
          src: "/images/convention-2026-1626.jpg",
          alt: "Legacy Club lunch",
        },
      },
      {
        time: "12:00 p.m. – 4:00 p.m.",
        timePrimary: "12:00",
        timeSecondary: "p.m. – 4:00 p.m.",
        title: "Vendor Expo (All)",
        tags: ["Expo", "Partners", "All"],
        image: {
          src: "/images/convention-2026-2106.jpg",
          alt: "Vendor Expo",
        },
      },
      {
        time: "1:00 p.m. – 4:00 p.m.",
        timePrimary: "1:00",
        timeSecondary: "p.m. – 4:00 p.m.",
        title: "Breakout Sessions (All)",
        tags: ["Breakout", "All"],
        image: {
          src: "/images/convention-2026-0290.jpg",
          alt: "Breakout sessions",
        },
      },
      {
        time: "4:30 p.m. – 5:30 p.m.",
        timePrimary: "4:30",
        timeSecondary: "p.m. – 5:30 p.m.",
        title: "Filtergo Core Awards",
        tags: ["Filtergo", "Awards"],
        image: {
          src: "/images/convention-2026-2124.jpg",
          alt: "Filtergo Core Awards",
        },
      },
      {
        time: "5:30 p.m. – 7:00 p.m.",
        timePrimary: "5:30",
        timeSecondary: "p.m. – 7:00 p.m.",
        title: "Filtergo Dinner",
        tags: ["Filtergo", "Dinner"],
        description: "Filtergo dinner for Filtergo franchisees.",
        image: {
          src: "/images/convention-2026-2067.jpg",
          alt: "Filtergo Dinner",
        },
      },
      {
        time: "6:15 p.m. – 10:00 p.m.",
        timePrimary: "6:15",
        timeSecondary: "p.m. – 10:00 p.m.",
        title: "Signal Core Awards & Dinner",
        tags: ["Signal", "Awards", "Dinner"],
        description:
          "Signal Core Awards and dinner celebrating those that exemplify Signal’s core values.",
        image: {
          src: "/images/convention-2026-0777.jpg",
          alt: "Signal Core Awards and Dinner",
        },
      },
      {
        time: "Evening",
        timePrimary: "End",
        timeSecondary: "Monday",
        title: "Filtergo Conference Ends",
        tags: ["Filtergo"],
        image: {
          src: "/images/convention-2026-1151.jpg",
          alt: "Filtergo Conference ends",
        },
        highlight: true,
      },
    ],
  },
  {
    id: "tue",
    label: "Tuesday",
    dateLabel: "Tuesday, January 19",
    periodLabel: "Jan 19",
    yearLabel: "2027",
    items: [
      {
        time: "7:00 a.m. – 8:00 a.m.",
        timePrimary: "7:00",
        timeSecondary: "a.m. – 8:00 a.m.",
        title: "Fun Run/Walk",
        tags: ["Activity"],
        image: {
          src: "/images/convention-2026-0643.jpg",
          alt: "Fun Run and Walk",
        },
      },
      {
        time: "8:45 a.m. – 11:30 a.m.",
        timePrimary: "8:45",
        timeSecondary: "a.m. – 11:30 a.m.",
        title: "Signal General Sessions",
        tags: ["Signal", "Session"],
        image: {
          src: "/images/convention-2026-0977.jpg",
          alt: "Signal general sessions",
        },
      },
      {
        time: "11:30 a.m. – 12:45 p.m.",
        timePrimary: "11:30",
        timeSecondary: "a.m. – 12:45 p.m.",
        title: "Main Lunch",
        tags: ["Lunch"],
        image: {
          src: "/images/convention-2026-0732.jpg",
          alt: "Main lunch",
        },
      },
      {
        time: "11:30 a.m. – 12:45 p.m.",
        timePrimary: "11:30",
        timeSecondary: "a.m. – 12:45 p.m.",
        title: "Women's Luncheon",
        tags: ["Luncheon"],
        image: {
          src: "/images/convention-2026-0692.jpg",
          alt: "Women's Luncheon",
        },
      },
      {
        time: "1:00 p.m. – 4:00 p.m.",
        timePrimary: "1:00",
        timeSecondary: "p.m. – 4:00 p.m.",
        title: "Breakout Sessions",
        tags: ["Breakout"],
        image: {
          src: "/images/convention-2026-0290.jpg",
          alt: "Breakout sessions",
        },
      },
      {
        time: "6:00 p.m. – 10:00 p.m.",
        timePrimary: "6:00",
        timeSecondary: "p.m. – 10:00 p.m.",
        title: "Signal Legacy Awards & Dinner — Sponsored by ADP",
        tags: ["Signal", "Awards", "Dinner", "Sponsored"],
        image: {
          src: "/images/convention-2026-2124.jpg",
          alt: "Signal Legacy Awards and Dinner",
        },
      },
    ],
  },
];
