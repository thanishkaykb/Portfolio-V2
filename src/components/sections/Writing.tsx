import { useEffect, useRef, useState } from "react";
import {
  anthologies,
  artAccount,
  drivePoems,
  poems,
  poetryProfile,
  pressClippings,
} from "../../lib/data";
import SectionHeading from "../ui/SectionHeading";
import { cn } from "../../lib/hooks";

const facts = [
  { value: "02", label: "Anthologies in print" },
  { value: "42", label: "Poems in the collection" },
  { value: "06", label: "Times of India features" },
];

/** Horizontal clippings rail with visible arrows so nobody misses the rest. */
function PressStrip() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 24,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(240, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative mt-5">
      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {pressClippings.map((clipping) => (
          <a
            key={clipping.src}
            href={clipping.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group w-[70%] max-w-[240px] shrink-0 snap-start border border-line bg-ink-2 transition-colors hover:border-gold/60 sm:w-[42%] md:w-[30%]"
          >
            <div className="overflow-hidden border-b border-line">
              <img
                src={clipping.src}
                alt={`${clipping.title}, printed in The Times of India`}
                loading="lazy"
                className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-3">
              <p className="text-sm text-bone transition-colors group-hover:text-gold">
                {clipping.title}
              </p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
                {clipping.meta}
              </p>
            </div>
          </a>
        ))}
      </div>

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-ink to-transparent transition-opacity duration-300",
          edges.end && "opacity-0",
        )}
      />

      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Previous newspaper clippings"
        className={cn(
          "absolute left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/90 text-gold backdrop-blur transition-opacity duration-300",
          edges.start ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        ←
      </button>

      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Next newspaper clippings"
        className={cn(
          "absolute right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/90 text-gold backdrop-blur transition-opacity duration-300",
          edges.end ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        →
      </button>

      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-gold/80">
        {edges.end ? "End of the six pages" : "Swipe or scroll for more pages →"}
      </p>
    </div>
  );
}

/** The writing and art half of the Creative Development door. */
export function PoetryShowcase() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <SectionHeading
        label="In print"
        title={
          <>
            Words, before
            <br />
            <span className="text-gold">the browser.</span>
          </>
        }
        sub="I am a published anthology poet: two collections with Writer's Pocket, a 42 poem collection of my own, and six poems printed in The Times of India."
      />

      <dl className="mt-10 grid grid-cols-3 border-y border-line">
        {facts.map((fact) => (
          <div key={fact.label} className="border-r border-line px-3 py-4 last:border-r-0 sm:px-4">
            <dt className="display text-[clamp(1.6rem,4vw,2.4rem)] text-gold">{fact.value}</dt>
            <dd className="mt-1 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted">
              {fact.label}
            </dd>
          </div>
        ))}
      </dl>

      {/* anthologies, with the real cover wraps from the cover-page folder */}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {anthologies.map((book) => (
          <article
            key={book.title}
            className="flex items-stretch gap-4 border border-line bg-ink-2 p-4 md:gap-5 md:p-5"
          >
            <a
              href={book.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group block w-[104px] shrink-0 self-start overflow-hidden border border-line sm:w-[124px] md:w-[140px]"
            >
              <img
                src={book.cover}
                alt={`Front cover of ${book.title}, published by ${book.publisher}`}
                loading="lazy"
                style={{ objectPosition: "right center" }}
                className="aspect-[620/996] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </a>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold/80">
                Anthology · {book.publisher}
              </p>
              <h3 className="mt-1.5 text-base leading-tight text-bone md:text-lg">{book.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{book.note}</p>
              <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-muted/80">
                ISBN {book.isbn}
              </p>
              <a
                href={book.href}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex w-fit items-center gap-2 whitespace-nowrap border border-line px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-gold hover:text-gold"
              >
                Buy on Amazon ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={poetryProfile}
          target="_blank"
          rel="noreferrer noopener"
          className="border border-line px-3 py-1.5 text-[11px] text-bone transition-colors hover:border-gold hover:text-gold"
        >
          PoetrySoup profile ↗
        </a>
      </div>

      {/* the newspaper pages themselves */}
      <div className="mt-12 border-t border-line pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="display text-2xl text-bone">
            In the newspaper<span className="text-gold">.</span>
          </h3>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            Six pages · local archive
          </p>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          The Times of India printed my poems in its school pages six times, under Dare to Dream and
          Express Y. Tap a page to read the clipping.
        </p>

        <PressStrip />
      </div>

      {/* the poems themselves, readable in place */}
      <div className="mt-12 border-t border-line pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="display text-2xl text-bone">Poems</h3>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
            Published on PoetrySoup · tap to read
          </p>
        </div>

        <ul className="mt-4">
          {poems.map((poem) => {
            const isOpen = open === poem.title;
            return (
              <li key={poem.title} className="border-b border-line">
                <button
                  onClick={() => setOpen(isOpen ? null : poem.title)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:text-gold"
                >
                  <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className={cn(
                        "text-[15px] md:text-base",
                        isOpen ? "text-gold" : "text-bone",
                      )}
                    >
                      {poem.title}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                      {poem.form} · {poem.date}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-sm text-muted transition-transform",
                      isOpen && "rotate-45 text-gold",
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-5">
                    <p className="whitespace-pre-line text-[15px] leading-[1.85] text-bone/85 md:text-base">
                      {poem.text}
                    </p>
                    <a
                      href={poem.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex items-center gap-2 border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-gold hover:text-gold"
                    >
                      Read on PoetrySoup ↗
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
              The full collection
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
              42 poems · one PDF each
            </p>
          </div>
          <ol className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {drivePoems.map((poem) => (
              <li key={poem.n} className="border-t border-line/70">
                <a
                  href={poem.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-baseline gap-3 py-2 transition-colors hover:text-gold"
                >
                  <span className="w-6 shrink-0 font-mono text-[9px] tracking-[0.12em] text-muted/70">
                    {String(poem.n).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-[13px] leading-snug text-bone/90 group-hover:text-gold">
                    {poem.title}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 font-mono text-[10px] text-muted/60 group-hover:text-gold"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* art gateway, the account itself is the gallery */}
      <div className="mt-10 border border-line bg-ink-2 p-6 md:p-7">
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-gold">Art</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="display text-[clamp(1.5rem,3.6vw,2rem)] leading-none text-bone">
            Drawings and colour.
          </p>
          <a
            href={artAccount.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-gold hover:text-gold"
          >
            See the artwork ↗
          </a>
        </div>

        <div className="mt-5">
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Sketches, paintings and colour studies go up as{" "}
            <span className="text-bone">{artAccount.handle}</span>.
          </p>

          <a
            href={artAccount.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`Open ${artAccount.handle} on Instagram`}
            className="group mx-auto mt-6 block w-full max-w-[420px] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="block bg-bone p-1.5 shadow-[0_18px_44px_rgba(0,0,0,0.45)]">
              <img
                src="/images/instagram-preview.webp"
                alt={`Preview of ${artAccount.handle} on Instagram`}
                width={900}
                height={483}
                loading="lazy"
                className="block w-full"
              />
            </span>
            <span className="mt-2 flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.16em]">
              <span className="text-bone/80">{artAccount.handle}</span>
              <span className="text-gold">Instagram ↗</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default PoetryShowcase;
