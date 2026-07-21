import Nav from "@/components/Nav";
import MobileBottomNav from "@/components/MobileBottomNav";
import SectionNav from "@/components/SectionNav";
import Journey from "@/components/Journey";
import Agenda from "@/components/Agenda";
import Sponsors from "@/components/Sponsors";
import FontCompare from "@/components/FontCompare";
import FAQ from "@/components/FAQ";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import ClosingModel from "@/components/ClosingModel";
import LoadingGate from "@/components/LoadingGate";

export default function Home() {
  return (
    <LoadingGate>
      <Nav />
      <MobileBottomNav />
      <SectionNav />
      <Journey />
      <Agenda />
      <Sponsors />
      <FontCompare />
      <FAQ />
      <div className="closing">
        <div className="closing-mark-stage" aria-hidden="true">
          <div className="closing-mark-glow" />
          <ClosingModel />
        </div>
        <Register />
        <Footer />
      </div>
    </LoadingGate>
  );
}
