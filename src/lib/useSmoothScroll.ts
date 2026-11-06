import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setLenis, useReducedMotion } from "./hooks";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger stays in
 * sync. Disabled entirely for reduced-motion users.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setLenis(null);
      return;
    }

    // Lerp mode rather than duration mode: the page keeps easing toward the
    // target on every frame, so long scrolls and touch flicks stay silky
    // instead of stopping on a fixed clock.
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.7,
      syncTouch: true,
      syncTouchLerp: 0.1,
      autoRaf: false,
      anchors: false,
    });

    setLenis(lenis);
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);
}
