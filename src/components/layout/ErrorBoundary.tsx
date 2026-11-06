import { Component, type ErrorInfo, type ReactNode } from "react";
import { profile } from "../../lib/data";
import { reportClientError } from "../../lib/reportClientError";

type Props = {
  children: ReactNode;
  /** What failed, used for the console message. */
  label?: string;
  /** Rendered instead of the children. Defaults to a readable card. */
  fallback?: ReactNode;
};

type State = { failed: boolean };

/**
 * React unmounts the whole tree when a render or effect throws, which turns a
 * single bad section into a blank page. This boundary contains that failure so
 * the rest of the portfolio keeps working, and never ships a black screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[portfolio] ${this.props.label ?? "section"} failed to render`, error, info);
    reportClientError({
      source: `ErrorBoundary:${this.props.label ?? "section"}`,
      message: error.message,
      stack: error.stack,
    });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <div className="container-x py-16 md:py-24">
        <span className="eyebrow gold-dot">Something did not load</span>
        <h2 className="mt-4 text-2xl font-medium tracking-tight text-bone md:text-3xl">
          This part of the page could not render.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Your browser may have blocked a 3D or animation feature. Everything else on the page still
          works, and you can reach me directly below.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink"
          >
            Email me ↗
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="border border-line px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-gold hover:text-gold"
          >
            GitHub ↗
          </a>
          <button
            onClick={() => window.location.reload()}
            className="border border-line px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:border-gold hover:text-gold"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
