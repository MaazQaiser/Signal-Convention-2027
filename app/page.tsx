import Nav from "@/components/Nav";
import Journey from "@/components/Journey";
import Agenda from "@/components/Agenda";
import Sponsors from "@/components/Sponsors";
import FAQ from "@/components/FAQ";
import Register from "@/components/Register";
import Footer from "@/components/Footer";
import ClosingModel from "@/components/ClosingModel";
import LoadingGate from "@/components/LoadingGate";

export default function Home() {
  return (
    <LoadingGate>
      <Nav />
      <Journey />
      <Agenda />
      <Sponsors />
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
