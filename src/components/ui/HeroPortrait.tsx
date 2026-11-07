import { motion } from "framer-motion";
import { cn, useReducedMotion } from "../../lib/hooks";

type Props = {
  compact?: boolean;
  className?: string;
};

const PORTRAIT = "/images/portrait-hero.webp";

/**
 * The landing page portrait.
 *
 * A transparent colour cut-out that stands on the page with no frame or plate.
 * It stays still: no pointer tilt, no parallax, no drift. The only light is a
 * faint gold edge that follows the silhouette so the figure lifts off the black
 * background without a visible box.
 */
export default function HeroPortrait({ className }: Props) {
  const reduced = useReducedMotion();

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
          style={{
            WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
            maskImage: "linear-gradient(180deg, #000 0%, #000 92%, transparent 100%)",
          }}
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
        </div>
      </motion.div>
    </div>
  );
}
