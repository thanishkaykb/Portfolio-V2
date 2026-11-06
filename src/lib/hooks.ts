import { useEffect, useMemo, useRef, useState } from "react";
import type Lenis from "lenis";

/* ------------------------------------------------------------------ */
/*  Small shared utilities                                            */
/* ------------------------------------------------------------------ */

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/*  Smooth scrolling                                                  */
/* ------------------------------------------------------------------ */

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const offset = window.innerWidth < 768 ? -64 : -76;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: 1.25,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function scrollToTop() {
  if (lenisInstance)
    lenisInstance.scrollTo(0, { duration: 1.25, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ------------------------------------------------------------------ */
/*  Media queries / capability detection                              */
/* ------------------------------------------------------------------ */

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

export function useWebGLSupport(): boolean {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") || canvas.getContext("webgl")),
      );
    } catch {
      return false;
    }
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Element visibility (used to pause WebGL loops off-screen)         */
/* ------------------------------------------------------------------ */

export function useInViewOnce<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

export function useIsVisible<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting);
      },
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  Active navigation section                                         */
/* ------------------------------------------------------------------ */

export function useActiveSection(ids: string[], offset = 0.35): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * offset;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}

/* ------------------------------------------------------------------ */
/*  Body scroll lock for overlays                                     */
/* ------------------------------------------------------------------ */

/** Overlays can stack (a case study inside a door), so count the locks. */
let bodyLockCount = 0;
let bodyOverflowBeforeLock = "";

export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    if (bodyLockCount === 0) bodyOverflowBeforeLock = document.body.style.overflow;
    bodyLockCount += 1;
    document.body.style.overflow = "hidden";
    lenisInstance?.stop();
    return () => {
      bodyLockCount = Math.max(0, bodyLockCount - 1);
      if (bodyLockCount === 0) {
        document.body.style.overflow = bodyOverflowBeforeLock;
        lenisInstance?.start();
      }
    };
  }, [locked]);
}

/* ------------------------------------------------------------------ */
/*  Pointer position normalised to [-1, 1]                            */
/* ------------------------------------------------------------------ */

export function usePointer(enabled = true) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  return pointer;
}

/* ------------------------------------------------------------------ */
/*  Local time in Chennai                                             */
/* ------------------------------------------------------------------ */

export function useChennaiTime(): string {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
        hour12: true,
      })
        .format(new Date())
        .toLowerCase();
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export function useFileNameExists(url: string): boolean | null {
  const [exists, setExists] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then((response) => {
        if (!cancelled) {
          const type = response.headers.get("content-type") ?? "";
          setExists(response.ok && !type.includes("text/html"));
        }
      })
      .catch(() => {
        if (!cancelled) setExists(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return exists;
}
