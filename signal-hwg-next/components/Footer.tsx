"use client";

const conventionLinks = [
  { label: "Experience", href: "#agenda" },
  { label: "Hotel & Travel", href: "#register" },
  { label: "Sponsors", href: "#" },
  { label: "FAQs", href: "#" },
];

const communityLinks = [
  { label: "Signal", href: "https://www.signal.com/" },
  { label: "FilterGo", href: "https://www.filtergo.com/" },
  { label: "Contact", href: "mailto:hello@signal.co" },
  { label: "Sponsorship Opportunities", href: "#" },
];

const legalLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Accessibility", href: "#" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bg" aria-hidden="true">
        <div className="footer-scrim" />
        <div className="footer-glow" />
      </div>

      <div className="footer-beacon" aria-hidden="true">
        <div className="footer-beacon-glow" />
        <div className="footer-beacon-spin">
          <img
            src="/brand/brandmark-27-white.svg"
            alt=""
            className="footer-beacon-img"
          />
        </div>
      </div>

      <div className="footer-grid wrap">
        <div className="footer-brand">
          <a href="#top" className="footer-logo" aria-label="Here We Grow 2027">
            <img
              src="/brand/nav-logo-27-dark.svg"
              alt="Here We Grow 2027"
              height={32}
            />
          </a>
          <h3 className="footer-brand-title">Here We Grow 2027</h3>
          <p className="footer-brand-tagline">
            Growing Together Through Culture, Community, and Consistency.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Convention</h4>
          <ul className="footer-links">
            {conventionLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Community</h4>
          <ul className="footer-links">
            {communityLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col footer-connect">
          <h4 className="footer-col-title">Stay Connected</h4>
          <p className="footer-connect-copy">
            Follow the latest convention announcements and updates.
          </p>
          <form
            className="footer-email"
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
            />
            <button type="submit" className="footer-email-btn">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="footer-closing">
        <p className="footer-philosophy">here. we grow.</p>
        <ul className="footer-values">
          <li>Culture.</li>
          <li>Community.</li>
          <li>Consistency.</li>
        </ul>
        <p className="footer-meta">
          December 10&ndash;12, 2027 &bull; Phoenix, Arizona
        </p>
      </div>

      <div className="footer-bar wrap">
        <p className="footer-legal">
          &copy; 2027 Framebrand. All rights reserved.
        </p>
        <nav className="footer-legal-nav" aria-label="Legal">
          {legalLinks.map((link, index) => (
            <span key={link.label}>
              {index > 0 ? (
                <span className="footer-legal-sep" aria-hidden="true">
                  &bull;
                </span>
              ) : null}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
