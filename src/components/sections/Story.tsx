import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timeline } from "../../lib/data";
import { cn, useReducedMotion } from "../../lib/hooks";
import SectionHeading from "../ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const section = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const current = timeline[index] ?? timeline[0];

  useEffect(() => {
    if (reduced) return;
    const root = section.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".story-item");

      items.forEach((item, itemIndex) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          },
        );

        ScrollTrigger.create({
          trigger: item,
          start: "top 62%",
          end: "bottom 62%",
          onEnter: () => setIndex(itemIndex),
          onEnterBack: () => setIndex(itemIndex),
        });
      });

      gsap.fromTo(
        ".story-progress-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: ".story-list",
            start: "top 70%",
            end: "bottom 72%",
            scrub: 0.6,
          },
        },
      );

      gsap.to(".story-digits", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".story-list",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="story" ref={section} className="relative border-t border-line py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            index="04"
            label="My story"
            title={
              <>
                Let&apos;s go back
                <br />
                <span className="text-gold">in time.</span>
              </>
            }
          />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Every project, every experiment, every milestone, in the order it happened.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* sticky index panel */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <div className="relative overflow-hidden border border-line bg-ink-2 p-6">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-25"
                  style={{
                    background:
                      "radial-gradient(120% 80% at 20% 0%, rgba(255,201,40,0.18), transparent 60%)",
                  }}
                />
                <div className="relative">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                    {String(index + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
                  </p>
                  <p className="display mt-6 text-[7rem] leading-none text-bone/90 transition-all duration-500">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    {current.period}
                  </p>
                  <p className="mt-4 text-sm leading-snug text-bone/90">{current.title}</p>
                  <p className="mt-1 text-xs text-muted">{current.org}</p>
                </div>

                <div className="relative mt-6 flex h-24 gap-2 overflow-hidden" aria-hidden>
                  {[0, 1, 2, 3, 4].map((column) => (
                    <div key={column} className="story-digits flex flex-col gap-1 opacity-25">
                      {Array.from({ length: 20 }).map((_, row) => (
                        <span
                          key={row}
                          className="font-mono text-[11px] leading-none text-gold/70"
                        >
                          {(row + column) % 10}
                        </span>
                      ))}
                    </div>
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-2 via-transparent to-ink-2" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-24 w-px bg-line">
                  <div className="story-progress-fill absolute inset-x-0 top-0 h-full origin-top bg-gold" />
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                  Scroll through the timeline
                </p>
              </div>
            </div>
          </div>

          {/* entries */}
          <ol className="story-list relative lg:col-span-8">
            {timeline.map((entry, entryIndex) => (
              <li
                key={entry.title}
                className={cn(
                  "story-item group relative border-t border-line py-7 pl-6 md:py-9 md:pl-10",
                  entryIndex === timeline.length - 1 && "border-b",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-9 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-colors duration-300",
                    index === entryIndex ? "bg-gold" : "bg-line group-hover:bg-gold/60",
                  )}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold/85">
                    {entry.period}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60 lg:hidden">
                    {String(entryIndex + 1).padStart(2, "0")}
                  </p>
                </div>

                <h3 className="mt-2 text-xl leading-snug text-bone transition-colors group-hover:text-gold md:text-2xl">
                  {entry.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{entry.org}</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted/90">{entry.body}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-line px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {entry.link && (
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold/80 transition-colors hover:text-gold"
                  >
                    {entry.linkLabel ?? "View"}
                    <span aria-hidden>↗</span>
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
