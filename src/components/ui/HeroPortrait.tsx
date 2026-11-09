import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn, useReducedMotion } from "../../lib/hooks";

type Props = {
  compact?: boolean;
  className?: string;
};

const PORTRAIT = "/images/portrait-hero.webp";

/**
 * Radius of the colour window, in CSS pixels. This is the only thing that
 * decides how much of the photograph regains colour: black in the mask shows
 * the colour image, transparent leaves the greyscale layer beneath. It scales
 * with the portrait so the window stays a small circle on a phone and on a
 * laptop, and is capped so it can never become a full-image reveal.
 */
const RADIUS_RATIO = 0.38;
const RADIUS_MIN = 34;
const RADIUS_MAX = 110;

/** The mask: solid at the centre, feathered out to nothing at the radius. */
const REVEAL_MASK = `radial-gradient(circle var(--reveal-r, 72px) at var(--reveal-x, 50%) var(--reveal-y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.4) 75%, transparent 100%)`;

/**
 * The landing page portrait.
 *
 * A transparent colour cut-out that stands on the page with no frame or plate.
 * It stays still: no pointer tilt, no parallax, no drift. The only light is a
 * faint gold edge that follows the silhouette so the figure lifts off the black
 * background without a visible box.
 *
 * On a mouse-driven screen the portrait starts in greyscale. A second copy of
 * the same photograph sits on top, masked by a single small radial gradient
 * placed at the pointer, so only the area immediately around the cursor shows
 * the original colours. One window, no trail: moving the pointer moves the
 * window and every previous position returns to grey, and the window fades in
 * on entry and out on exit. Mouse, finger and pen all drive the same window: a
 * finger reveals colour only while it is held down, and lifting it returns the
 * portrait to grey. Reduced-motion visitors get the full-colour portrait.
 */
export default function HeroPortrait({ className }: Props) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const colorRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const color = colorRef.current;
    if (!host || !color) return;

    let frame = 0;
    let next: { x: number; y: number } | null = null;
    // The finger or pen currently held down. A mouse needs no button, so it is
    // handled separately and reveals for as long as the pointer is inside.
    let heldId: number | null = null;

    /** Move the colour window to the latest pointer position. */
    const apply = () => {
      frame = 0;
      if (!next) return;
      color.style.setProperty("--reveal-x", `${next.x}px`);
      color.style.setProperty("--reveal-y", `${next.y}px`);
    };

    /**
     * Place the window from a viewport position, measured against the
     * portrait's own box so the mask stays aligned at every size, and clamped
     * inside it so a finger sliding off the edge never parks the window
     * somewhere the photograph is not.
     */
    const move = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.min(rect.width, Math.max(0, clientX - rect.left));
      const y = Math.min(rect.height, Math.max(0, clientY - rect.top));
      next = { x, y };
      if (color.style.opacity !== "1") {
        color.style.setProperty("--reveal-x", `${x}px`);
        color.style.setProperty("--reveal-y", `${y}px`);
        color.style.opacity = "1";
      }
      if (!frame) frame = requestAnimationFrame(apply);
    };

    /** Back to full greyscale: no window, no leftover coloured area. */
    const hide = () => {
      heldId = null;
      next = null;
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      color.style.opacity = "0";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        move(event.clientX, event.clientY);
        return;
      }
      if (heldId !== null && event.pointerId === heldId) {
        move(event.clientX, event.clientY);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        move(event.clientX, event.clientY);
        return;
      }
      heldId = event.pointerId;
      move(event.clientX, event.clientY);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      if (heldId !== null && event.pointerId === heldId) hide();
    };

    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerId === heldId) hide();
    };

    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || event.pointerId === heldId) hide();
    };

    /** Keep the window small relative to the portrait at every breakpoint. */
    const sizeWindow = () => {
      const width = host.getBoundingClientRect().width;
      if (!width) return;
      const radius = Math.min(RADIUS_MAX, Math.max(RADIUS_MIN, width * RADIUS_RATIO));
      color.style.setProperty("--reveal-r", `${Math.round(radius)}px`);
    };

    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerup", onPointerUp);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("pointercancel", onPointerCancel);

    const observer = new ResizeObserver(sizeWindow);
    observer.observe(host);
    sizeWindow();

    return () => {
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointercancel", onPointerCancel);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={cn("relative select-none", className)}>
      {/* Soft gold light behind the whole figure. A drop-shadow was drawing the
          image's bounding box on some browsers, so the glow is a blurred light
          field with no hard edges instead. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-18%] inset-y-[-5%] blur-3xl"
        style={{
          background:
            "radial-gradient(46% 44% at 52% 36%, rgba(255,201,40,0.28), transparent 72%), radial-gradient(44% 40% at 48% 70%, rgba(255,201,40,0.14), transparent 74%)",
        }}
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* The fade lives on a wrapper: applying mask-image and a drop-shadow to
            the same element makes browsers shadow the mask rectangle instead of
            the figure, which draws a gold box around the portrait. */}
        <div
          ref={hostRef}
          className="relative"
          style={{
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
            maskImage: "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
            // The portrait owns every gesture that starts on it, so a drag in
            // any direction moves the colour window instead of scrolling the
            // page out from under the finger. Only this box opts out; the rest
            // of the page keeps its normal scroll.
            touchAction: "none",
          }}
        >
          {/* Base layer: the photograph in greyscale. */}
          <img
            src={PORTRAIT}
            alt="Portrait of Thanishka Yogesh"
            width={760}
            height={1256}
            loading="eager"
            decoding="async"
            draggable={false}
            className="relative z-10 block w-full select-none"
            style={{ filter: "grayscale(100%) contrast(110%) brightness(96%)" }}
          />

          {/* Colour layer: the same photograph, visible only inside the mask
              window that follows the pointer. Always mounted, on every layout. */}
          <img
            ref={colorRef}
            src={PORTRAIT}
            alt=""
            aria-hidden
            width={760}
            height={1256}
            loading="eager"
            decoding="async"
            draggable={false}
            className="pointer-events-none absolute inset-0 z-20 block h-full w-full select-none opacity-0 transition-opacity duration-150 ease-out"
            style={{
              WebkitMaskImage: REVEAL_MASK,
              maskImage: REVEAL_MASK,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "0 0",
              maskPosition: "0 0",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
