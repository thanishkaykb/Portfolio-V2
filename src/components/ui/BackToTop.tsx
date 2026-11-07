import { useEffect, useState } from "react";
import { scrollToTop } from "../../lib/hooks";
import { cn } from "../../lib/hooks";

/** A shortcut that appears once the page is moving, then leaves at the top. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "group fixed bottom-5 right-5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-line bg-ink/90 text-bone shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-300 hover:border-gold hover:text-gold md:bottom-7 md:right-7",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
