import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ErrorBoundary from "../layout/ErrorBoundary";
import HeroPortrait from "../ui/HeroPortrait";
import { profile, resumePath } from "../../lib/data";
import { resumePath } from "../../lib/data";
import { openDoor } from "../../lib/doors";
import {
  scrollToSection,
  useIsVisible,
  useReducedMotion,
  useWebGLSupport,
} from "../../lib/hooks";

const HeroScene = lazy(() => import("../three/HeroScene"));

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero({ entered }: { entered: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const reduced = useReducedMotion();
  const webgl = useWebGLSupport();
  const { ref, visible } = useIsVisible<HTMLDivElement>();

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setRoleIndex((value) => (value + 1) % profile.disciplines.length),
      3400,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  const anim = (delay: number) =>
    reduced
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 34 },
          animate: entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 34 },
          transition: { duration: 1, ease, delay },
        };

  return (
    <section id="home" ref={ref} className="relative isolate overflow-hidden pt-20 md:pt-24">
      {/* 3D backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-90">
        {webgl && entered && (
          <ErrorBoundary label="hero scene" fallback={null}>
            <Suspense fallback={null}>
              <HeroScene paused={!visible} reduced={reduced} />
            </Suspense>
          </ErrorBoundary>
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 72% 42%, rgba(255,201,40,0.12), transparent 52%), radial-gradient(ellipse at 12% 88%, rgba(255,201,40,0.06), transparent 46%), linear-gradient(180deg, rgba(8,8,8,0.2), #080808 92%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #292929 1px, transparent 1px), linear-gradient(to bottom, #292929 1px, transparent 1px)",
            backgroundSize: "88px 88px",
            maskImage: "radial-gradient(ellipse at 50% 40%, #000 25%, transparent 76%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, #000 25%, transparent 76%)",
          }}
        />
      </div>

      <div className="container-x relative flex min-h-[calc(100svh-5rem)] flex-col justify-between gap-12 pb-6">
        <motion.div
          {...anim(0.05)}
          className="flex flex-wrap items-start justify-between gap-4 pt-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/80">
              {profile.availability}
            </span>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              {profile.location}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted/60">
              13.08° N · 80.27° E
            </p>
          </div>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-7 lg:pl-16 xl:pl-28">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <motion.p {...anim(0.12)} className="display text-[clamp(1.3rem,3.1vw,1.85rem)] text-gold">
                  Hey, I&apos;m
                </motion.p>

                <motion.h1
                  {...anim(0.18)}
                  className="display mt-1 text-[clamp(2.6rem,15vw,6.5rem)] leading-[0.94] text-bone"
                >
                  <span className="block">Thanishka</span>
                  <span className="block text-gold">
                    Yogesh<span className="text-bone">.</span>
                  </span>
                </motion.h1>
              </div>

              {/* a small portrait sits beside the name on phones and tablets */}
              <motion.div
                {...anim(0.22)}
                className="w-[25vw] max-w-[104px] shrink-0 sm:max-w-[136px] lg:hidden"
              >
                <HeroPortrait compact />
              </motion.div>
            </div>

            <motion.div
              {...anim(0.32)}
              className="mt-8 flex h-7 items-center gap-3 border-b border-line/70 pb-3"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
              <div className="relative h-5 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={profile.disciplines[roleIndex]}
                    initial={reduced ? false : { y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduced ? undefined : { y: -18, opacity: 0 }}
                    transition={{ duration: 0.45, ease }}
                    className="block font-mono text-[11px] uppercase tracking-[0.26em] text-bone/90"
                  >
                    {profile.disciplines[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p
              {...anim(0.42)}
              className="mt-6 max-w-xl text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-bone/80"
            >
              {profile.intro}
            </motion.p>

            <motion.div {...anim(0.52)} className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openDoor("website-development")}
                className="group inline-flex items-center gap-2.5 bg-gold px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                See my work
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-2.5 border border-line px-5 py-3.5 text-[11px] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                Get in touch
              </button>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2 px-1 py-3.5 text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
              >
                GitHub
                <span aria-hidden className="text-[10px] text-gold/70 transition-transform group-hover:-translate-y-0.5">
                  ↗
                </span>
              </a>
              <a
                href={resumePath}
                download="Thanishka-Yogesh-Resume.pdf"
                className="group inline-flex items-center gap-2 px-1 py-3.5 text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-gold"
              >
                Resume
                <span aria-hidden className="text-[10px] text-gold/70 transition-transform group-hover:-translate-y-0.5">
                  ↘
                </span>
              </a>
            </motion.div>

            <motion.div
              {...anim(0.6)}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted"
            >
              <span className="text-gold/90">{profile.tagline}</span>
              <span className="hidden h-3 w-px bg-line sm:block" aria-hidden />
              <span>{profile.college}</span>
            </motion.div>
          </div>

          <motion.div {...anim(0.3)} className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto w-full max-w-[310px]">
              <HeroPortrait />
            </div>
          </motion.div>
        </div>

        <div className="flex items-end justify-between border-t border-line pt-4">
          <button
            onClick={() => scrollToSection("about")}
            className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted transition-colors hover:text-bone"
          >
            Scroll to explore
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full border border-line transition-colors group-hover:border-gold group-hover:text-gold"
            >
              ↓
            </span>
          </button>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted sm:block">
            {profile.degree} · {profile.department}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold/70">TY</span>
        </div>
      </div>
    </section>
  );
}
