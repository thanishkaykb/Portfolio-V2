import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../../lib/data";
import { subscribeContactDialog } from "../../lib/contactDialog";
import { useBodyLock } from "../../lib/hooks";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * A direct contact card: the email address on screen and tappable. This exists
 * because a bare mailto link does nothing on machines without a mail client,
 * which made the Email button look broken.
 */
export default function ContactDialog() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useBodyLock(open);

  useEffect(() => subscribeContactDialog(() => setOpen(true)), []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[95] grid place-items-center overflow-y-auto bg-ink/85 p-4 backdrop-blur-xl"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md border border-gold/30 bg-ink-2 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.6)] md:p-8"
          >
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              aria-label="Close contact details"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center border border-line font-mono text-[11px] text-muted transition-colors hover:border-gold hover:text-gold"
            >
              ✕
            </button>

            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-gold">Contact</p>
            <h2
              id="contact-dialog-title"
              className="display mt-3 text-[clamp(2rem,6vw,2.6rem)] leading-[0.95] text-bone"
            >
              Let&apos;s talk.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Email me directly. I read every message and reply within a day.
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center justify-between gap-4 border border-line p-4 transition-colors hover:border-gold"
              >
                <span className="min-w-0">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold/80">
                    Email
                  </span>
                  <span className="mt-1 block break-all text-sm text-bone group-hover:text-gold">
                    {profile.email}
                  </span>
                </span>
                <span aria-hidden className="shrink-0 text-[12px] text-gold">
                  ↗
                </span>
              </a>

            </div>

            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
              {profile.location} · usually replies within a day
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
