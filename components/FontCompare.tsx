import { Michroma, Orbitron } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import "./FontCompare.css";

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const simpleSquare = localFont({
  src: "../app/fonts/ST-SimpleSquare.otf",
  weight: "400",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const cabinetGrotesk = localFont({
  src: [
    {
      path: "../app/fonts/CabinetGrotesk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/CabinetGrotesk-Extrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
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

const OPTIONS = [
  {
    id: "A",
    name: "Michroma",
    note: "Option A",
    badgeClass: "",
  },
  {
    id: "B",
    name: "Simple Square",
    note: "Option B",
    badgeClass: "font-compare-badge--b",
  },
  {
    id: "C",
    name: "Grotesque",
    note: "Option C · Cabinet Grotesk",
    badgeClass: "font-compare-badge--c",
  },
  {
    id: "D",
    name: "Orbitron",
    note: "Option D",
    badgeClass: "font-compare-badge--d",
  },
] as const;

type FontCompareProps = {
  /** Standalone page shows back link; homepage section does not. */
  variant?: "section" | "page";
};

export default function FontCompare({ variant = "section" }: FontCompareProps) {
  const isPage = variant === "page";
  const optionClass = {
    A: michroma.className,
    B: simpleSquare.className,
    C: cabinetGrotesk.className,
    D: orbitron.className,
  } as const;

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
          Same headlines, four typefaces. Use the floating{" "}
          <strong>Display font</strong> switcher to flip the whole site between
          Michroma, Simple Square, Grotesque, and Orbitron in one click.
        </p>
        {isPage ? (
          <Link className="font-compare-home" href="/">
            ← Back to home
          </Link>
        ) : (
          <Link className="font-compare-home" href="/font-compare">
            Open full comparison page →
          </Link>
        )}
      </header>

      <div className="font-compare-legend wrap" aria-hidden="true">
        {OPTIONS.map((option) => (
          <div key={option.id} className="font-compare-legend-col">
            <span
              className={`font-compare-badge ${option.badgeClass}`.trim()}
            >
              {option.id}
            </span>
            <strong>{option.name}</strong>
            <span>{option.note}</span>
          </div>
        ))}
      </div>

      <div className="font-compare-list wrap">
        {SAMPLES.map((sample) => (
          <div key={sample.label} className="font-compare-row">
            <p className="font-compare-row-label">{sample.label}</p>
            <div className="font-compare-pair font-compare-pair--quad">
              {OPTIONS.map((option) => (
                <article key={option.id} className="font-compare-card">
                  <p className="font-compare-card-meta">
                    <span
                      className={`font-compare-badge ${option.badgeClass}`.trim()}
                    >
                      {option.id}
                    </span>
                    {option.name}
                  </p>
                  <p
                    className={`font-compare-sample ${optionClass[option.id]}`}
                  >
                    {sample.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
