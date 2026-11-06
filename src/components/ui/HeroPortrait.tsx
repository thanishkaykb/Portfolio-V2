import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn, useReducedMotion } from "../../lib/hooks";

type Props = {
  compact?: boolean;
  className?: string;
};

const PORTRAIT = "/images/portrait-hero.webp";

/**
 * The landing page portrait.
 *
 * A transparent cut-out in full colour, so there is no frame, plate or box:
 * the figure stands on the page. It floats slowly, tilts a few degrees toward
 * the pointer, and lifts in on load. The About section keeps its own framed
 * aperture, this is hero-only.
 */
export default function HeroPortrait({ compact = false, className }: Props) {
  const reduced = useReducedMotion();
  const area = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 18, mass: 0.4 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 18, mass: 0.4 });
  const shiftX = useTransform(smoothX, [-1, 1], [-9, 9]);
  const shiftY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const rotateY = useTransform(smoothX, [-1, 1], [4, -4]);
  const rotateX = useTransform(smoothY, [-1, 1], [-3, 3]);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || compact) return;
    const rect = area.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const reset = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={area}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn("relative select-none", className)}
      style={{ perspective: 1000 }}
    >
      {/* warm halo behind the shoulders, no rectangle */}
      <motion.div
        aria-hidden
        animate={reduced ? undefined : { opacity: [0.5, 0.78, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-x-[-8%] top-[-6%] h-[66%] blur-3xl"
        style={{
          background:
            "radial-gradient(48% 52% at 56% 34%, rgba(255,201,40,0.22), transparent 72%), radial-gradient(38% 38% at 30% 74%, rgba(255,201,40,0.09), transparent 72%)",
        }}
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -9, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <motion.div
            style={{
              x: shiftX,
              y: shiftY,
              WebkitMaskImage:
                "linear-gradient(180deg, #000 0%, #000 90%, transparent 100%)",
              maskImage: "linear-gradient(180deg, #000 0%, #000 90%, transparent 100%)",
            }}
            className="relative"
          >
            <img
              src={PORTRAIT}
              alt="Portrait of Thanishka Yogesh"
              width={760}
              height={1256}
              loading="eager"
              decoding="async"
              draggable={false}
              className="relative z-10 w-full select-none"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
