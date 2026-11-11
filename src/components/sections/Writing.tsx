import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  anthologies,
  artAccount,
  drivePoems,
  poems,
  poetryProfile,
  pressClippings,
} from "../../lib/data";
import SectionHeading from "../ui/SectionHeading";
import { cn, useBodyLock } from "../../lib/hooks";
import { closeIconButtonClass } from "../../lib/closeButton";
import { poemTexts } from "../../lib/poemTexts";
import {
  isTopOverlay,
  useOverlayHistory,
  useOverlayReopen,
} from "../../lib/overlayHistory";

const facts = [
  { value: "02", label: "Anthologies in print" },
  { value: "42", label: "Poems in the collection" },
  { value: "06", label: "Times of India features" },
];

/** Horizontal clippings rail with visible arrows so nobody misses the rest. */
function PressStrip({
  onClippingOpen,
}: {
  onClippingOpen: (src: string, title: string, meta: string) => void;
}) {
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

  // One arrow, two placements: over the strip on wider screens, and small in the
  // caption row on phones so it never sits on top of a clipping.
  const arrow = (direction: 1 | -1, className: string) => {
    const atEdge = direction === -1 ? edges.start : edges.end;
    return (
      <button
        type="button"
        onClick={() => nudge(direction)}
        aria-label={
          direction === -1 ? "Previous newspaper clippings" : "Next newspaper clippings"
        }
        className={cn(
          "z-10 grid shrink-0 place-items-center rounded-full border border-gold/40 bg-ink/90 text-gold backdrop-blur transition-opacity duration-300",
          className,
          atEdge ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        {direction === -1 ? "←" : "→"}
      </button>
    );
  };

  return (
    <div className="relative mt-5">
      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {pressClippings.map((clipping) => (
          <button
            key={clipping.src}
            type="button"
            onClick={() => onClippingOpen(clipping.src, clipping.title, clipping.meta)}
            className="group w-[70%] max-w-[240px] shrink-0 snap-start border border-line bg-ink-2 transition-colors hover:border-gold/60 sm:w-[42%] md:w-[30%]"
          >
            <div className="overflow-hidden border-b border-line bg-ink/60">
              <img
                src={clipping.src}
                alt={`${clipping.title}, printed in The Times of India`}
                loading="lazy"
                className="aspect-[1080/1876] w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
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
          </button>
        ))}
      </div>

      {/* Both fades reach the strip's own edge (it is full-bleed on phones), so
          they read as the page darkening rather than a panel laid on top. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 -left-4 w-14 bg-gradient-to-r from-ink to-transparent transition-opacity duration-300 sm:left-0",
          edges.start && "opacity-0",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 -right-4 w-14 bg-gradient-to-l from-ink to-transparent transition-opacity duration-300 sm:right-0",
          edges.end && "opacity-0",
        )}
      />

      {arrow(-1, "absolute left-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 text-sm sm:grid")}
      {arrow(1, "absolute right-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 text-sm sm:grid")}

      <div className="mt-2 flex items-center justify-between gap-3">
        {arrow(-1, "h-7 w-7 text-[11px] sm:hidden")}
        <p className="min-w-0 flex-1 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-gold/80 sm:text-left">
          {edges.end ? "End of the six pages" : "Swipe or scroll for more pages →"}
        </p>
        {arrow(1, "h-7 w-7 text-[11px] sm:hidden")}
      </div>
    </div>
  );
}

/** A single newspaper clipping opened in place, not a new page. */
function PressClippingDialog({
  src,
  title,
  meta,
  onDismiss,
}: {
  src: string;
  title: string;
  meta: string;
  onDismiss: () => void;
}) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        key="clipping-dialog"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onDismiss}
        data-lenis-prevent
        className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink/88 p-4 backdrop-blur-xl"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clipping-title"
          initial={{ y: 20, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(event) => event.stopPropagation()}
          className="relative w-full max-w-xs border border-gold/30 bg-ink-2 p-4 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.6)] max-h-[85vh] overflow-y-auto overscroll-contain scroll-smooth [touch-action:pan-y]"
        >
          <button
            onClick={onDismiss}
            aria-label="Close newspaper clipping"
            className={closeIconButtonClass}
          >
            ✕
          </button>

          <div className="rounded-lg border border-line bg-ink/60">
            <img
              src={src}
              alt={`${title}, printed in The Times of India`}
              className={cn(
                "w-full h-auto border border-line",
                title === "Canvas & Verses."
                  ? "max-w-[240px] sm:max-w-[260px]"
                  : title === "The Final Bell Rings."
                  ? "max-w-[240px] sm:max-w-[260px]"
                  : "",
              )}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p
              id="clipping-title"
              className="text-xl font-semibold leading-tight text-bone sm:text-2xl"
            >
              {title}
              <span className="text-gold ml-1" aria-hidden="true">.</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {meta}
            </p>
          </div>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-gold">
            Printed in the school pages of The Times of India
            <span aria-hidden="true">.</span>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

/** One poem from the collection opened in place.
 * If the full text is already in the site, show it here; otherwise embed the
 * Google Drive PDF inside this card so the reader never leaves the page.
 */
function PoemDialog({
  number,
  title,
  href,
  text,
  direction,
  onDismiss,
  drivePoems,
  setPoemOpen,
  setDirection,
}: {
  number: number;
  title: string;
  href: string;
  text?: string;
  direction: number;
  onDismiss: () => void;
  drivePoems: { n: number; title: string; href: string }[];
  setPoemOpen: (n: number | null) => void;
  setDirection: (d: number) => void;
}) {
  const fileId = href.match(/\/d\/([A-Za-z0-9_-]+)/)?.[1];
  const embedHref = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : href;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prev = drivePoems.find((p) => p.n === number - 1);
  const next = drivePoems.find((p) => p.n === number + 1);
  const shift = direction < 0 ? -18 : 18;

  // A new poem opens at the top of the card, never where the last one was left.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [number]);

  const go = (target: number) => {
    setDirection(target < number ? -1 : 1);
    setPoemOpen(target);
  };

  // The card, backdrop and arrows stay mounted while only the poem swaps, so
  // stepping through the collection is one quick slide instead of a remount.
  return createPortal(
    <motion.div
      key="poem-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onDismiss}
      data-lenis-prevent
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink/88 p-4 backdrop-blur-xl"
    >
      <motion.div
        ref={scrollRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="poem-title"
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-xs border border-gold/30 bg-ink-2 p-5 sm:max-w-md sm:p-7 md:max-w-xl lg:max-w-2xl xl:max-w-3xl shadow-[0_30px_90px_rgba(0,0,0,0.6)] max-h-[85vh] overflow-y-auto overscroll-contain [touch-action:pan-y]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-baseline overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={number}
                initial={{ opacity: 0, x: shift }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -shift }}
                transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-w-0 flex-wrap items-baseline gap-x-3"
              >
                <span className="font-mono text-[10px] tracking-[0.18em] text-muted/70">
                  {String(number).padStart(2, "0")}
                </span>
                <p
                  id="poem-title"
                  className="text-xl font-semibold leading-tight text-bone sm:text-2xl"
                >
                  {title}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => prev && go(prev.n)}
              disabled={!prev}
              aria-label="Previous poem"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink/90 text-gold transition-colors hover:bg-gold hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => next && go(next.n)}
              disabled={!next}
              aria-label="Next poem"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink/90 text-gold transition-colors hover:bg-gold hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close poem"
              className={closeIconButtonClass}
            >
              ✕
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={number}
            initial={{ opacity: 0, x: shift }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -shift }}
            transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5"
          >
            {text ? (
              <pre
                className="whitespace-pre-wrap text-[15px] leading-[1.9] text-bone/90"
                aria-label={`${title} poem text`}
              >
                {text}
              </pre>
            ) : (
              <div>
                <iframe
                  src={embedHref}
                  title={`Poem ${number}: ${title} on Google Drive`}
                  className="w-full rounded border border-line"
                  style={{ height: "80vh", border: "0" }}
                  loading="lazy"
                />
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-3 inline-flex items-center gap-2 border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-bone transition-colors hover:border-gold hover:text-gold"
                >
                  Open on Google Drive ↗
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/** The writing and art half of the Creative Development door. */
export function PoetryShowcase() {
  const [clippingOpen, setClippingOpen] = useState<string | null>(null);
  const [poemOpen, setPoemOpen] = useState<number | null>(null);
  const [poemDir, setPoemDir] = useState(0);

  useBodyLock(clippingOpen != null || poemOpen != null);

  const { dismiss: dismissClipping } = useOverlayHistory(
    clippingOpen != null,
    clippingOpen ? { kind: "writing-clipping", id: clippingOpen } : null,
    () => setClippingOpen(null),
  );
  const { dismiss: dismissPoem } = useOverlayHistory(
    poemOpen != null,
    poemOpen ? { kind: "writing-poem", id: String(poemOpen) } : null,
    () => setPoemOpen(null),
  );

  // Forward navigation can bring either card back.
  useOverlayReopen((ref) => {
    if (ref.kind === "writing-clipping" && ref.id) setClippingOpen(ref.id);
    if (ref.kind === "writing-poem") {
      setPoemDir(0);
      setPoemOpen(Number(ref.id));
    }
  });

  useEffect(() => {
    if (!clippingOpen && !poemOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (clippingOpen && isTopOverlay({ kind: "writing-clipping", id: clippingOpen })) {
        dismissClipping();
        return;
      }
      if (poemOpen != null && isTopOverlay({ kind: "writing-poem", id: String(poemOpen) })) {
        dismissPoem();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clippingOpen, poemOpen, dismissClipping, dismissPoem]);

  return (
    <div>
      <SectionHeading
        label="In print"
        title={
          <>
            Words, before
            <br />
            <span className="text-gold">the browser</span><span aria-hidden="true">.</span>
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
            In the <span className="text-gold">newspaper</span><span aria-hidden="true">.</span>
          </h3>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            Six pages · local archive
          </p>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          The Times of India printed my poems in its school pages six times, under Artistry Corner,
          Express Your Thoughts and Canvas &amp; Verses. Tap a page to read the clipping.
        </p>

        <PressStrip
          onClippingOpen={(src, title, meta) => setClippingOpen(`${src}?${title}?${meta}`)}
        />
      </div>

      {/* the poems themselves, readable in place */}
      <div className="mt-12 border-t border-line pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="display text-2xl text-bone">
            Verses &amp; <span className="text-gold">Voices</span><span aria-hidden="true">.</span>
          </h3>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
            Published on PoetrySoup · tap to read
          </p>
        </div>

        <ul className="mt-4">
          {poems.map((poem) => (
            <li key={poem.title} className="border-b border-line">
              <a
                href={poem.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:text-gold"
              >
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[15px] text-bone transition-colors group-hover:text-gold md:text-base">
                    {poem.title}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                    {poem.form} · {poem.date}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-[11px] text-muted transition-colors group-hover:text-gold"
                >
                  PoetrySoup ↗
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
              The full collection
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
              42 poems · tap to read
            </p>
          </div>
          <ol className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {drivePoems.map((poem) => (
              <li key={poem.n} className="border-t border-line/70">
                <button
                  type="button"
                  onClick={() => {
                    setPoemDir(0);
                    setPoemOpen(poem.n);
                  }}
                  className="group flex w-full items-baseline gap-3 py-2 transition-colors hover:text-gold"
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
                    ▶
                  </span>
                </button>
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
            Drawings and <span className="text-gold">colour</span><span aria-hidden="true">.</span>
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

      {/* newspaper clipping in a dialog */}
      <AnimatePresence>
        {clippingOpen && (
          <PressClippingDialog
            key={clippingOpen}
            src={clippingOpen.split("?")[0]}
            title={clippingOpen.split("?")[1] ?? ""}
            meta={clippingOpen.split("?")[2] ?? ""}
            onDismiss={dismissClipping}
          />
        )}
      </AnimatePresence>

      {/* poem from the collection, in place */}
      <AnimatePresence>
        {poemOpen != null && (
          <PoemDialog
            number={poemOpen}
            title={drivePoems.find((p) => p.n === poemOpen)?.title ?? ""}
            href={drivePoems.find((p) => p.n === poemOpen)?.href ?? ""}
            text={
              poemTexts[poemOpen] ??
              poems.find((p) =>
                drivePoems.some((dp) => dp.n === poemOpen && dp.title === p.title),
              )?.text
            }
            onDismiss={dismissPoem}
            drivePoems={drivePoems}
            direction={poemDir}
            setDirection={setPoemDir}
            setPoemOpen={setPoemOpen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PoetryShowcase;
