import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../../lib/data";
import { useBodyLock, useReducedMotion } from "../../lib/hooks";

export default function Preloader({ onEntered }: { onEntered: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();
  useBodyLock(!done);

  useEffect(() => {
    if (reduced) {
      setProgress(100);
      setDone(true);
      return;
    }
    const started = performance.now();
    const total = 1500;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const next = Math.min(100, Math.round((elapsed / total) * 100));
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setDone(true), 220);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  // Hard stop: the intro must never trap the page, even if animation frames
  // are throttled (background tab, hidden preview iframe, stalled GPU).
  useEffect(() => {
    const id = window.setTimeout(() => setDone(true), 4200);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(onEntered, reduced ? 0 : 900);
    return () => window.clearTimeout(id);
  }, [done, onEntered, reduced]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-5 py-6 md:px-10 md:py-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow text-bone/70">Thanishka Yogesh</span>
            <span className="eyebrow text-bone/40">Portfolio / 2026</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative h-40 w-40 md:h-52 md:w-52">
              <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-line" />
              <div className="absolute inset-4 rounded-full border border-line/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="display text-5xl text-gold md:text-6xl">TY</span>
              </div>
              <div
                className="absolute inset-0 animate-gold-pulse rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,201,40,0.22), transparent 68%)",
                }}
              />
            </div>
            <div className="w-full max-w-sm">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="eyebrow text-bone/50">Building the room</span>
                <span className="font-mono text-xs text-gold tabular-nums">
                  {String(progress).padStart(3, "0")}%
                </span>
              </div>
              <div className="h-px w-full bg-line">
                <div
                  className="h-px bg-gold transition-[width] duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-6">
            <p className="max-w-xs text-xs leading-relaxed text-muted md:text-sm">
              {profile.tagline}
            </p>
            <span className="eyebrow text-bone/40">Chennai, IN</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
