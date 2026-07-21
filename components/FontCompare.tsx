import { Michroma } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import "./FontCompare.css";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const simpleSquare = localFont({
  src: "../app/fonts/ST-SimpleSquare.otf",
  weight: "400",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const SAMPLES = [
  {
    label: "Home hero",
    text: "Here We Grow 2027",
  },
  {
    label: "Handoff",
    text: "Grow Through Consistency",
  },
  {
    label: "Journey",
    text: "What's New This Year",
  },
  {
    label: "Learn",
    text: "Learn From Franchise Owners and Their Teams",
  },
  {
    label: "Agenda",
    text: "Join Us in Phoenix.",
  },
  {
    label: "Sponsors",
    text: "Sponsors & Partners",
  },
  {
    label: "FAQ",
    text: "Everything You Need to Know Before You Arrive.",
  },
  {
    label: "Register",
    text: "Ready to Grow?",
  },
] as const;

type FontCompareProps = {
  /** Standalone page shows back link; homepage section does not. */
  variant?: "section" | "page";
};

export default function FontCompare({ variant = "section" }: FontCompareProps) {
  const isPage = variant === "page";

  return (
    <section
      className={`font-compare${isPage ? " font-compare--page" : ""}`}
      id="fonts"
      aria-labelledby="font-compare-heading"
    >
      <header className="font-compare-header wrap">
        <p className="font-compare-eyebrow">Client review</p>
        <h2 className="font-compare-page-title" id="font-compare-heading">
          Display font comparison
        </h2>
        <p className="font-compare-lede">
          Same headlines, two typefaces. Michroma (A) vs Simple Square (B).
          Pick the direction that feels right for Signal 2027.
        </p>
        {isPage ? (
          <Link className="font-compare-home" href="/#fonts">
            ← View on live site
          </Link>
        ) : (
          <Link className="font-compare-home" href="/font-compare">
            Open full comparison page →
          </Link>
        )}
      </header>

      <div className="font-compare-legend wrap" aria-hidden="true">
        <div className="font-compare-legend-col">
          <span className="font-compare-badge">A</span>
          <strong>Michroma</strong>
          <span>Option A</span>
        </div>
        <div className="font-compare-legend-col">
          <span className="font-compare-badge font-compare-badge--b">B</span>
          <strong>Simple Square</strong>
          <span>Option B · currently live</span>
        </div>
      </div>

      <div className="font-compare-list wrap">
        {SAMPLES.map((sample) => (
          <div key={sample.label} className="font-compare-row">
            <p className="font-compare-row-label">{sample.label}</p>
            <div className="font-compare-pair">
              <article className="font-compare-card">
                <p className="font-compare-card-meta">
                  <span className="font-compare-badge">A</span>
                  Michroma
                </p>
                <p className={`font-compare-sample ${michroma.className}`}>
                  {sample.text}
                </p>
              </article>
              <article className="font-compare-card">
                <p className="font-compare-card-meta">
                  <span className="font-compare-badge font-compare-badge--b">
                    B
                  </span>
                  Simple Square
                </p>
                <p className={`font-compare-sample ${simpleSquare.className}`}>
                  {sample.text}
                </p>
              </article>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
