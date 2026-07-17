export type SectionNavItem = {
  id: string;
  label: string;
};

/** Sections after the hero — side nav is hidden while #top is in view. */
const HOME_SECTIONS: SectionNavItem[] = [
  { id: "journey", label: "Journey" },
  { id: "agenda", label: "Agenda" },
  { id: "sponsors", label: "Sponsors" },
  { id: "faq", label: "FAQs" },
  { id: "register", label: "Register" },
];

const AGENDA_SECTIONS: SectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "day-precon", label: "Pre-Convention" },
  { id: "day-sun", label: "Sunday" },
  { id: "day-mon", label: "Monday" },
  { id: "day-tue", label: "Tuesday" },
  { id: "hotel", label: "Hotel" },
  { id: "faq", label: "FAQs" },
  { id: "register", label: "Register" },
];

const SPONSORS_SECTIONS: SectionNavItem[] = [
  { id: "overview", label: "Why Partner" },
  { id: "tiers", label: "Tiers" },
  { id: "become", label: "Become a Sponsor" },
  { id: "register", label: "Register" },
];

const TRAVEL_SECTIONS: SectionNavItem[] = [
  { id: "glance", label: "At a Glance" },
  { id: "hotel", label: "Hotel" },
  { id: "arrival", label: "Arrival" },
  { id: "flying", label: "Flying" },
  { id: "map", label: "Resort Map" },
  { id: "faq", label: "FAQs" },
  { id: "register", label: "Register" },
];

export function getSectionNav(pathname: string): SectionNavItem[] {
  if (pathname === "/" || pathname === "") return HOME_SECTIONS;
  if (pathname === "/agenda" || pathname.startsWith("/agenda/")) {
    return AGENDA_SECTIONS;
  }
  if (pathname === "/sponsors" || pathname.startsWith("/sponsors/")) {
    return SPONSORS_SECTIONS;
  }
  if (pathname === "/travel" || pathname.startsWith("/travel/")) {
    return TRAVEL_SECTIONS;
  }
  return [];
}
