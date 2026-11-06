import { useState } from "react";
import { motion } from "framer-motion";
import { moreProjects, profile, projects } from "../../lib/data";
import { cn, scrollToSection, useReducedMotion } from "../../lib/hooks";
import SectionHeading from "../ui/SectionHeading";
import ProjectArtwork from "../ui/ProjectArtwork";
import CaseStudy from "./CaseStudy";
import type { Project } from "../../lib/data";

type Props = {
  /** Lets the door close itself before scrolling to the contact section. */
  onWorkWithMe?: () => void;
  /** The door renders its own closing box, so it hides this one. */
  showCta?: boolean;
};

/**
 * The selected-work showcase. Lives inside the Website Development door, so it
 * renders content only and lets the door own the page frame.
 */
export function ProjectsShowcase({ onWorkWithMe, showCta = true }: Props) {
  const [selected, setSelected] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  return (
    <div>
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading
          label="Selected work"
          title={
            <>
              Built, shipped,
              <br />
              <span className="text-gold">documented.</span>
            </>
          }
        />
        <div className="max-w-xs">
          <p className="text-sm leading-relaxed text-muted">
            {projects.length} case studies from public repositories and live deployments. No invented
            clients, metrics or outcomes.
          </p>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:text-bone"
          >
            All repositories ↗
          </a>
        </div>
      </div>

      <div className="mt-10 md:mt-14">
        {projects.map((project, index) => (
          <motion.article
            key={project.slug}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: Math.min(index * 0.05, 0.28),
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(event) => {
              const target = event.target as HTMLElement;
              if (target.closest("a, button")) return;
              setSelected(project);
            }}
            className="group grid cursor-pointer gap-6 border-t border-line py-8 md:gap-10 md:py-12 lg:grid-cols-12 lg:items-center"
          >
            <div
              className={cn("lg:col-span-6", index % 2 === 1 ? "lg:order-2 lg:col-start-7" : "")}
            >
              <button
                onClick={() => setSelected(project)}
                className="group/preview relative block w-full overflow-hidden border border-line text-left transition-colors duration-500 hover:border-gold/50"
                aria-label={`Open the ${project.name} case study`}
              >
                <div className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover/preview:scale-[1.03]">
                  <ProjectArtwork
                    motif={project.motif}
                    shot={`/projects/${project.slug}.jpg`}
                    label={project.name}
                    sub={project.tagline}
                  />
                </div>
                <span className="pointer-events-none absolute bottom-3 right-3 z-10 border border-gold/60 bg-ink/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold backdrop-blur">
                  Tap for the full story ↗
                </span>
              </button>
            </div>

            <div
              className={cn(
                "lg:col-span-6",
                index % 2 === 1 ? "lg:order-1 lg:col-start-1 lg:pr-8" : "lg:pl-8",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-6 bg-line" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {project.kind} · {project.year}
                </span>
              </div>

              <h3 className="mt-4 display text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[0.92] text-bone transition-colors group-hover:text-gold">
                {project.name}
              </h3>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-bone/75 md:text-base">
                {project.tagline}
              </p>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted md:text-base">
                {project.problem}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tech.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="border border-line/80 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 5 && (
                  <span className="px-1 py-1 font-mono text-[9px] text-gold/70">
                    +{project.tech.length - 5}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setSelected(project)}
                  className="group/btn inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold"
                >
                  <span className="border-b border-bone/30 pb-1 transition-colors group-hover/btn:border-gold">
                    Read the case study
                  </span>
                  <span aria-hidden className="text-gold">
                    →
                  </span>
                </button>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-gold"
                  >
                    Live ↗
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-gold"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* more builds */}
      <div className="mt-4 border-t border-line pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
            Also built: a longer shelf
          </h3>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            {moreProjects.length} more public builds
          </span>
        </div>

        <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
          {moreProjects.map((item) => (
            <li key={item.name} className="border-b border-line/70">
              <a
                href={item.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-start justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-sm text-bone transition-colors group-hover:text-gold">
                    {item.name}
                  </p>
                  <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">{item.line}</p>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted/70">
                    {item.tech}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-[10px] text-muted transition-all group-hover:-translate-y-0.5 group-hover:text-gold"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* closing box */}
        {showCta && (
        <div className="mt-12 flex flex-col gap-7 border border-gold/35 bg-gold/[0.06] p-6 sm:flex-row sm:items-end sm:justify-between md:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
              Open for work
            </p>
            <p className="mt-3 display text-[clamp(1.7rem,4vw,2.6rem)] leading-[1] text-bone">
              Got a site in mind<span className="text-gold">?</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Internships, product builds or a redesign. Send me the idea and I will tell you
              honestly what it takes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onWorkWithMe ?? (() => scrollToSection("contact"))}
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

      <CaseStudy project={selected} onClose={() => setSelected(null)} onChange={setSelected} />
    </div>
  );
}

export default ProjectsShowcase;
