"use client";

import { usePathname } from "next/navigation";
import Reveal, { REVEAL_CASCADE } from "./Reveal";
import BtnArrow from "./BtnArrow";
import {
  getRegisterExploreLinks,
  resolveNavHref,
} from "@/lib/nav-links";

export default function Register() {
  const pathname = usePathname();
  const navLinks = getRegisterExploreLinks();
  const sponsorsHref = "/sponsors#become";

  return (
    <section
      className="register"
      id="register"
      aria-labelledby="register-heading"
    >
      <div className="wrap closing-cta">
        <div className="closing-cta-main">
          <Reveal delay={REVEAL_CASCADE.title * 0.5}>
            <img
              className="closing-cta-logo"
              src="/brand/nav-logo-27-dark.svg"
              alt="Signal 2027 — Here We Grow"
              height={40}
            />
          </Reveal>
          <Reveal delay={REVEAL_CASCADE.title}>
            <h2 className="closing-cta-title" id="register-heading">
              Ready to Grow?
            </h2>
          </Reveal>
          <Reveal delay={REVEAL_CASCADE.body}>
            <p className="closing-cta-lede">
              We can&apos;t wait to welcome you to Here We Grow 2027. Register
              today.
            </p>
          </Reveal>
          <Reveal className="closing-cta-action" delay={REVEAL_CASCADE.cta}>
            <a className="nav-reserve closing-cta-btn" href="#">
              Register Today
              <BtnArrow />
            </a>
          </Reveal>
        </div>

        <div className="footer-meta-right closing-cta-links">
          <Reveal className="footer-col" delay={REVEAL_CASCADE.title}>
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={resolveNavHref(link, pathname)}>{link.label}</a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="footer-col" delay={REVEAL_CASCADE.body}>
            <h4 className="footer-col-title">Partner</h4>
            <a className="footer-enquiry" href={sponsorsHref}>
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
    </section>
  );
}
