import { useCallback, useEffect, useRef } from "react";

/**
 * Detail views on this site are overlays, not routes: a door sheet, a case
 * study and the contact card all open from React state.
 * That meant the browser Back button walked out of the portfolio instead of
 * closing the sheet the visitor was reading.
 *
 * This module keeps one stack of open overlays and one history entry per
 * opened overlay, so Back and Forward behave the way they do on a routed site:
 *
 *   open   -> pushState({ __pfOverlay, __pfDepth })
 *   Back   -> popstate: close overlays until the UI matches the entry landed on
 *   Forward-> popstate: the entry says what was open, so ask for it back
 *   Close  -> remove our marker with history.back() so history stays in step
 *
 * The stack is module level on purpose: overlays nest (a case study on top of a
 * door sheet, the contact card on top of either) and the popstate listener must
 * exist once, not once per overlay.
 */

export type OverlayRef =
  | { kind: "door"; id: string }
  | { kind: "case-study"; slug: string }
  | { kind: "contact" }
  | { kind: "writing-clipping"; id: string }
  | { kind: "writing-poem"; id: string };

type HistoryState = { __pfOverlay?: OverlayRef; __pfDepth?: number } | null;

type Entry = { ref: OverlayRef; dismiss: () => void };

const REOPEN_EVENT = "portfolio:overlay-reopen";
/** How long a Forward request waits for its overlay to remount. */
const RESTORE_TTL = 4000;

const stack: Entry[] = [];
let pendingRestores: Array<{ ref: OverlayRef; at: number }> = [];
let installed = false;

function keyOf(ref: OverlayRef): string {
  switch (ref.kind) {
    case "door":
      return `door:${ref.id}`;
    case "case-study":
      return `case-study:${ref.slug}`;
    default:
      return ref.kind;
  }
}

function sameRef(a: OverlayRef | null | undefined, b: OverlayRef | null | undefined): boolean {
  return Boolean(a && b && keyOf(a) === keyOf(b));
}

function currentState(): HistoryState {
  return (history.state ?? null) as HistoryState;
}

function clearMarker() {
  history.replaceState(
    { ...((history.state as Record<string, unknown> | null) ?? {}), __pfOverlay: undefined, __pfDepth: undefined },
    "",
  );
}

function onPopState(event: PopStateEvent) {
  const state = event.state as HistoryState;
  const depth = typeof state?.__pfDepth === "number" ? state.__pfDepth : 0;

  // Back (or a swipe): the browser has already moved, so close overlays until
  // the UI matches the entry we landed on. Each dismiss is the same function
  // the Close button uses, so scroll restoration runs too.
  while (stack.length > depth) {
    stack.pop()?.dismiss();
  }

  // Forward: the entry remembers what was open. Ask the owning component to
  // bring it back; it re-registers without pushing a second entry.
  if (depth > stack.length && state?.__pfOverlay) {
    const ref = state.__pfOverlay;
    if (!pendingRestores.some((item) => sameRef(item.ref, ref))) {
      pendingRestores.push({ ref, at: Date.now() });
    }
    window.dispatchEvent(new CustomEvent<OverlayRef>(REOPEN_EVENT, { detail: ref }));
  }
}

function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("popstate", onPopState);
}

function takePendingRestore(ref: OverlayRef): boolean {
  const now = Date.now();
  pendingRestores = pendingRestores.filter((item) => now - item.at < RESTORE_TTL);
  const index = pendingRestores.findIndex((item) => sameRef(item.ref, ref));
  if (index < 0) return false;
  pendingRestores.splice(index, 1);
  return true;
}

/**
 * Gives an overlay a history entry of its own. Returns `dismiss`, which must be
 * used by every close path (Close button, Escape, backdrop) so history is
 * popped exactly once.
 */
export function useOverlayHistory(
  open: boolean,
  ref: OverlayRef | null,
  onDismiss: () => void,
): { dismiss: () => void } {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  const entryRef = useRef<Entry | null>(null);
  const refKey = ref ? keyOf(ref) : null;

  // Keyed on `open` only: switching project inside an open case study changes
  // the payload, not the depth, so it must not push a second entry.
  const refValue = useRef(ref);
  refValue.current = ref;

  useEffect(() => {
    const current = refValue.current;
    if (!open || !current) return;
    install();

    const entry: Entry = { ref: current, dismiss: () => dismissRef.current() };
    entryRef.current = entry;
    stack.push(entry);

    // Every path below has to release the stack entry, including the two that
    // return early; missing that is what leaves a stale entry behind.
    const release = () => {
      const index = stack.lastIndexOf(entry);
      if (index >= 0) stack.splice(index, 1);
      if (entryRef.current === entry) entryRef.current = null;
    };

    // Reopened by Forward: that history entry already exists, do not add one.
    if (takePendingRestore(current)) return release;

    // A marker left behind by a reload would make the depths lie. Only strip it
    // when this overlay is the innermost one.
    const before = currentState();
    if (stack.length === 1 && before?.__pfOverlay && !sameRef(before.__pfOverlay, current)) {
      clearMarker();
    }

    // StrictMode runs this effect twice; the first pass already pushed.
    const latest = currentState();
    if (!(latest?.__pfDepth === stack.length && sameRef(latest.__pfOverlay, current))) {
      history.pushState({ __pfOverlay: current, __pfDepth: stack.length }, "");
    }

    return release;
  }, [open]);

  // Moving between projects with next/previous swaps the payload of the same
  // entry instead of stacking a new one, so one Back still closes the overlay.
  useEffect(() => {
    const entry = entryRef.current;
    if (!open || !ref || !entry) return;
    entry.ref = ref;
    const state = currentState();
    if (sameRef(state?.__pfOverlay, ref)) return;
    if (stack[stack.length - 1] !== entry) return;
    if (state?.__pfDepth !== stack.length) return;
    history.replaceState({ __pfOverlay: ref, __pfDepth: stack.length }, "");
  }, [open, refKey]);

  useEffect(() => {
    install();
  }, []);

  const dismiss = useCallback(() => {
    const entry = entryRef.current;
    if (entry) {
      const index = stack.lastIndexOf(entry);
      if (index >= 0) stack.splice(index, 1);
      const state = currentState();
      // Pop our marker so the page entry becomes current again: Back then has
      // nothing stale to unwind, and a later Forward walks the same history the
      // visitor already made.
      if (index >= 0 && state?.__pfDepth === index + 1 && sameRef(state.__pfOverlay, entry.ref)) {
        history.back();
      }
      entryRef.current = null;
    }
    dismissRef.current();
  }, []);

  return { dismiss };
}

/** True when this overlay is the newest one, so it owns Escape and clicks. */
export function isTopOverlay(ref: OverlayRef | null): boolean {
  if (!ref) return false;
  const top = stack[stack.length - 1];
  return Boolean(top && sameRef(top.ref, ref));
}

/**
 * Called by whoever can reopen an overlay, so the Forward button works. The
 * handler also receives a request that arrived while its component was
 * unmounted (mounting and back/forward can race by a few frames).
 */
export function useOverlayReopen(handler: (ref: OverlayRef) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    install();
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<OverlayRef>).detail;
      if (detail) handlerRef.current(detail);
    };
    window.addEventListener(REOPEN_EVENT, listener);

    for (const item of pendingRestores) handlerRef.current(item.ref);

    return () => window.removeEventListener(REOPEN_EVENT, listener);
  }, []);
}
