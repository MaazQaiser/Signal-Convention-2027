export type AgendaItem = {
  title: string;
  /** Display range, e.g. "10:30 a.m. – 3:30 p.m." */
  time: string;
  /** Large clock in the date column, e.g. "10:30" */
  timePrimary: string;
  /** Secondary line under clock, e.g. "a.m." or "a.m. – 3:30 p.m." */
  timeSecondary: string;
  tags: string[];
  description: string;
  image: { src: string; alt: string };
  highlight?: boolean;
  location?: string;
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

const VENUE = "JW Marriott Desert Ridge · Phoenix";

/** Saturday block shown above Day 1. */
export const PRE_CONVENTION: PreConventionBlock = {
  label: "Pre-Convention",
  dateLabel: "Saturday",
  periodLabel: "Jan 16",
  yearLabel: "2027",
  items: [
    {
      title: "Legacy Club Dinner",
      time: "Evening",
      timePrimary: "Eve",
      timeSecondary: "Saturday",
      tags: ["Legacy Club", "Dinner"],
      description:
        "Legacy Club Dinner gathers qualifying members ahead of the official convention start.",
      image: {
        src: "/images/convention-2026-1626.jpg",
        alt: "Pre-convention Legacy Club Dinner gathering",
      },
      location: VENUE,
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
        title: "$5M & $2.5M Legacy Club Event",
        tags: ["Legacy Club"],
        description:
          "Exclusive Legacy Club programming for $5M and $2.5M qualifiers.",
        image: {
          src: "/images/convention-2026-1125.jpg",
          alt: "Legacy Club event",
        },
        location: VENUE,
      },
      {
        time: "4:00 p.m. – 5:30 p.m.",
        timePrimary: "4:00",
        timeSecondary: "p.m. – 5:30 p.m.",
        title: "Registration Check-In Opens",
        tags: ["Registration"],
        description:
          "Convention check-in opens — pick up credentials and get ready for the Welcome Reception.",
        image: {
          src: "/images/convention-2026-0692.jpg",
          alt: "Registration check-in",
        },
        location: VENUE,
      },
      {
        time: "5:30 p.m. – 8:00 p.m.",
        timePrimary: "5:30",
        timeSecondary: "p.m. – 8:00 p.m.",
        title: "Welcome Reception",
        tags: ["Networking", "Reception"],
        description:
          "Open Here We Grow 2027 with networking, connections, and celebration.",
        image: {
          src: "/images/convention-2026-0254.jpg",
          alt: "Welcome Reception",
        },
        location: VENUE,
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
        time: "7:00 a.m. – 8:15 a.m.",
        timePrimary: "7:00",
        timeSecondary: "a.m. – 8:15 a.m.",
        title: "Key Employee Breakfast",
        tags: ["Breakfast"],
        description: "Start the day with Key Employee breakfast programming.",
        image: {
          src: "/images/convention-2026-0732.jpg",
          alt: "Key Employee Breakfast",
        },
        location: VENUE,
      },
      {
        time: "8:30 a.m. – 10:00 a.m.",
        timePrimary: "8:30",
        timeSecondary: "a.m. – 10:00 a.m.",
        title: "Opening & General Session",
        tags: ["General Session"],
        description:
          "Official opening and general session to kick off Monday programming.",
        image: {
          src: "/images/convention-2026-0777.jpg",
          alt: "Opening and general session",
        },
        location: VENUE,
      },
      {
        time: "10:15 a.m. – 11:30 a.m.",
        timePrimary: "10:15",
        timeSecondary: "a.m. – 11:30 a.m.",
        title: "Signal General Sessions",
        tags: ["Signal", "Session"],
        description: "Signal general sessions focused on growth and consistency.",
        image: {
          src: "/images/convention-2026-0977.jpg",
          alt: "Signal general sessions",
        },
        location: VENUE,
      },
      {
        time: "11:30 a.m. – 12:15 p.m.",
        timePrimary: "11:30",
        timeSecondary: "a.m. – 12:15 p.m.",
        title: "FilterGo Breakout Session",
        tags: ["FilterGo", "Breakout"],
        description: "Dedicated FilterGo breakout session for attendees.",
        image: {
          src: "/images/convention-2026-1151.jpg",
          alt: "FilterGo breakout session",
        },
        location: VENUE,
      },
      {
        time: "12:30 p.m. – 1:45 p.m.",
        timePrimary: "12:30",
        timeSecondary: "p.m. – 1:45 p.m.",
        title: "Main Lunch",
        tags: ["Lunch"],
        description: "Main lunch service for convention attendees.",
        image: {
          src: "/images/convention-2026-0643.jpg",
          alt: "Main lunch",
        },
        location: VENUE,
      },
      {
        time: "12:30 p.m. – 1:45 p.m.",
        timePrimary: "12:30",
        timeSecondary: "p.m. – 1:45 p.m.",
        title: "Legacy Club Lunch",
        tags: ["Legacy Club", "Lunch"],
        description: "Legacy Club lunch for qualifying members.",
        image: {
          src: "/images/convention-2026-1626.jpg",
          alt: "Legacy Club lunch",
        },
        location: VENUE,
      },
      {
        time: "2:00 p.m. – 3:30 p.m.",
        timePrimary: "2:00",
        timeSecondary: "p.m. – 3:30 p.m.",
        title: "Vendor Expo",
        tags: ["Expo", "Partners"],
        description: "Meet partners and explore the Vendor Expo floor.",
        image: {
          src: "/images/convention-2026-2106.jpg",
          alt: "Vendor Expo",
        },
        location: VENUE,
      },
      {
        time: "3:45 p.m. – 5:00 p.m.",
        timePrimary: "3:45",
        timeSecondary: "p.m. – 5:00 p.m.",
        title: "Breakout Sessions",
        tags: ["Breakout"],
        description: "Afternoon breakout sessions across growth tracks.",
        image: {
          src: "/images/convention-2026-0290.jpg",
          alt: "Breakout sessions",
        },
        location: VENUE,
      },
      {
        time: "5:30 p.m. – 6:30 p.m.",
        timePrimary: "5:30",
        timeSecondary: "p.m. – 6:30 p.m.",
        title: "FilterGo Core Awards",
        tags: ["FilterGo", "Awards"],
        description: "FilterGo Core Awards recognition ceremony.",
        image: {
          src: "/images/convention-2026-2124.jpg",
          alt: "FilterGo Core Awards",
        },
        location: VENUE,
      },
      {
        time: "7:00 p.m. – 9:30 p.m.",
        timePrimary: "7:00",
        timeSecondary: "p.m. – 9:30 p.m.",
        title: "FilterGo Dinner",
        tags: ["FilterGo", "Dinner"],
        description: "FilterGo Dinner celebration for attendees.",
        image: {
          src: "/images/convention-2026-2067.jpg",
          alt: "FilterGo Dinner",
        },
        location: VENUE,
      },
      {
        time: "7:00 p.m. – 9:30 p.m.",
        timePrimary: "7:00",
        timeSecondary: "p.m. – 9:30 p.m.",
        title: "Signal Core Awards & Dinner",
        tags: ["Signal", "Awards", "Dinner"],
        description: "Signal Core Awards and dinner for the Signal community.",
        image: {
          src: "/images/convention-2026-0777.jpg",
          alt: "Signal Core Awards and Dinner",
        },
        location: VENUE,
      },
      {
        time: "Evening",
        timePrimary: "End",
        timeSecondary: "Monday",
        title: "FilterGo Conference Ends",
        tags: ["FilterGo"],
        description: "FilterGo Conference concludes for Here We Grow 2027.",
        image: {
          src: "/images/convention-2026-1151.jpg",
          alt: "FilterGo Conference ends",
        },
        highlight: true,
        location: VENUE,
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
        time: "6:30 a.m. – 7:45 a.m.",
        timePrimary: "6:30",
        timeSecondary: "a.m. – 7:45 a.m.",
        title: "Fun Run / Walk",
        tags: ["Activity"],
        description: "Optional morning Fun Run / Walk to start the final day.",
        image: {
          src: "/images/convention-2026-0643.jpg",
          alt: "Fun Run and Walk",
        },
        location: VENUE,
      },
      {
        time: "9:00 a.m. – 11:30 a.m.",
        timePrimary: "9:00",
        timeSecondary: "a.m. – 11:30 a.m.",
        title: "Signal General Sessions",
        tags: ["Signal", "Session"],
        description: "Signal general sessions continue on the final convention day.",
        image: {
          src: "/images/convention-2026-0977.jpg",
          alt: "Signal general sessions",
        },
        location: VENUE,
      },
      {
        time: "12:00 p.m. – 1:30 p.m.",
        timePrimary: "12:00",
        timeSecondary: "p.m. – 1:30 p.m.",
        title: "Main Lunch",
        tags: ["Lunch"],
        description: "Main lunch service for convention attendees.",
        image: {
          src: "/images/convention-2026-0732.jpg",
          alt: "Main lunch",
        },
        location: VENUE,
      },
      {
        time: "12:00 p.m. – 1:30 p.m.",
        timePrimary: "12:00",
        timeSecondary: "p.m. – 1:30 p.m.",
        title: "Women's Luncheon",
        tags: ["Luncheon"],
        description: "Women's Luncheon programming and connection.",
        image: {
          src: "/images/convention-2026-0692.jpg",
          alt: "Women's Luncheon",
        },
        location: VENUE,
      },
      {
        time: "1:45 p.m. – 3:30 p.m.",
        timePrimary: "1:45",
        timeSecondary: "p.m. – 3:30 p.m.",
        title: "Breakout Sessions",
        tags: ["Breakout"],
        description: "Final-day breakout sessions across tracks.",
        image: {
          src: "/images/convention-2026-0290.jpg",
          alt: "Breakout sessions",
        },
        location: VENUE,
      },
      {
        time: "6:00 p.m. – 9:30 p.m.",
        timePrimary: "6:00",
        timeSecondary: "p.m. – 9:30 p.m.",
        title: "Signal Legacy Awards & Dinner",
        tags: ["Signal", "Awards", "Dinner"],
        description:
          "Signal Legacy Awards and Dinner close out Here We Grow 2027.",
        image: {
          src: "/images/convention-2026-2124.jpg",
          alt: "Signal Legacy Awards and Dinner",
        },
        location: VENUE,
      },
      {
        time: "Evening",
        timePrimary: "End",
        timeSecondary: "Tuesday",
        title: "Signal Conference Ends",
        tags: ["Signal"],
        description: "Signal Conference concludes for Here We Grow 2027.",
        image: {
          src: "/images/convention-2026-0254.jpg",
          alt: "Signal Conference ends",
        },
        highlight: true,
        location: VENUE,
      },
    ],
  },
];
