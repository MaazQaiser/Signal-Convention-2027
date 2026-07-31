"use client";

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-bar">
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
    </footer>
  );
}
