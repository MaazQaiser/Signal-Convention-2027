import type { Metadata } from "next";
import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import SmoothScroll from "@/components/SmoothScroll";
import FaqsHero from "@/components/faqs/FaqsHero";
import FaqsList from "@/components/faqs/FaqsList";
import FaqsContactCta from "@/components/faqs/FaqsContactCta";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import ClosingModel from "@/components/ClosingModel";

export const metadata: Metadata = {
  title: "FAQs — Signal 2027 · Here We Grow",
  description:
    "Answers to common questions about Here We Grow 2027—registration, dress code, guests, travel, sponsors, and how to contact the Convention Team.",
};

export default function FaqsPage() {
  return (
    <>
      <SmoothScroll active />
      <Nav />
      <MobileBottomNav />
      <main className="faqs-page">
        <FaqsHero />
        <FaqsList />
        <FaqsContactCta />
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
