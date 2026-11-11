import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { emailComposeUrl, profile } from "../../lib/data";
import { openDoor } from "../../lib/doors";
import {
  cn,
  scrollToSection,
  scrollToTop,
  useActiveSection,
  useBodyLock,
  useChennaiTime,
} from "../../lib/hooks";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "honours", label: "Honours" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const ids = useMemo(() => links.map((link) => link.id), []);
  const active = useActiveSection(ids);
  const time = useChennaiTime();
  useBodyLock(menuOpen);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, y / height) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    // The work itself lives inside the Website Development door now.
    if (id === "projects") {
      window.setTimeout(() => {
        scrollToSection("skills");
        openDoor("website-development");
      }, 60);
      return;
    }
    window.setTimeout(() => scrollToSection(id), 60);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "border-b transition-all duration-500",
            scrolled
              ? "border-line/80 bg-ink/80 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[76px]">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2.5 text-left"
              aria-label="Thanishka Yogesh, back to top"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full border border-gold/50 text-[10px] font-semibold text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                TY
              </span>
              <span className="hidden flex-col leading-none sm:flex">
                <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-bone">
                  Thanishka
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-gold">
                  Yogesh
                </span>
              </span>
            </button>

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  aria-current={active === link.id ? "page" : undefined}
                  className={cn(
                    "relative px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300",
                    active === link.id ? "text-gold" : "text-muted hover:text-bone",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px bg-gold transition-transform duration-500",
                      active === link.id ? "scale-x-100" : "scale-x-0",
                    )}
                    style={{ transformOrigin: "left" }}
                  />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3 md:gap-4">
              <span className="hidden items-center gap-2 xl:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-gold/80" aria-hidden />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Chennai {time}
                </span>
              </span>

              {/* The résumé is a file, not a panel: the click downloads the PDF. */}
              <a
                href={profile.resumePath}
                download="Thanishka-Yogesh-Resume.pdf"
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border border-gold bg-gold px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-gold/85 sm:px-3.5 sm:text-[10px]"
              >
                Resume <span aria-hidden>↓</span>
              </a>

              <button
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] border border-line transition-colors hover:border-gold lg:hidden"
              >
                <span
                  className={cn(
                    "h-px w-4 bg-bone transition-transform duration-300",
                    menuOpen && "translate-y-[3px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "h-px w-4 bg-bone transition-transform duration-300",
                    menuOpen && "-translate-y-[3px] -rotate-45",
                  )}
                />
              </button>
            </div>
          </div>

          {/* scroll progress */}
          <div className="h-px w-full bg-transparent">
            <div
              className="h-px bg-gold/80 transition-[width] duration-150 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/97 pb-8 pt-20 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-x flex-1 overflow-y-auto pt-6">
              <nav aria-label="Mobile" className="flex flex-col">
                {links.map((link, index) => (
                  <button
                    key={link.id}
                    onClick={() => go(link.id)}
                    className="group flex items-baseline justify-between border-b border-line/70 py-4 text-left"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] text-gold/70">
                        0{index + 1}
                      </span>
                      <span
                        className={cn(
                          "display text-[2rem] leading-none transition-colors",
                          active === link.id ? "text-gold" : "text-bone",
                        )}
                      >
                        {link.label}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-xs text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-gold"
                    >
                      ↗
                    </span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={emailComposeUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone"
                >
                  Email
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone"
                >
                  GitHub
                </a>
              </div>

              <div className="mt-8 space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {profile.location}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Local time {time} IST
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
