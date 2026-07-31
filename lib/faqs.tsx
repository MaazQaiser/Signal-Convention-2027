import type { ReactNode } from "react";

export type FaqEntry = {
  q: string;
  a: ReactNode;
};

export const CONVENTION_FAQS: FaqEntry[] = [
  {
    q: "When and where is Convention?",
    a: "The 2027 Here We Grow Convention is Sunday, January 17 through Tuesday, January 19, 2027. It will be held at the JW Marriott Desert Ridge in Phoenix, AZ.",
  },
  {
    q: "How do I reserve a hotel room?",
    a: (
      <>
        <p>
          Your hotel reservation can be made during the registration process.
          For Signal franchisees, your registration includes a three-night stay
          (Sunday, Monday, Tuesday) for you and one guest. For Filtergo
          franchisees, your registration includes a two-night stay (Sunday and
          Monday). If you&apos;d like to extend your hotel stay before or after
          Convention, indicate your requested dates during registration. A
          credit card will be required to guarantee the additional nights. Hotel
          room availability is not guaranteed for the additional nights, so book
          early.
        </p>
        <p>
          <a href="/#register">Click here to register and to reserve your hotel room.</a>
        </p>
      </>
    ),
  },
  {
    q: "What does it cost?",
    a: (
      <>
        <p>
          <strong>Signal Franchisees</strong>
        </p>
        <p>
          The registration fee is $2,800 and includes two attendees, three hotel
          nights (Sunday, January 17 through Tuesday, January 19), and lunch and
          dinner on Monday and Tuesday.
        </p>
        <p>
          Additional attendee (separate hotel room): $2,000, which includes
          three hotel nights (Sunday, January 17 through Tuesday, January 19)
          and lunch and dinner on Monday and Tuesday.
        </p>
        <p>
          Additional attendee (sharing a room): $600 Convention Fee (after the
          first two attendees) and includes lunch and dinner on Monday and
          Tuesday.
        </p>
        <p>
          <strong>Filtergo Franchisees</strong>
        </p>
        <p>
          The registration fee is $800 and includes two attendees, two hotel
          nights (Sunday, January 17 through Monday, January 18), and lunch and
          dinner on Monday.
        </p>
      </>
    ),
  },
  {
    q: "Do I have to register?",
    a: (
      <>
        Yes! Anyone who plans to participate in any Convention event must
        register.{" "}
        <a href="/#register">Click here to get started.</a>
      </>
    ),
  },
  {
    q: "If I am bringing a guest who isn’t attending the convention, do I have to register them?",
    a: "If your guest plans to attend any Convention programming or events, they must be registered as an attendee. If your guest will merely be sharing a hotel room but won’t participate in any Convention events or meals at all, they don’t need to register.",
  },
  {
    q: "If I register and suddenly have a new contract start/health problem, will I get a refund?",
    a: "We are not able to grant refunds if you are unable to attend. Rooms can be cancelled per hotel policy or up to 7 days before.",
  },
  {
    q: "What is the dress code?",
    a: (
      <>
        <p>
          The dress code for 90% of convention is business casual with a few
          exceptions:
        </p>
        <ul>
          <li>
            Sunday night&apos;s Welcome Reception will be outdoors, so dress
            comfortably casual.
          </li>
          <li>
            Tuesday night&apos;s Legacy Night is semi-formal. Ladies may wish to
            wear a dress; gents should wear a coat and/or tie.
          </li>
        </ul>
        <p>Most lunches will be outside. Plan accordingly.</p>
      </>
    ),
  },
  {
    q: "What else can I do while I’m in the Phoenix area?",
    a: (
      <>
        Tons! Visit the{" "}
        <a
          href="https://www.visitphoenix.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Travel and Tourism site
        </a>{" "}
        to see a list of area attractions.
      </>
    ),
  },
  {
    q: "Can I bring my children?",
    a: "The hotel is a family-friendly property with a range of amenities kids are sure to love. Please don’t plan to bring children to the keynotes or breakouts. Anyone attending Convention meals (child or otherwise) must be a registered attendee.",
  },
];
