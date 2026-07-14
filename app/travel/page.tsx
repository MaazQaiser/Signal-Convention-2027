import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import TravelHero from "@/components/travel/TravelHero";
import TravelGlance from "@/components/travel/TravelGlance";
import TravelHotel from "@/components/travel/TravelHotel";
import TravelArrivalGuide from "@/components/travel/TravelArrivalGuide";
import TravelFlying from "@/components/travel/TravelFlying";
import TravelResortMap from "@/components/travel/TravelResortMap";
import TravelFaqs from "@/components/travel/TravelFaqs";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import ClosingModel from "@/components/ClosingModel";

export const metadata: Metadata = {
  title: "Travel & Accommodation — Signal 2027 · Here We Grow",
  description:
    "Plan your stay for Here We Grow 2027 at JW Marriott Desert Ridge Resort & Spa in Phoenix. Hotel reservations, arrival guide, travel details, and resort map.",
};

export default function TravelPage() {
  return (
    <>
      <SmoothScroll active />
      <Nav />
      <main className="travel-page">
        <TravelHero />
        <TravelGlance />
        <TravelHotel />
        <TravelArrivalGuide />
        <TravelFlying />
        <TravelResortMap />
        <TravelFaqs />
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
