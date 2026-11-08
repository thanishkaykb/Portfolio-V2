import { profile } from "../../lib/data";
import { openDoor } from "../../lib/doors";
import { scrollToSection, scrollToTop, useChennaiTime } from "../../lib/hooks";

const navigation = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "story", label: "Story" },
  { id: "honours", label: "Honours" },
];

export default function Footer() {
  const time = useChennaiTime();

  return (
    <footer id="footer" className="relative overflow-hidden border-t border-line bg-ink-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,201,40,0.25), transparent 65%)" }}
      />
      <div className="container-x relative py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow gold-dot">Thanishka Yogesh</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Computer Science and Engineering student, website developer and full-stack builder in
              Chennai. Currently open to internships, collaborations and interesting problems.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="link-underline mt-6 inline-block text-lg text-bone transition-colors hover:text-gold"
            >
              {profile.email}
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Navigate</h3>
            <ul className="mt-5 space-y-2.5">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === "projects") {
                        scrollToSection("skills");
                        openDoor("website-development");
                        return;
                      }
                      scrollToSection(item.id);
                    }}
                    className="text-sm text-bone/80 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">Elsewhere</h3>
            <ul className="mt-5 space-y-2.5">
              {[
                { label: "GitHub", href: profile.github },
                { label: "LinkedIn", href: profile.linkedin },
                { label: "Previous portfolio", href: profile.previousPortfolio },
                { label: profile.phone, href: `tel:${profile.phoneHref}` },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="inline-flex items-center gap-2 text-sm text-bone/80 transition-colors hover:text-gold"
                  >
                    {item.label}
                    <span aria-hidden className="text-[10px] text-gold/60">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Chennai {time} IST · 13.08°N 80.27°E
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-5 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            © {new Date().getFullYear()} Thanishka Yogesh · designed &amp; built in Chennai
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold/70">
              {profile.tagline}
            </span>
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 border border-gold font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold hover:text-ink"
            >
              Back to top
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              >
                ↑
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
