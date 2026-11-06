/**
 * Development-only error reporter.
 *
 * A single thrown effect unmounts the whole React tree, which looks like a
 * blank page with no explanation. In dev we post the real stack to the Vite
 * server so the terminal shows precisely which component failed.
 */
export function reportClientError(payload: {
  source: string;
  message: string;
  stack?: string;
}) {
  if (!import.meta.env.DEV || typeof window === "undefined") return;
  try {
    void fetch("/__client-error", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* reporting must never throw */
  }
}
