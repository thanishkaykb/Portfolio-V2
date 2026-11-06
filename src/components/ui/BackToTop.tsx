import { scrollToTop } from "../../lib/hooks";

/** Always-visible shortcut back to the top of the page. */
export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="group fixed bottom-5 right-5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-line bg-ink/90 text-bone shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition-colors duration-300 hover:border-gold hover:text-gold md:bottom-7 md:right-7"
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
