import { profile } from "../../lib/data";
import { openContactDialog } from "../../lib/contactDialog";
import { scrollToSection } from "../../lib/hooks";

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="h-[17px] w-[17px]" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.014 8.014 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[17px] w-[17px]" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
  );
}

function MailMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

const elsewhere = [
  { label: "GitHub", href: profile.github, icon: <GitHubMark /> },
  { label: "LinkedIn", href: profile.linkedin, icon: <LinkedInMark /> },
];

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[30rem] w-[30rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,201,40,0.18), transparent 65%)" }}
      />
      <div className="container-x relative">
        <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-bone/80">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          Available for new work
        </p>

        <h2 className="display mt-6 max-w-4xl text-[clamp(2.5rem,6.4vw,5rem)] normal-case leading-[1.02] text-bone">
          Need something built?
          <br />
          <span className="text-gold">Let&apos;s make it happen.</span>
        </h2>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          I&apos;m available for freelance work: websites, apps, interfaces and visual content. Tell
          me what you need and I&apos;ll get back to you within a day.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {elsewhere.map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="inline-flex items-center gap-2.5 border border-line px-4 py-3.5 text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-gold hover:text-gold"
            >
              {item.icon}
              {item.label}
            </a>
          ))}
          <button
            onClick={openContactDialog}
            className="inline-flex items-center gap-2.5 border border-line px-4 py-3.5 text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-gold hover:text-gold"
          >
            <MailMark />
            Email
          </button>
          <button
            onClick={() => scrollToSection("skills")}
            className="group inline-flex items-center gap-2.5 bg-gold px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            See my work
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
