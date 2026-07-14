export type NavLink = {
  label: string;
  /** Hash fragment without leading #, or absolute path like /agenda */
  href: string;
  /** When true, href is a page path (not a homepage section hash). */
  external?: boolean;
};

const HOME_SECTIONS: NavLink[] = [
  { label: "Home", href: "top" },
  { label: "Agenda", href: "/agenda", external: true },
  { label: "Hotel & Travel", href: "/travel", external: true },
  { label: "Sponsors", href: "/sponsors", external: true },
];

const REGISTER_EXPLORE: NavLink[] = [
  { label: "Home", href: "top" },
  { label: "Agenda", href: "/agenda", external: true },
  { label: "Hotel & Travel", href: "/travel", external: true },
  { label: "Sponsors", href: "/sponsors", external: true },
  { label: "FAQs", href: "faq" },
  { label: "Register", href: "register" },
];

/** Resolve nav href for the current page. On subpages, home hashes become /#… */
export function resolveNavHref(link: NavLink, pathname: string): string {
  if (link.external || link.href.startsWith("/")) {
    return link.href;
  }
  if (pathname === "/" || pathname === "") {
    return `#${link.href}`;
  }
  /* In-page sections on agenda / travel */
  if (
    (pathname.startsWith("/agenda") || pathname.startsWith("/travel")) &&
    (link.href === "faq" || link.href === "register")
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
  if (link.href === "top") {
    return pathname === "/" || pathname === "";
  }
  return false;
}
