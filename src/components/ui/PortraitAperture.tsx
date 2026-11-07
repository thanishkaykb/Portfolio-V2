import { useState } from "react";
import { cn } from "../../lib/hooks";

type Props = {
  variant?: "hero" | "about";
  className?: string;
  caption?: string;
  /** Small mobile variant: drops the inner labels so nothing crowds. */
  compact?: boolean;
};

/**
 * Golden portrait aperture.
 *
 * Uses /images/portrait-about.webp when present. The frame is a tall arch rather than
 * a circle so a head-and-shoulders portrait keeps the face in frame, and the
 * image is graded warm with a gold rim so it sits inside the black page
 * instead of looking like a pasted cut-out. Until the file exists, an original
 * monogram light-study is shown, never a stock face.
 */
const SOURCES = ["/images/portrait-about.webp"];

export default function PortraitAperture({
  variant = "hero",
  className,
  caption,
  compact = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const isHero = variant === "hero";
  const hasPhoto = loaded && !failed;
  const src = SOURCES[sourceIndex];

  return (
    <figure className={cn("relative m-0 select-none", className)}>
      <div className="relative">
        {/* offset hairline plate for depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-b-[22px] rounded-t-[999px] border border-gold/20"
        />

        {/* backlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 rounded-b-[60px] rounded-t-[999px] opacity-80 blur-2xl"
          style={{
            background:
              "radial-gradient(60% 55% at 68% 18%, rgba(255,201,40,0.26), transparent 70%), radial-gradient(50% 40% at 20% 85%, rgba(255,201,40,0.10), transparent 70%)",
          }}
        />

        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-b-[22px] rounded-t-[999px] border border-gold/25 bg-ink-2"
          style={{
            boxShadow:
              "0 0 0 1px rgba(255,201,40,0.10), 0 30px 90px -30px rgba(255,201,40,0.35), inset 0 0 70px rgba(0,0,0,0.85)",
          }}
        >
          {/* photograph */}
          <img
            key={src}
            src={src}
            alt="Portrait of Thanishka Yogesh"
            width={1000}
            height={1250}
            loading={isHero ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => {
              if (sourceIndex < SOURCES.length - 1) {
                setLoaded(false);
                setSourceIndex(sourceIndex + 1);
              } else {
                setFailed(true);
              }
            }}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out",
              hasPhoto ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
            )}
            style={{
              objectPosition: "50% 18%",
              filter: "contrast(1.03) saturate(0.96) brightness(0.97) sepia(0.08)",
            }}
          />

          {/* warm grade + vignette, so the studio backdrop melts into the page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,201,40,0.10) 0%, rgba(8,8,8,0) 28%, rgba(8,8,8,0) 52%, rgba(8,8,8,0.55) 82%, rgba(8,8,8,0.92) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(75% 55% at 72% 10%, rgba(255,214,94,0.22), transparent 62%), radial-gradient(120% 90% at 50% 50%, transparent 45%, rgba(8,8,8,0.55) 100%)",
              mixBlendMode: "soft-light",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.65)" }}
          />

          {/* monogram fallback */}
          {!hasPhoto && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative flex flex-col items-center">
                <span
                  className={cn(
                    "display leading-none text-gold/90",
                    compact ? "text-[2.6rem]" : isHero ? "text-[24vw] md:text-[9rem]" : "text-[7rem]",
                  )}
                  style={{ textShadow: "0 0 60px rgba(255,201,40,0.35)" }}
                >
                  TY
                </span>
                <span className="mt-3 font-mono text-[9px] uppercase tracking-[0.4em] text-bone/50">
                  Chennai · India
                </span>
              </div>
            </div>
          )}

          <div className="grain pointer-events-none absolute inset-0 opacity-35" />

          {/* bottom label inside the frame */}
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4",
              compact && "hidden",
            )}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-bone/70">
              Thanishka Yogesh
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-gold/80">
              2026
            </span>
          </div>
        </div>

        {/* arch outline + orbiting dot */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[7%] rounded-b-[40px] rounded-t-[999px] border border-dashed border-gold/15"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-4%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_18px_4px_rgba(255,201,40,0.55)]"
        />
      </div>

      {caption && (
        <figcaption className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-muted">
            {caption}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-gold/70">
            {isHero ? "Portfolio" : "About"}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
