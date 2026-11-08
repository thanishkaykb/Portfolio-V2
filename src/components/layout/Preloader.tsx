import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyLock, useReducedMotion } from "../../lib/hooks";

const WHISPER = [
  "Website Developer",
  "Full-Stack",
  "React",
  "TypeScript",
  "Creative Technologist",
  "Chennai",
];

export default function Preloader({ onEntered }: { onEntered: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [whisper, setWhisper] = useState(0);
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

  // Advance the whisper word every few hundred milliseconds so the strip feels
  // alive without anything flashing.
  useEffect(() => {
    if (reduced) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % WHISPER.length;
      setWhisper(i);
    }, 700);
    return () => window.clearInterval(id);
  }, []);

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
            {/* breathing gold halo behind the mark */}
            <div
              aria-hidden
              className="absolute -inset-12 rounded-full bg-gold/5"
              style={{
                background:
                  "radial-gradient(60% 55% at 50% 42%, rgba(255,201,40,0.30), transparent 72%)",
                filter: "blur(32px)",
                animation: reduced
                  ? "none"
                  : "gold-pulse 6s ease-in-out infinite",
              }}
            />

            <div className="relative h-40 w-40 md:h-52 md:w-52">
              {/* dashed orbit */}
              <div
                className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-line"
                style={{ animationDirection: reduced ? "normal" : "normal" }}
              />
              <div className="absolute inset-4 rounded-full border border-line/80" />

              {/* staggered TY reveal */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="display text-5xl md:text-6xl text-gold">
                  <motion.span
                    initial={reduced ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    T
                  </motion.span>
                  <motion.span
                    initial={reduced ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Y
                  </motion.span>
                </span>
              </div>

              {/* pulsing gold core */}
              <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(255,201,40,0.55), rgba(255,201,40,0.10) 55%, transparent 72%)",
                  animation: reduced
                    ? "none"
                    : "gold-pulse 6s ease-in-out infinite",
                }}
              />
            </div>

            {/* progress */}
            <div className="w-full max-w-sm">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="eyebrow text-bone/50">Building the room</span>
                <span className="font-mono text-xs text-gold tabular-nums">
                  {String(progress).padStart(3, "0")}%
                </span>
              </div>
              <div className="h-px w-full bg-line">
                <div
                  className="h-px bg-gold shadow-[0_0_12px_2px_rgba(255,201,40,0.55)] transition-[width] duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* whisper strip — moves on every layout */}
          <div className="flex items-center justify-center gap-8 overflow-hidden border-t border-line pt-4">
            <motion.span
              key={WHISPER[whisper]}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs uppercase tracking-[0.24em] text-gold/80"
            >
              {WHISPER[whisper]}
            </motion.span>
            <span className="h-3 w-3 shrink-0 rounded-full bg-gold/60" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Chennai, IN
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
