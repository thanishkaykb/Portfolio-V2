import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../../lib/data";
import { useBodyLock } from "../../lib/hooks";

type Props = { open: boolean; onClose: () => void };

/**
 * The resume lives at /public/resume/Thanishka-Yogesh-Resume.pdf. This panel
 * only offers the two actions: open the PDF in a new tab, or download it. The
 * document itself is never rendered inside the dialog.
 */
export default function ResumeDialog({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  useBodyLock(open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close resume dialog"
            className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            tabIndex={-1}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md border border-line bg-ink-2 p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <span className="eyebrow gold-dot">Resume</span>
                <h2
                  id="resume-title"
                  className="mt-2 text-2xl font-medium tracking-tight text-bone"
                >
                  {profile.name}
                </h2>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  One page · PDF · {profile.role}
                </p>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                className="shrink-0 border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-gold hover:text-gold"
              >
                Close
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted">
              Open the document in a new tab to read every page, or download a copy to keep.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={profile.resumePath}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex flex-1 items-center justify-center gap-2 bg-gold px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-transform hover:-translate-y-0.5"
              >
                Open PDF <span aria-hidden>↗</span>
              </a>
              <a
                href={profile.resumePath}
                download="Thanishka-Yogesh-Resume.pdf"
                type="application/pdf"
                className="inline-flex flex-1 items-center justify-center gap-2 border border-line px-5 py-3.5 text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-gold hover:text-gold"
              >
                Download PDF <span aria-hidden>↓</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Small hook so multiple places can own the dialog state consistently. */
export function useResumeDialog() {
  const [open, setOpen] = useState(false);
  return { open, openDialog: () => setOpen(true), closeDialog: () => setOpen(false) };
}
