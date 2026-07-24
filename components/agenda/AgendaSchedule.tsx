"use client";

import Image from "next/image";
import Reveal, { REVEAL_CASCADE } from "@/components/Reveal";
import {
  AGENDA_DAYS,
  PRE_CONVENTION,
  type AgendaDay,
  type AgendaItem,
  type PreConventionBlock,
} from "@/lib/agenda-schedule";

const FADE = { once: false as const, amount: 0.15 };

function EventRow({ item }: { item: AgendaItem }) {
  const isFiltergo =
    item.tags.includes("Filtergo") ||
    item.title.toLowerCase().includes("filtergo");

  return (
    <li
      className={[
        "agenda-list-row",
        item.highlight ? "agenda-list-row--highlight" : "",
        isFiltergo ? "agenda-list-row--filtergo" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="agenda-list-thumb">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          width={88}
          height={88}
          className="agenda-list-thumb-img"
        />
      </div>

      <div className="agenda-list-when">
        <span className="agenda-list-clock">{item.timePrimary}</span>
        <span className="agenda-list-clock-sub">{item.timeSecondary}</span>
      </div>

      <div className="agenda-list-main">
        <h3 className="agenda-list-title">{item.title}</h3>
        {item.description ? (
          <p className="agenda-list-desc">{item.description}</p>
        ) : null}
        <ul className="agenda-list-tags">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className={tag === "Filtergo" ? "agenda-list-tag--filtergo" : undefined}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function DayBlock({
  block,
}: {
  block: AgendaDay | (PreConventionBlock & { id?: string });
}) {
  const headingId =
    "id" in block && block.id
      ? `day-${block.id}-heading`
      : "agenda-precon-heading";
  const sectionId =
    "id" in block && block.id ? `day-${block.id}` : "day-precon";

  return (
    <section
      className="agenda-list-day"
      id={sectionId}
      aria-labelledby={headingId}
    >
      <Reveal className="agenda-list-day-head" delay={REVEAL_CASCADE.title} {...FADE}>
        <p className="agenda-list-day-label">{block.label}</p>
        <div className="agenda-list-day-period">
          <h2 className="agenda-list-day-title" id={headingId}>
            {block.periodLabel}
          </h2>
          <span className="agenda-list-day-year">{block.yearLabel}</span>
        </div>
      </Reveal>

      <Reveal delay={REVEAL_CASCADE.body} {...FADE}>
        <ol className="agenda-list-rows">
          {block.items.map((item) => (
            <EventRow
              key={`${sectionId}-${item.title}-${item.timePrimary}`}
              item={item}
            />
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

export default function AgendaSchedule() {
  return (
    <div className="agenda-schedule agenda-surface--light">
      <div className="wrap agenda-list">
        <Reveal className="agenda-list-intro" delay={REVEAL_CASCADE.title} {...FADE}>
          <p className="agenda-list-intro-label">Full Schedule</p>
          <h2 className="agenda-list-intro-title">Jan 17–19, 2027</h2>
        </Reveal>

        <DayBlock block={PRE_CONVENTION} />
        {AGENDA_DAYS.map((day) => (
          <DayBlock key={day.id} block={day} />
        ))}
      </div>
    </div>
  );
}
