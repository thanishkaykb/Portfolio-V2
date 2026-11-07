import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { githubContributions as gh } from "../../lib/github-contributions";
import { cn, useIsTouch, useReducedMotion } from "../../lib/hooks";

/**
 * GitHub activity card, a genuine CSS 3D card showing the public contribution
 * graph for @thanishkaykb. Every number on it is read from
 * src/lib/github-contributions.ts, which is generated from GitHub's own
 * contribution calendar. Nothing here is estimated.
 *
 * Squares use GitHub's own dark-mode green scale so the card reads instantly as
 * "that green box" while the card chrome stays black and gold.
 */

const LEVEL_COLORS = ["rgba(245,242,233,0.08)", "#0e4429", "#006d32", "#26a641", "#39d353"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.014 8.014 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export default function GitHubCard() {
  const wrap = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [flipped, setFlipped] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50, active: false });
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || isTouch) return;
    const node = wrap.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - py) * 9, y: (px - 0.5) * 11 });
    setGlare({ x: px * 100, y: py * 100, active: true });
  };

  const reset = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((value) => ({ ...value, active: false }));
  };

  // A horizontal drag flips the card on touch screens, where there is no
  // hover tilt. A tap still flips it as before.
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, y: event.clientY };
    dragged.current = false;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      dragged.current = true;
      setFlipped((value) => !value);
      window.setTimeout(() => {
        dragged.current = false;
      }, 320);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setFlipped((value) => !value);
    }
  };

  const totalWeeks = gh.weeks.length;
  const bestMonth = gh.topMonths[0];
  const perActiveDay = (gh.total / Math.max(1, gh.activeDays)).toFixed(1);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={wrap}
        className="relative w-full max-w-[600px]"
        style={{ perspective: "1600px" }}
        onPointerMove={onMove}
        onPointerLeave={reset}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={`GitHub activity card for ${gh.handle}. ${gh.total} contributions in the last year. Press Enter to flip.`}
          onClick={() => {
            if (dragged.current) return;
            setFlipped((value) => !value);
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            dragStart.current = null;
          }}
          onKeyDown={onKeyDown}
          className="relative aspect-[0.95] w-full cursor-pointer select-none focus-visible:outline-none sm:aspect-[1.06] lg:aspect-[1.18]"
          style={{
            transformStyle: "preserve-3d",
            touchAction: "pan-y",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (flipped ? 180 : 0)}deg)`,
            transition: flipped
              ? "transform 900ms cubic-bezier(0.16,1,0.3,1)"
              : "transform 180ms ease-out",
          }}
        >
          {/* ───────────── front, the contribution graph ───────────── */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ backfaceVisibility: "hidden", transform: "translateZ(0.1px)" }}
          >
            <div className="absolute inset-0 gold-foil" />
            <div className="absolute inset-[1.5px] bg-ink-2">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background:
                    "radial-gradient(120% 90% at 12% 0%, rgba(255,201,40,0.15), transparent 55%), radial-gradient(90% 70% at 100% 100%, rgba(57,211,83,0.12), transparent 62%)",
                }}
              />
              <div className="grain absolute inset-0 opacity-30" />

              <div
                className="relative flex h-full flex-col justify-between p-5 md:p-7"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* header */}
                <div
                  className="flex items-center justify-between gap-3"
                  style={{ transform: "translateZ(34px)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center border border-line bg-bone/5">
                      <GitHubMark className="h-5 w-5 text-bone" />
                    </span>
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">
                        GitHub activity
                      </p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-bone/60">
                        @{gh.handle} · last 12 months
                      </p>
                    </div>
                  </div>
                  <span className="hidden border border-line px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/70 sm:block">
                    public only
                  </span>
                </div>

                {/* headline number */}
                <div
                  className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-1"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <p className="display text-[clamp(3rem,9vw,4.5rem)] leading-[0.85] text-bone">
                    {gh.total.toLocaleString("en-US")}
                  </p>
                  <p className="mb-1 text-sm leading-tight text-bone/75 md:text-base">
                    contributions
                    <br />
                    <span className="text-bone/50">
                      {prettyDate(gh.rangeStart)}, {prettyDate(gh.rangeEnd)}
                    </span>
                  </p>
                </div>

                {/* the green box */}
                <div className="mt-5" style={{ transform: "translateZ(26px)" }}>
                  <div className="relative mb-1.5 hidden h-3 sm:block" aria-hidden>
                    {gh.monthLabels.map((m) => (
                      <span
                        key={`${m.label}-${m.week}`}
                        className="absolute top-0 font-mono text-[9px] uppercase tracking-[0.08em] text-bone/45"
                        style={{ left: `${(m.week / totalWeeks) * 100}%` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>

                  <div
                    role="img"
                    aria-label={`Contribution calendar for ${gh.handle}: ${gh.total} contributions across ${gh.activeDays} active days.`}
                    className="grid w-full"
                    style={{
                      gridTemplateColumns: `repeat(${totalWeeks}, minmax(0, 1fr))`,
                      gridTemplateRows: "repeat(7, auto)",
                      gridAutoFlow: "column",
                      gap: "clamp(1px, 0.28vw, 3px)",
                    }}
                  >
                    {gh.weeks.flatMap((week, w) =>
                      week.map(([date, count, level], d) => (
                        <span
                          key={`${w}-${d}`}
                          title={
                            date
                              ? `${count} contribution${count === 1 ? "" : "s"} on ${prettyDate(date)}`
                              : undefined
                          }
                          className="aspect-square w-full rounded-[1.5px]"
                          style={{
                            backgroundColor: LEVEL_COLORS[level as 0 | 1 | 2 | 3 | 4],
                            boxShadow: level >= 3 ? "0 0 7px rgba(57,211,83,0.4)" : undefined,
                          }}
                        />
                      )),
                    )}
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/60">
                      {gh.activeDays} active days of 365
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/45">
                        Less
                      </span>
                      {LEVEL_COLORS.map((color, index) => (
                        <span
                          key={index}
                          className="h-2.5 w-2.5 rounded-[1.5px]"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/45">
                        More
                      </span>
                    </span>
                  </div>
                </div>

                {/* stat strip, fills the lower half */}
                <div
                  className="mt-5 grid grid-cols-3 divide-x divide-line border-y border-line"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {[
                    { value: `${gh.longestStreak}`, label: "Best streak" },
                    { value: `${gh.currentStreak}`, label: "Current streak" },
                    { value: `${perActiveDay}`, label: "Per active day" },
                  ].map((stat) => (
                    <div key={stat.label} className="px-2 py-2.5 first:pl-0 last:pr-0">
                      <p className="display text-2xl leading-none text-gold md:text-[1.75rem]">
                        {stat.value}
                      </p>
                      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/55">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* footer */}
                <div
                  className="mt-3 flex items-center justify-between"
                  style={{ transform: "translateZ(14px)" }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/70">
                    Busiest day · {gh.bestDay.count} on {prettyDate(gh.bestDay.date)}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold/80">
                    Flip ↻
                  </span>
                </div>
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: glare.active ? 0.45 : 0,
                  background: `radial-gradient(360px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.26), rgba(57,211,83,0.12) 38%, transparent 62%)`,
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </div>

          {/* ───────────── back, the rhythm behind those squares ───────────── */}
          <div
            className="absolute inset-0 overflow-hidden border border-gold/50 bg-ink-2"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(0.1px)",
            }}
          >
            <div className="grain absolute inset-0 opacity-25" />
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(110% 80% at 85% 0%, rgba(255,201,40,0.18), transparent 60%), radial-gradient(80% 60% at 0% 100%, rgba(57,211,83,0.12), transparent 60%)",
              }}
            />
            <div className="relative flex h-full flex-col p-5 md:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">
                    How that year was spent
                  </p>
                  <p className="mt-1.5 text-sm text-bone/70">
                    {gh.activeDays} days of work across {gh.topMonths.length > 0 ? 12 : 0} months
                  </p>
                </div>
                <GitHubMark className="h-6 w-6 shrink-0 text-gold/70" />
              </div>

              <div className="mt-5 grid flex-1 content-start gap-x-6 gap-y-3 sm:grid-cols-2">
                {gh.topMonths.map((month) => {
                  const width = Math.max(8, Math.round((month.count / bestMonth.count) * 100));
                  return (
                    <div key={month.label}>
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/80">
                          {month.label}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-gold">
                          {month.count}
                        </span>
                      </div>
                      <div className="mt-1.5 h-[5px] w-full bg-bone/10">
                        <div
                          className="h-full"
                          style={{
                            width: `${width}%`,
                            background: "linear-gradient(90deg, #0e4429, #26a641, #39d353)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-line pt-4 sm:grid-cols-3">
                {[
                  { term: "Last 12 months", detail: gh.total.toLocaleString("en-US") },
                  {
                    term: "All-time",
                    detail: `${gh.total.toLocaleString("en-US")} since Nov 2025`,
                  },
                  { term: "Active days", detail: `${gh.activeDays}` },
                  { term: "Longest streak", detail: `${gh.longestStreak} days` },
                  { term: "Current streak", detail: `${gh.currentStreak} days` },
                  { term: "Busiest day", detail: `${gh.bestDay.count} · ${prettyDate(gh.bestDay.date)}` },
                  { term: "Busiest month", detail: `${bestMonth.count} · ${bestMonth.label}` },
                ].map((item) => (
                  <div key={item.term}>
                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-gold/80">
                      {item.term}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-snug text-bone">{item.detail}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <a
                  href={gh.profile}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={(event) => event.stopPropagation()}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/80 underline-offset-4 transition-colors hover:text-gold hover:underline"
                >
                  github.com/{gh.handle} ↗
                </a>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold/80">
                  Flip back ↺
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 border-r border-t border-gold/30"
          style={{ transform: "translateZ(60px)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 border-b border-l border-gold/20"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setFlipped((value) => !value)}
          className="border border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-gold hover:text-gold"
        >
          {flipped ? "Show the graph" : "Flip the card"}
        </button>
        <motion.span
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted"
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: reduced ? 0 : 3.5, repeat: Infinity }}
        >
          {isTouch ? "Drag or tap" : "Move across the card"}
        </motion.span>
      </div>

      <p className={cn("mt-4 max-w-sm text-center text-xs leading-relaxed text-muted")}>
        Squares, streaks and totals are read from my public GitHub calendar:{" "}
        {gh.total.toLocaleString("en-US")} contributions in the last twelve months, and{" "}
        {gh.total.toLocaleString("en-US")} all-time since my first commit in November 2025, the full
        history of this account.
      </p>
    </div>
  );
}
