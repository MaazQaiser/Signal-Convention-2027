export type GlanceFact = {
  id: string;
  label: string;
  value: string;
};

export type Amenity = {
  id: string;
  label: string;
};

export type HotelMosaicCell =
  | { type: "text"; amenityId: string }
  | { type: "image"; src: string; alt: string };

export type ArrivalStep = {
  title: string;
  detail?: string;
};

export type TransportOption = {
  label: string;
};

export type MapMarker = {
  id: string;
  label: string;
  /** Percent positions on the map image */
  x: number;
  y: number;
};

export type KnowBeforeItem = {
  id: string;
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
};

export type TravelFaq = {
  q: string;
  a: string;
};

export const TRAVEL_GLANCE: GlanceFact[] = [
  {
    id: "venue",
    label: "Venue",
    value: "JW Marriott Desert Ridge Resort & Spa",
  },
  {
    id: "convention",
    label: "Convention",
    value: "January 17–19, 2027",
  },
  { id: "check-in", label: "Check-in", value: "4:00 PM" },
  { id: "check-out", label: "Check-out", value: "11:00 AM" },
  {
    id: "airport",
    label: "Airport",
    value: "Phoenix Sky Harbor International",
  },
  { id: "distance", label: "Distance", value: "22 Miles" },
];

export const TRAVEL_AMENITIES: Amenity[] = [
  { id: "pools", label: "Five Resort Pools" },
  { id: "river", label: "Lazy River" },
  { id: "cabanas", label: "Private Cabanas" },
  { id: "pickleball", label: "17 Pickleball Courts" },
  { id: "golf", label: "Championship Golf" },
  { id: "dining", label: "Restaurants & Lounges" },
  { id: "spa", label: "Spa" },
  { id: "fitness", label: "Fitness Center" },
];

/** 4×3 mosaic: 8 amenity text cells + 4 image cells */
export const TRAVEL_HOTEL_MOSAIC: HotelMosaicCell[] = [
  { type: "text", amenityId: "pools" },
  { type: "text", amenityId: "river" },
  {
    type: "image",
    src: "/images/convention-2026-2067.jpg",
    alt: "Resort atmosphere at Here We Grow",
  },
  { type: "text", amenityId: "cabanas" },
  {
    type: "image",
    src: "/images/convention-2026-1125.jpg",
    alt: "Convention networking at the resort",
  },
  { type: "text", amenityId: "pickleball" },
  { type: "text", amenityId: "golf" },
  {
    type: "image",
    src: "/images/convention-2026-0643.jpg",
    alt: "Here We Grow attendees gathering",
  },
  { type: "text", amenityId: "dining" },
  {
    type: "image",
    src: "/images/convention-2026-0254.jpg",
    alt: "Convention floor experience",
  },
  { type: "text", amenityId: "spa" },
  { type: "text", amenityId: "fitness" },
];

export const TRAVEL_ARRIVAL_STEPS: ArrivalStep[] = [
  { title: "Book Convention", detail: "Complete your Here We Grow 2027 registration." },
  { title: "Reserve Hotel", detail: "Hotel stay is reserved during registration." },
  { title: "Fly into Phoenix", detail: "Arrive at Phoenix Sky Harbor International Airport." },
  { title: "Check In", detail: "Hotel check-in begins at 4:00 PM." },
  { title: "Registration Check-In", detail: "Pick up your credentials on site." },
  { title: "Welcome Reception", detail: "Join fellow attendees to kick off convention." },
];

export const TRAVEL_TRANSPORT: TransportOption[] = [
  { label: "Uber" },
  { label: "Lyft" },
  { label: "Taxi" },
  { label: "Rental Car" },
];

export const TRAVEL_MAP_MARKERS: MapMarker[] = [
  { id: "registration", label: "Registration", x: 48, y: 72 },
  { id: "sessions", label: "General Sessions", x: 48, y: 40 },
  { id: "breakouts", label: "Breakout Rooms", x: 72, y: 38 },
  { id: "dining", label: "Dining", x: 76, y: 62 },
  { id: "expo", label: "Vendor Expo", x: 22, y: 58 },
  { id: "legacy", label: "Legacy Events", x: 22, y: 28 },
];

export const TRAVEL_KNOW_BEFORE: KnowBeforeItem[] = [
  {
    id: "check-in",
    title: "Hotel Check-In",
    body: "Hotel check-in begins at 4:00 PM.",
  },
  {
    id: "check-out",
    title: "Hotel Check-Out",
    body: "Hotel check-out is 11:00 AM.",
  },
  {
    id: "arrival",
    title: "Arrival Recommendation",
    body: "Arrive no later than Sunday afternoon before the Welcome Reception. Legacy Club attendees should arrive earlier based on their scheduled events.",
  },
  {
    id: "weather",
    title: "Weather",
    body: "January in Phoenix is typically mild and dry, with average daytime highs around 65°F and overnight lows near 40°F. Pack layers for cooler mornings and evenings.",
  },
  {
    id: "dress",
    title: "Dress Code",
    body: "Business casual is recommended for most convention activities. Special evening events may require different attire.",
    href: "/#faq",
    hrefLabel: "See FAQ",
  },
  {
    id: "support",
    title: "On-site Convention Support",
    body: "Our Convention Team is available before and during the event at convention@teamsignal.com.",
    href: "mailto:convention@teamsignal.com",
    hrefLabel: "convention@teamsignal.com",
  },
];

export const TRAVEL_FAQS: TravelFaq[] = [
  {
    q: "How do I reserve my hotel room?",
    a: "Your hotel reservation is completed during the convention registration process. There is no separate hotel booking step for Signal Franchise Owners.",
  },
  {
    q: "Can I extend my stay?",
    a: "Yes. If you wish to extend your stay before or after Convention, select your preferred dates during registration. Additional nights are subject to hotel availability and require a credit card guarantee.",
  },
  {
    q: "What are hotel check-in and check-out times?",
    a: "Hotel check-in begins at 4:00 PM. Hotel check-out is 11:00 AM.",
  },
  {
    q: "Which airport should I use?",
    a: "Phoenix Sky Harbor International Airport (PHX) is the recommended airport for all attendees. The resort is approximately 22 miles from the airport.",
  },
  {
    q: "Is there an airport shuttle?",
    a: "No hotel shuttle is available. Recommended options include Uber, Lyft, taxi, or a rental car.",
  },
  {
    q: "When should I arrive?",
    a: "Plan to arrive no later than Sunday afternoon before the Welcome Reception. Legacy Club attendees should arrive earlier based on their scheduled events.",
  },
  {
    q: "Where can I park?",
    a: "Self-parking and valet options are available at the JW Marriott Desert Ridge Resort & Spa. Confirm current rates and availability with the hotel upon arrival.",
  },
  {
    q: "What is the weather like in January?",
    a: "January in Phoenix is typically mild and dry, with average daytime highs around 65°F and overnight lows near 40°F. Pack layers for cooler mornings and evenings.",
  },
  {
    q: "What is the dress code?",
    a: "Business casual is recommended for most convention activities. Special evening events may require different attire.",
  },
  {
    q: "Who do I contact before I travel?",
    a: "Email the Convention Team at convention@teamsignal.com with travel, accommodations, or arrival questions. On-site Convention Support is also available during the event.",
  },
];

export const TRAVEL_RESERVATION_INCLUDES = [
  "Three-night stay",
  "Sunday–Tuesday accommodation",
  "One guest included",
] as const;
