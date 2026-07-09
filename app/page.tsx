import Nav from "@/components/Nav";
import Journey from "@/components/Journey";
import Agenda from "@/components/Agenda";
import NetworkTransition from "@/components/NetworkTransition";
import Merch from "@/components/Merch";
import Register from "@/components/Register";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Journey />
      <Agenda />
      <NetworkTransition />
      <Merch />
      <Register />
      <Footer />
    </>
  );
}
