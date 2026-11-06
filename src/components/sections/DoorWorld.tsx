import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { doors, profile, projects } from "../../lib/data";
import { openDoor, subscribeDoorOpen } from "../../lib/doors";
import {
  cn,
  scrollToSection,
  useBodyLock,
  useIsVisible,
  useIsTouch,
  useWebGLSupport,
} from "../../lib/hooks";
import ErrorBoundary from "../layout/ErrorBoundary";
import SectionHeading from "../ui/SectionHeading";
import { ProjectsShowcase } from "./Projects";
import { WebWorkShowcase } from "./WebCraft";
import { PoetryShowcase } from "./Writing";

const DoorScene = lazy(() => import("../three/DoorScene"));

export default function DoorWorld() {
  const [opened, setOpened] = useState<number | null>(null);
  const [expanding, setExpanding] = useState<number | null>(null);
  // The sheet only covers the scene once the door has visibly swung open.
  const [revealed, setRevealed] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const openTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const webgl = useWebGLSupport();
  const isTouch = useIsTouch();
  const { ref, visible } = useIsVisible<HTMLDivElement>();

  const focusIndex = opened ?? expanding ?? 0;
  const current = revealed && opened !== null ? doors[opened] : null;
  const relatedProjects = useMemo(
    () =>
      current
        ? current.projectSlugs
            .map((slug) => projects.find((project) => project.slug === slug))
            .filter((project): project is (typeof projects)[number] => Boolean(project))
        : [],
    [current],
  );

  const clearTimers = () => {
    if (openTimer.current !== null) window.clearTimeout(openTimer.current);
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
    openTimer.current = null;
    revealTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  // Every door holds a full sheet of content once open, so the page behind it
  // must not scroll, and the sheet always starts at its own top.
  useBodyLock(opened !== null);

  useEffect(() => {
    if (!revealed) return;
    sheetRef.current?.scrollTo({ top: 0 });
  }, [revealed]);

  const closeDoor = () => {
    setRevealed(false);
    clearTimers();
    // Let the sheet fade out before the panel swings shut and the camera pulls
    // back to the corridor.
    revealTimer.current = window.setTimeout(() => setOpened(null), 420);
  };

  useEffect(() => {
    if (!revealed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDoor();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed]);

  /**
   * The full opening: the door is pushed forward, its panel swings open while
   * the camera walks up to the doorway, and only then does the content sheet
   * come up. Closing plays the reverse.
   */
  const openDoorAt = (index: number, scrollFirst = false) => {
    clearTimers();
    setRevealed(false);
    if (scrollFirst) scrollToSection("skills");
    setExpanding(index);
    openTimer.current = window.setTimeout(() => {
      setExpanding(null);
      setOpened(index);
      revealTimer.current = window.setTimeout(() => setRevealed(true), 860);
    }, 470);
  };

  const handleOpen = (index: number) => openDoorAt(index);
  const requestOpen = (index: number) => openDoorAt(index);

  /** Nav, hero and inline links ask for a door by id through this event. */
  useEffect(
    () =>
      subscribeDoorOpen((id) => {
        const index = doors.findIndex((door) => door.id === id);
        if (index >= 0) openDoorAt(index, true);
      }),
    [],
  );

  // Shared by the no-WebGL path and the scene's error fallback, so the three
  // doors always stay usable even if the 3D corridor cannot start.
  const doorGrid = (
    <div className="grid h-full grid-cols-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2">
      {doors.map((door, index) => (
        <button
          key={door.id}
          onClick={() => handleOpen(index)}
          className={cn(
            "flex flex-col items-start justify-between border p-4 text-left transition-colors",
            opened === index ? "border-gold bg-gold/5" : "border-line hover:border-gold/60",
          )}
        >
          <span className="font-mono text-[10px] text-gold">{door.index}</span>
          <span className="mt-6 display text-2xl text-bone">{door.title}</span>
          <span className="mt-2 text-xs text-muted">{door.short}</span>
        </button>
      ))}
    </div>
  );

  return (
    <section id="skills" className="relative border-t border-line py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index="02"
            label="Career · one door per discipline"
            title={
              <>
                My work, one door
                <br />
                <span className="text-gold">per skill</span>
              </>
            }
          />
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-muted md:text-base">
              Three doors, three disciplines. Move across the wall, then open the one you want to
              walk through.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-gold/80">
              {isTouch ? "Tap a door to open it" : "Hover to read · click to open"}
            </p>
          </div>
        </div>

        <div
          ref={ref}
          className="relative mt-10 overflow-hidden border border-line bg-[#0a0a09] md:mt-14"
        >
          <div
            className="relative h-[clamp(340px,56vh,560px)] w-full"
            onTouchStart={(event) => setTouchStart(event.changedTouches[0].clientX)}              onTouchEnd={(event) => {
              if (touchStart === null) return;
              const delta = event.changedTouches[0].clientX - touchStart;
              if (Math.abs(delta) > 42) {
                const base = opened ?? 0;
                const next = (base + (delta > 0 ? -1 : 1) + doors.length) % doors.length;
                requestOpen(next);
              }
              setTouchStart(null);
            }}
          >
            {webgl ? (
              <ErrorBoundary label="skill door scene" fallback={doorGrid}>
                <Suspense
                  fallback={
                    <div className="grid h-full place-items-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                      Building the corridor…
                    </div>
                  }
                >
                  <DoorScene
                    opened={opened}
                    expanding={expanding}
                    paused={!visible}
                    onExpand={requestOpen}
                    labels={labelRefs}
                  />
                </Suspense>
              </ErrorBoundary>
            ) : (
              doorGrid
            )}

            {/* DOM labels for the 3D doors, positioned from each frame's projection */}
            {webgl && (
              <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
                {doors.map((door, index) => (
                  <div
                    key={door.id}
                    ref={(element) => {
                      labelRefs.current[index] = element;
                    }}
                    style={{ visibility: "hidden", willChange: "transform" }}
                    className="absolute left-0 top-0 flex w-[38vw] max-w-[168px] flex-col items-center gap-1 text-center"
                  >
                    <span className="font-mono text-[9px] tracking-[0.34em] text-gold/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => requestOpen(index)}
                      onPointerOver={() => setHovered(index)}
                      onPointerOut={() => setHovered(null)}
                      className="display pointer-events-auto text-[15px] leading-[1.05] text-bone transition-colors hover:text-gold focus-visible:text-gold"
                      aria-label={`Open the ${door.title} door`}
                    >
                      {door.title}
                    </button>
                    <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-muted">
                      {door.short}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* corner marks */}
            <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-gold/40" />
            <span aria-hidden className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-gold/40" />
            <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-gold/40" />
            <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-gold/40" />

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted">
                The corridor
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-muted">
                {String(focusIndex + 1).padStart(2, "0")} / {String(doors.length).padStart(2, "0")}
              </span>
            </div>

            {/* door sheet, portalled so no ancestor can clip it */}
            {createPortal(
              <AnimatePresence>
              {current && (
                <motion.div
                  key={current.id}
                  ref={sheetRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="door-title"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  data-lenis-prevent
                  className="fixed inset-0 z-[65] overflow-y-auto overscroll-contain bg-ink/97 backdrop-blur-xl"
                >
                  <motion.div
                    initial={{ y: 26, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                    className="relative min-h-full"
                  >
                    <div className="sticky top-0 z-10 border-b border-line bg-ink/95 backdrop-blur-xl">
                      <div className="container-x flex items-center justify-between gap-4 py-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                          Door {current.index} · {current.kicker}
                        </span>
                        <button
                          onClick={closeDoor}
                          className="shrink-0 border border-line px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:border-gold hover:text-gold"
                        >
                          Close ✕
                        </button>
                      </div>
                    </div>

                    <div className="container-x pb-16 pt-8 md:pt-10">
                    <h3
                      id="door-title"
                      className="display text-[clamp(1.9rem,4.4vw,3.4rem)] text-bone"
                    >
                      {current.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/80 md:text-base">
                      {current.statement}
                    </p>
                    {current.intro && (
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-[15px] md:leading-relaxed">
                        {current.intro}
                      </p>
                    )}

                    {current.id === "website-development" && (
                      <div className="mt-10 border-t border-line pt-10 md:mt-14 md:pt-14">
                        <ProjectsShowcase showCta={false} />
                        <div className="mt-16 border-t border-line pt-10 md:mt-20 md:pt-14">
                          <WebWorkShowcase />
                        </div>
                      </div>
                    )}

                    {current.id === "creative-development" && (
                      <div className="mt-10 border-t border-line pt-10 md:mt-14 md:pt-14">
                        <PoetryShowcase />
                      </div>
                    )}

                    {current.id !== "creative-development" && (
                    <div className="mt-10 grid gap-6 lg:grid-cols-12">
                      <p className="text-sm leading-relaxed text-muted lg:col-span-5">
                        {current.details}
                      </p>

                      <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:col-span-7">
                        {current.skills.map((skill) => (
                          <li key={skill.name} className="border-t border-line/80 pt-2">
                            <p className="text-sm text-bone">{skill.name}</p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/80">
                              {skill.note}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    )}

                    {current.id !== "creative-development" && relatedProjects.length > 0 && (
                      <div className="mt-7 border-t border-line pt-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                          Built with this discipline
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {relatedProjects.map((project) => (
                            <button
                              key={project.slug}
                              onClick={() => openDoor("website-development")}
                              className="border border-line px-3 py-1.5 text-[11px] text-bone transition-colors hover:border-gold hover:text-gold"
                            >
                              {project.name} ↗
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* closing box, end of the door */}
                    {current.id !== "creative-development" && (
                    <div className="mt-12 flex flex-col gap-7 border border-gold/35 bg-gold/[0.06] p-6 sm:flex-row sm:items-end sm:justify-between md:p-8">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                          Open for work
                        </p>
                        <p className="mt-3 display text-[clamp(1.7rem,4vw,2.6rem)] leading-[1] text-bone">
                          Got a site in mind<span className="text-gold">?</span>
                        </p>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                          Internships, product builds or a redesign. Send me the idea and I will
                          tell you honestly what it takes.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => {
                            closeDoor();
                            window.setTimeout(() => scrollToSection("contact"), 520);
                          }}
                          className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-transform hover:-translate-y-0.5"
                        >
                          Work with me
                        </button>
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 border border-line px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-gold hover:text-gold"
                        >
                          Browse GitHub ↗
                        </a>
                      </div>
                    </div>
                    )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
              </AnimatePresence>,
              document.body,
            )}
          </div>

          {/* controls under the canvas (always reachable / keyboard accessible) */}
          <div className="relative z-10 flex flex-col gap-4 border-t border-line bg-ink/90 p-3 md:flex-row md:items-center md:justify-between md:px-4">
            <div className="no-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1">
              {doors.map((door, index) => (
                <button
                  key={door.id}
                  onClick={() => requestOpen(index)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  aria-pressed={focusIndex === index}
                  className={cn(
                    "flex shrink-0 items-center gap-2 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
                    focusIndex === index
                      ? "border-gold/70 bg-gold/10 text-gold"
                      : "border-line text-muted hover:border-bone/30 hover:text-bone",
                  )}
                >
                  <span className="text-[9px] opacity-60">{door.index}</span>
                  {door.short}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <button
                onClick={() => requestOpen(focusIndex)}
                className="bg-gold px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-transform hover:-translate-y-0.5"
              >
                Open door {doors[focusIndex].index}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    requestOpen((focusIndex - 1 + doors.length) % doors.length)
                  }
                  aria-label="Previous door"
                  className="grid h-9 w-9 place-items-center border border-line text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  ←
                </button>
                <button
                  onClick={() => requestOpen((focusIndex + 1) % doors.length)}
                  aria-label="Next door"
                  className="grid h-9 w-9 place-items-center border border-line text-muted transition-colors hover:border-gold hover:text-gold"
                >
                  →
                </button>
              </div>
            </div>
          </div>
          <span className="sr-only" aria-live="polite">
            {hovered !== null ? doors[hovered].title : ""}
          </span>
        </div>
      </div>
    </section>
  );
}
