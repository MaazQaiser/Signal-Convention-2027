import type { Metadata } from "next";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import SmoothScroll from "@/components/SmoothScroll";
import AgendaHero from "@/components/agenda/AgendaHero";
import AgendaOverview from "@/components/agenda/AgendaOverview";
import AgendaSchedule from "@/components/agenda/AgendaSchedule";
import AgendaHotelCta from "@/components/agenda/AgendaHotelCta";
import FAQ from "@/components/FAQ";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import ClosingModel from "@/components/ClosingModel";

export const metadata: Metadata = {
  title: "Convention Agenda — Signal 2027 · Here We Grow",
  description:
    "Explore the complete schedule for Here We Grow 2027, January 17–19 at JW Marriott Desert Ridge Resort & Spa in Phoenix, Arizona.",
};

export default function AgendaPage() {
  return (
    <>
      <SmoothScroll active />
      <Nav />
      <MobileBottomNav />
      <main className="agenda-page">
        <AgendaHero />
        <AgendaOverview />
        <AgendaSchedule />
        <AgendaHotelCta />
        <FAQ />
        <div className="closing">
          <div className="closing-mark-stage" aria-hidden="true">
            <div className="closing-mark-glow" />
            <ClosingModel />
          </div>
          <Register />
          <Footer />
        </div>
      </main>
    </>
  );
}
