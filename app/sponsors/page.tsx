import type { Metadata } from "next";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import SmoothScroll from "@/components/SmoothScroll";
import SponsorsHero from "@/components/sponsors/SponsorsHero";
import SponsorsTiers from "@/components/sponsors/SponsorsTiers";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import ClosingModel from "@/components/ClosingModel";

export const metadata: Metadata = {
  title: "Sponsors & Partners — Signal 2027 · Here We Grow",
  description:
    "Meet the partners who power Here We Grow 2027 and support Signal's franchise network.",
};

export default function SponsorsPage() {
  return (
    <>
      <SmoothScroll active />
      <Nav />
      <MobileBottomNav />
      <main className="sponsors-page">
        <SponsorsHero />
        <SponsorsTiers />
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
