import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "../../lib/data";
import { projects } from "../../lib/data";
import { jumpToScroll, useBodyLock } from "../../lib/hooks";
import { closeButtonClass } from "../../lib/closeButton";
import { isTopOverlay, useOverlayHistory } from "../../lib/overlayHistory";
import ProjectArtwork from "../ui/ProjectArtwork";

type ScrollSnapshot = {
  windowY: number;
  /** The door sheet and any other fixed panel scroll themselves, not the page. */
  scrollers: { el: HTMLElement; top: number }[];
};

/** Reads every scroll offset the page is showing at this moment. */
function captureScroll(): ScrollSnapshot {
  const scrollers: { el: HTMLElement; top: number }[] = [];
  document.querySelectorAll<HTMLElement>("[data-lenis-prevent]").forEach((el) => {
    if (el.scrollTop > 0) scrollers.push({ el, top: el.scrollTop });
  });
  return { windowY: window.scrollY, scrollers };
}

type Props = {
  project: Project | null;
  onClose: () => void;
  onChange: (project: Project) => void;
};

export default function CaseStudy({ project, onClose, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const snapshotRef = useRef<ScrollSnapshot | null>(null);
  // One history entry per open, whatever route the reader leaves by.
  const { dismiss } = useOverlayHistory(
    Boolean(project),
    project ? { kind: "case-study", slug: project.slug } : null,
    onClose,
  );

  // Remember where the visitor was, then put them back there once the overlay
  // has gone. This effect is declared before useBodyLock so the capture still
  // sees a scrollable page: the lock below is what collapses the window scroll.
  useEffect(() => {
    if (project) {
      // Opening, or moving between projects with next/previous: keep the
      // original position from the first open only.
      if (!snapshotRef.current) snapshotRef.current = captureScroll();
      return;
    }

    const saved = snapshotRef.current;
    if (!saved) return;
    snapshotRef.current = null;

    // Wait for the body and html overflow locks to be released and for the
    // exit animation to settle before touching scroll, then restore in a
    // second frame so no layout shift happens after the jump.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        for (const { el, top } of saved.scrollers) {
          if (el.isConnected) el.scrollTop = top;
        }
        jumpToScroll(saved.windowY);
      });
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [project]);

  useBodyLock(Boolean(project));

  useEffect(() => {
    if (!project) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // The contact card can sit above this study; Escape belongs to the top
      // layer only, so one press never closes two views.
      if (!isTopOverlay({ kind: "case-study", slug: project.slug })) return;
      dismiss();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [project, dismiss]);

  const index = project ? projects.findIndex((item) => item.slug === project.slug) : -1;
  const next = index >= 0 ? projects[(index + 1) % projects.length] : null;
  const prev = index >= 0 ? projects[(index - 1 + projects.length) % projects.length] : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[85] overflow-y-auto overscroll-contain bg-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-full"
          >
            <div className="sticky top-0 z-10 border-b border-line bg-ink/92 backdrop-blur-xl">
              <div className="container-x flex items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-gold">
                    Case study
                  </span>
                  <span className="h-3 w-px bg-line" aria-hidden />
                  <span className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    {project.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="hidden border border-line px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-gold hover:text-gold sm:block"
                    >
                      Repository ↗
                    </a>
                  )}
                  <button
                    ref={closeRef}
                    onClick={dismiss}
                    aria-label="Close case study"
                    className={closeButtonClass}
                  >
                    Close <span aria-hidden>✕</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="container-x py-10 md:py-14">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">
                    {project.kind} · {project.year}
                  </p>
                  <h2
                    id="case-title"
                    className="mt-4 display text-[clamp(2.4rem,7vw,5.2rem)] text-bone"
                  >
                    {project.name}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-bone/85">
                    {project.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-transform hover:-translate-y-0.5"
                      >
                        Live build ↗
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 border border-line px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-gold hover:text-gold"
                      >
                        Repository → GitHub
                      </a>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="aspect-[4/3] overflow-hidden border border-line">
                    <ProjectArtwork
                      motif={project.motif}
                      shot={`/projects/${project.slug}.jpg`}
                      label={project.name}
                    />
                  </div>
                  <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                    Screenshot of the deployed build.
                  </p>

                </div>
              </div>

              <div className="mt-14 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gold/60 bg-gold/8">
                  <span className="animate-bounce -ml-0.5" aria-hidden>↓</span>
                </span>
                Scroll to read the project
              </div>

              <div className="mt-12 grid gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                    The problem
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-bone/70">{project.problem}</p>
                </div>

                <div className="lg:col-span-8">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                    What it is
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone/85 md:text-[17px] md:leading-relaxed">
                    {project.description}
                  </p>

                  <h3 className="mt-10 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                    Key features
                  </h3>
                  <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2.5 border-t border-line/70 pt-2 text-sm text-muted"
                      >
                        <span aria-hidden className="mt-1 text-[9px] text-gold">
                          ✦
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 grid gap-8 sm:grid-cols-2">
                    <div>
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                        My contribution
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-muted">{project.contribution}</p>
                    </div>
                    <div>
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                        Stack
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/80"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-14 flex flex-col justify-between gap-4 border-t border-line pt-6 sm:flex-row">
                {prev && (
                  <button
                    onClick={() => onChange(prev)}
                    className="group text-left"
                    aria-label={`Previous project: ${prev.name}`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      ← Previous
                    </span>
                    <p className="mt-1 text-sm text-bone transition-colors group-hover:text-gold">
                      {prev.name}
                    </p>
                  </button>
                )}
                {next && (
                  <button
                    onClick={() => onChange(next)}
                    className="group text-right sm:ml-auto"
                    aria-label={`Next project: ${next.name}`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                      Next →
                    </span>
                    <p className="mt-1 text-sm text-bone transition-colors group-hover:text-gold">
                      {next.name}
                    </p>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
