import { useEffect, useRef } from "react";
import { useIsTouch, useReducedMotion } from "../../lib/hooks";

/**
 * Custom gold cursor: a small solid dot with a ring that grows over anything
 * interactive. Disabled for touch devices and reduced-motion users.
 *
 * Tracking is 1:1 with the pointer: the position is written straight from the
 * pointer event, not eased in a frame loop. Easing the ring (the old approach)
 * costs a frame of lag at 60 Hz and much more when the 3D scenes are busy, which
 * reads as a cursor that cannot keep up. Only the ring's *size* and opacity are
 * transitioned, and those live on a child element so the transform on the
 * parent never animates.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const ringInner = useRef<HTMLDivElement | null>(null);
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (isTouch || reduced) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    const innerEl = ringInner.current;
    if (!dotEl || !ringEl || !innerEl) return;

    let visible = false;
    let grown = false;
    let lastX = Number.NaN;
    let lastY = Number.NaN;

    const place = (x: number, y: number) => {
      if (x === lastX && y === lastY) return;
      lastX = x;
      lastY = y;
      // One compositor-friendly translate each, written immediately so the
      // cursor sits exactly under the pointer on the same frame as the event.
      dotEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ringEl.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const show = () => {
      if (visible) return;
      visible = true;
      dotEl.style.opacity = "1";
      ringEl.style.opacity = "1";
    };

    const setGrown = (next: boolean) => {
      if (next === grown) return;
      grown = next;
      innerEl.style.transform = next ? "scale(2.35)" : "scale(1)";
      ringEl.style.opacity = "1";
    };

    const onMove = (event: PointerEvent) => {
      place(event.clientX, event.clientY);
      show();
      const target = event.target as Element | null;
      setGrown(
        Boolean(
          target?.closest(
            "a, button, [role='button'], input, textarea, select, [data-cursor='grow']",
          ),
        ),
      );
    };

    // Touch pads and pens report through the same events; a pen moving over the
    // page gets the same 1:1 tracking as a mouse.
    const onLeave = () => {
      visible = false;
      dotEl.style.opacity = "0";
      ringEl.style.opacity = "0";
    };

    const onDown = () => {
      innerEl.style.transform = grown ? "scale(2)" : "scale(0.82)";
    };
    const onUp = () => {
      innerEl.style.transform = grown ? "scale(2.35)" : "scale(1)";
    };

    // pointerrawupdate fires more often than pointermove where browsers support
    // it, which keeps fast flicks aligned with the real pointer path.
    const raw = "onpointerrawupdate" in window;
    const moveEvent = raw ? "pointerrawupdate" : "pointermove";

    window.addEventListener(moveEvent, onMove as EventListener, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    // A pointer that is already on the page when this mounts (for example after
    // a route change) starts exactly where it is rather than at the centre.
    place(window.innerWidth / 2, window.innerHeight / 2);

    return () => {
      window.removeEventListener(moveEvent, onMove as EventListener);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [isTouch, reduced]);

  if (isTouch || reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={dot}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold opacity-0 mix-blend-difference"
        style={{ transition: "opacity 160ms linear", willChange: "transform" }}
      />
      <div
        ref={ring}
        className="fixed left-0 top-0 opacity-0"
        style={{ transition: "opacity 200ms linear", willChange: "transform" }}
      >
        <div
          ref={ringInner}
          className="h-8 w-8 rounded-full border border-gold/60"
          style={{ transition: "transform 130ms ease-out", willChange: "transform" }}
        />
      </div>
    </div>
  );
}
