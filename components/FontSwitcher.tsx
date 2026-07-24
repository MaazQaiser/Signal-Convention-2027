"use client";

import { useEffect, useState } from "react";
import "./FontSwitcher.css";

export type DisplayFont = "simple" | "michroma" | "grotesque" | "orbitron";

export const DISPLAY_FONT_KEY = "signal-display-font";
export const DISPLAY_FONT_EVENT = "signal-display-font";

const FONTS: { id: DisplayFont; label: string }[] = [
  { id: "michroma", label: "Michroma" },
  { id: "simple", label: "Simple Square" },
  { id: "grotesque", label: "Grotesque" },
  { id: "orbitron", label: "Orbitron" },
];

function isDisplayFont(value: string | null): value is DisplayFont {
  return (
    value === "michroma" ||
    value === "simple" ||
    value === "grotesque" ||
    value === "orbitron"
  );
}

function applyDisplayFont(font: DisplayFont) {
  document.documentElement.setAttribute("data-display-font", font);
  try {
    localStorage.setItem(DISPLAY_FONT_KEY, font);
  } catch {
    /* ignore */
  }
}

export function setDisplayFont(font: DisplayFont) {
  applyDisplayFont(font);
  window.dispatchEvent(new CustomEvent(DISPLAY_FONT_EVENT, { detail: font }));
}

export function readStoredDisplayFont(): DisplayFont {
  try {
    const stored = localStorage.getItem(DISPLAY_FONT_KEY);
    if (isDisplayFont(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "simple";
}

export default function FontSwitcher() {
  const [font, setFont] = useState<DisplayFont>("simple");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = readStoredDisplayFont();
    setFont(next);
    applyDisplayFont(next);
    setReady(true);

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<DisplayFont>).detail;
      if (isDisplayFont(detail)) setFont(detail);
    };
    window.addEventListener(DISPLAY_FONT_EVENT, onChange);
    return () => window.removeEventListener(DISPLAY_FONT_EVENT, onChange);
  }, []);

  const select = (next: DisplayFont) => {
    setFont(next);
    setDisplayFont(next);
  };

  return (
    <div
      className={`font-switcher${ready ? " font-switcher--ready" : ""}`}
      role="group"
      aria-label="Display font"
    >
      <p className="font-switcher-label">Display font</p>
      <div className="font-switcher-track">
        {FONTS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`font-switcher-btn${
              font === option.id ? " is-active" : ""
            }`}
            aria-pressed={font === option.id}
            onClick={() => select(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
