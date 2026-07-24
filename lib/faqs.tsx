import type { ReactNode } from "react";

export type FaqEntry = {
  q: string;
  a: ReactNode;
};

export const CONVENTION_FAQS: FaqEntry[] = [
  {
    q: "When and where is Here We Grow 2027?",
    a: "The 2027 Here We Grow Convention takes place January 17–19, 2027, at JW Marriott Desert Ridge Resort & Spa in Phoenix, Arizona.",
  },
  {
    q: "What does registration include?",
    a: "Signal registration includes convention access, hotel accommodations for two attendees and select meals throughout the convention.",
  },
  {
    q: "What is the dress code?",
    a: "Business casual is recommended for most convention activities. Special evening events may require different attire.",
  },
  {
    q: "Can I bring a guest?",
    a: "Guests attending convention programming or meals must be registered as attendees.",
  },
  {
    q: "Where can I find hotel and travel details?",
    a: (
      <>
        See the{" "}
        <a href="/travel">Hotel &amp; Travel</a> page for hotel
        reservations, arrival guidance, airport details, and travel FAQs.
      </>
    ),
  },
  {
    q: "Where can I find the full agenda?",
    a: (
      <>
        Explore the complete schedule on the{" "}
        <a href="/agenda">Agenda</a> page, including general sessions,
        breakouts, and evening events.
      </>
    ),
  },
  {
    q: "How do I become a sponsor?",
    a: (
      <>
        Email{" "}
        <a href="mailto:convention@teamsignal.com">
          convention@teamsignal.com
        </a>{" "}
        to discuss partnership options.
      </>
    ),
  },
  {
    q: "Still have another question?",
    a: (
      <>
        Contact{" "}
        <a href="mailto:convention@teamsignal.com">
          convention@teamsignal.com
        </a>{" "}
        and our team will be happy to assist you.
      </>
    ),
  },
];
