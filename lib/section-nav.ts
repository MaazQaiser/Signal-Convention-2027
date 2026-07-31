export type SectionNavItem = {
  id: string;
  label: string;
};

/** Sections after the hero — side nav is hidden while #top is in view. */
const HOME_SECTIONS: SectionNavItem[] = [
  { id: "journey", label: "Journey" },
  { id: "agenda", label: "Agenda" },
  { id: "sponsors", label: "Sponsors" },
  { id: "register", label: "Register" },
];

const AGENDA_SECTIONS: SectionNavItem[] = [
  { id: "day-precon", label: "Pre-Convention" },
  { id: "day-sun", label: "Sunday" },
  { id: "day-mon", label: "Monday" },
  { id: "day-tue", label: "Tuesday" },
  { id: "hotel", label: "Hotel" },
  { id: "register", label: "Register" },
];

const SPONSORS_SECTIONS: SectionNavItem[] = [
  { id: "tiers", label: "Partners" },
  { id: "register", label: "Register" },
];

const TRAVEL_SECTIONS: SectionNavItem[] = [
  { id: "glance", label: "At a Glance" },
  { id: "hotel", label: "Hotel" },
  { id: "map", label: "Resort Map" },
  { id: "register", label: "Register" },
];
const FAQS_SECTIONS: SectionNavItem[] = [
  { id: "faq-list", label: "Answers" },
  { id: "contact", label: "Contact" },
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
  if (pathname === "/faqs" || pathname.startsWith("/faqs/")) {
    return FAQS_SECTIONS;
  }
  return [];
}
