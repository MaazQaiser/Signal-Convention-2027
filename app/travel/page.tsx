import type { Metadata } from "next";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import SmoothScroll from "@/components/SmoothScroll";
import TravelHero from "@/components/travel/TravelHero";
import TravelGlance from "@/components/travel/TravelGlance";
import TravelHotel from "@/components/travel/TravelHotel";
import TravelResortMap from "@/components/travel/TravelResortMap";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import ClosingModel from "@/components/ClosingModel";

export const metadata: Metadata = {
  title: "Hotel & Travel — Signal 2027 · Here We Grow",
  description:
    "Hotel and travel details for Here We Grow 2027 at JW Marriott Desert Ridge Resort & Spa in Phoenix.",
};

export default function TravelPage() {
  return (
    <>
      <SmoothScroll active />
      <Nav />
      <MobileBottomNav />
      <main className="travel-page">
        <TravelHero />
        <TravelGlance />
        <TravelHotel />
        <TravelResortMap />
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
