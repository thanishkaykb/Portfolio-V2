import { useState } from "react";
import Cursor from "./components/layout/Cursor";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import Footer from "./components/layout/Footer";
import Nav from "./components/layout/Nav";
import Preloader from "./components/layout/Preloader";
import Recognition from "./components/sections/Recognition";
import About from "./components/sections/About";
import AbilitySection from "./components/sections/AbilitySection";
import Contact from "./components/sections/Contact";
import DoorWorld from "./components/sections/DoorWorld";
import Hero from "./components/sections/Hero";
import Story from "./components/sections/Story";
import BackToTop from "./components/ui/BackToTop";
import ContactDialog from "./components/ui/ContactDialog";
import Marquee from "./components/ui/Marquee";
import { useSmoothScroll } from "./lib/useSmoothScroll";

export default function App() {
  const [entered, setEntered] = useState(false);
  useSmoothScroll();

  return (
    <div className="relative min-h-screen bg-ink text-bone">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.16em] focus:text-ink"
      >
        Skip to content
      </a>

      <Preloader onEntered={() => setEntered(true)} />
      <Cursor />
      <Nav />

      <main id="main">
        <ErrorBoundary label="page content">
          <Hero entered={entered} />
          <Marquee />
          <DoorWorld />
          <AbilitySection />
          <About />
          <Story />
          <Recognition />
          <Contact />
        </ErrorBoundary>
      </main>

      <Footer />
      <BackToTop />
      <ContactDialog />
      <div className="noise-overlay" aria-hidden />
    </div>
  );
}
