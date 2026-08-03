import { REGISTER_URL } from "./register-link";

export type NavLink = {
  label: string;
  /** Hash fragment without leading #, or absolute path like /agenda */
  href: string;
  /**
   * When true, href is used verbatim rather than treated as a homepage section
   * hash — a page path like /agenda, or an absolute URL such as the Cvent
   * registration link.
   */
  external?: boolean;
};

const HOME_SECTIONS: NavLink[] = [
  { label: "Overview", href: "top" },
  { label: "Agenda", href: "/agenda", external: true },
  { label: "Hotel & Travel", href: "/travel", external: true },
  { label: "Sponsors", href: "/sponsors", external: true },
  { label: "FAQs", href: "/faqs", external: true },
];

const REGISTER_EXPLORE: NavLink[] = [
  { label: "Overview", href: "top" },
  { label: "Agenda", href: "/agenda", external: true },
  { label: "Hotel & Travel", href: "/travel", external: true },
  { label: "Sponsors", href: "/sponsors", external: true },
  { label: "FAQs", href: "/faqs", external: true },
  { label: "Register", href: REGISTER_URL, external: true },
];

/** Resolve nav href for the current page. On subpages, home hashes become /#… */
export function resolveNavHref(link: NavLink, pathname: string): string {
  if (link.external || link.href.startsWith("/")) {
    return link.href;
  }
  if (pathname === "/" || pathname === "") {
    return `#${link.href}`;
  }
  /* In-page sections on dedicated pages */
  if (
    (pathname.startsWith("/agenda") ||
      pathname.startsWith("/travel") ||
      pathname.startsWith("/sponsors") ||
      pathname.startsWith("/faqs")) &&
    link.href === "register"
  ) {
    return `#${link.href}`;
  }
  return `/#${link.href}`;
}

export function getNavLinks(): NavLink[] {
  return HOME_SECTIONS;
}

export function getRegisterExploreLinks(): NavLink[] {
  return REGISTER_EXPLORE;
}

export function isNavLinkActive(link: NavLink, pathname: string): boolean {
  if (link.href === "/agenda") {
    return pathname === "/agenda" || pathname.startsWith("/agenda/");
  }
  if (link.href === "/travel") {
    return pathname === "/travel" || pathname.startsWith("/travel/");
  }
  if (link.href === "/sponsors") {
    return pathname === "/sponsors" || pathname.startsWith("/sponsors/");
  }
  if (link.href === "/faqs") {
    return pathname === "/faqs" || pathname.startsWith("/faqs/");
  }
  if (link.href === "top") {
    return pathname === "/" || pathname === "";
  }
  return false;
}
