import { useEffect, useRef } from "react";
import { useIsTouch, useReducedMotion } from "../../lib/hooks";

/**
 * Custom gold cursor: a small solid dot with a trailing ring that grows over
 * anything interactive. Disabled for touch devices and reduced-motion users.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement | null>(null);
  const ring = useRef<HTMLDivElement | null>(null);
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (isTouch || reduced) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let scale = 1;
    let targetScale = 1;
    let frame = 0;
    let visible = false;

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        visible = true;
        dotEl.style.opacity = "1";
        ringEl.style.opacity = "1";
      }
      const el = event.target as HTMLElement | null;
      const interactive = el?.closest(
        "a, button, [role='button'], input, textarea, select, [data-cursor='grow']",
      );
      targetScale = interactive ? 2.35 : 1;
    };

    const onLeave = () => {
      visible = false;
      dotEl.style.opacity = "0";
      ringEl.style.opacity = "0";
    };

    const onDown = () => {
      targetScale *= 0.82;
    };

    const render = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      scale += (targetScale - scale) * 0.16;
      dotEl.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ringEl.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      ringEl.style.opacity = visible ? `${Math.max(0.25, 1 - (scale - 1) * 0.5)}` : "0";
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [isTouch, reduced]);

  if (isTouch || reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={dot}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-gold opacity-0 mix-blend-difference"
        style={{ transition: "opacity 300ms" }}
      />
      <div
        ref={ring}
        className="fixed left-0 top-0 h-8 w-8 rounded-full border border-gold/60 opacity-0"
        style={{ transition: "opacity 300ms" }}
      />
    </div>
  );
}
