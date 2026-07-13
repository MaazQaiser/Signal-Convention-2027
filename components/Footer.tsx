"use client";

import Reveal, { REVEAL_CASCADE } from "./Reveal";
import ClosingModel from "./ClosingModel";

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "Hotel & Travel", href: "#agenda" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "FAQs", href: "#faq" },
  { label: "Register", href: "#register" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-meta">
        <Reveal className="footer-meta-left" delay={REVEAL_CASCADE.eyebrow}>
          <p className="footer-copy">Signal Franchise Convention</p>
        </Reveal>

        <div className="footer-meta-right">
          <Reveal className="footer-col" delay={REVEAL_CASCADE.title}>
            <h4 className="footer-col-title">Convention</h4>
            <a
              className="footer-enquiry"
              href="mailto:convention@teamsignal.com"
            >
              convention@teamsignal.com
            </a>
            <a
              className="footer-enquiry"
              href="https://www.teamsignal.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              teamsignal.com
            </a>
          </Reveal>

          <Reveal className="footer-col" delay={REVEAL_CASCADE.body}>
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="footer-col" delay={0.24}>
            <h4 className="footer-col-title">Partner</h4>
            <a className="footer-enquiry" href="#sponsors">
              Become a Sponsor
            </a>
            <a
              className="footer-enquiry"
              href="mailto:convention@teamsignal.com"
            >
              Contact Team
            </a>
          </Reveal>
        </div>
      </div>

      <div className="wrap footer-bar">
        <p className="footer-legal">Signal Franchise Convention</p>
        <nav className="footer-legal-nav" aria-label="Legal">
          {legalLinks.map((link, index) => (
            <span key={link.label}>
              {index > 0 ? (
                <span className="footer-legal-sep" aria-hidden="true">
                  ·
                </span>
              ) : null}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </nav>
      </div>

      {/* Sunrise sits flush on the section’s bottom edge — like the yellow half-disk */}
      <div className="closing-mark-stage" aria-hidden="true">
        <ClosingModel />
      </div>
    </footer>
  );
}
