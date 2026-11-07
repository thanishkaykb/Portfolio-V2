import { motion } from "framer-motion";
import { events, leadershipRoles, profile } from "../../lib/data";
import { openContactDialog } from "../../lib/contactDialog";
import { useReducedMotion } from "../../lib/hooks";
import SectionHeading from "../ui/SectionHeading";

/**
 * The Leadership and Events door.
 *
 * Text only: one entry per event, separated by hairlines, with the date, the
 * role, what the event was and what was handled. Nothing is shown twice — the
 * event name appears once, and there is no artwork plate repeating it above the
 * text. The layout is a single column on phones, a stacked block with a wrapping
 * meta row on tablets, and a three/nine split on laptops.
 *
 * Where a LinkedIn post URL exists on an event it renders as a link on that
 * entry; nothing here invents a link.
 */
export function EventsShowcase() {
  const reduced = useReducedMotion();

  return (
    <div>
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading
          label="Leadership and events"
          title={
            <>
              Rooms I help
              <br />
              <span className="text-gold">run.</span>
            </>
          }
        />
        <div className="max-w-xs">
          <p className="text-sm leading-relaxed text-muted">
            {events.length} events conducted, organised or judged across IEEE TEMS, the IEEE
            Reliability Society and Computer Society chapters, IEEE SIGHT, GUVI's national
            buildathon and the Hypedin TN community.
          </p>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:text-bone"
          >
            Posts on LinkedIn ↗
          </a>
        </div>
      </div>

      <div className="mt-10 space-y-4 md:mt-14 md:space-y-5">
        {events.map((event, index) => (
          <motion.article
            key={event.slug}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: Math.min(index * 0.04, 0.2),
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative overflow-hidden border border-line bg-ink-2/50 px-5 py-6 transition-colors duration-300 hover:border-gold/45 md:px-7 md:py-8"
          >
            {/* gold seam down the left edge, so each event reads as its own record */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b from-gold/70 via-gold/25 to-transparent"
            />
            <div className="grid gap-4 md:gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="flex flex-wrap items-center gap-3 lg:col-span-3 lg:block">
                <span className="grid h-8 w-8 shrink-0 place-items-center border border-gold/40 bg-gold/[0.06] font-mono text-[10px] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-6 bg-line lg:hidden" aria-hidden />
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted lg:mt-3">
                  {event.date}
                </p>
                <span className="border border-gold/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gold lg:mt-3 lg:inline-block">
                  {event.role}
                </span>
              </div>

              <div className="lg:col-span-9">
                <h3 className="display text-[clamp(1.45rem,3.6vw,2.4rem)] leading-[1.04] text-gold [overflow-wrap:anywhere]">
                  {event.name}
                </h3>

                <p className="mt-2 break-words font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted">
                  {event.venue}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-muted/60">
                  {event.format}
                </p>

                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-bone/80 md:text-base">
                  {event.summary}
                </p>

                {event.handled.length > 0 && (
                  <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {event.handled.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 border-t border-line/70 pt-2 text-sm text-muted"
                      >
                        <span aria-hidden className="mt-1 text-[9px] text-gold">
                          ✦
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {(event.links?.length || event.post) && (
                  <div className="mt-5 flex flex-wrap items-center gap-4">
                    {event.links?.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group/link inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold"
                      >
                        <span className="border-b border-bone/30 pb-1 transition-colors group-hover/link:border-gold">
                          {link.label}
                        </span>
                        <span aria-hidden className="text-gold">
                          ↗
                        </span>
                      </a>
                    ))}
                    {event.post && (
                      <a
                        href={event.post}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group/link inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold"
                      >
                        <span className="border-b border-bone/30 pb-1 transition-colors group-hover/link:border-gold">
                          LinkedIn post
                        </span>
                        <span aria-hidden className="text-gold">
                          ↗
                        </span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-12 border-t border-line pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
            Positions held
          </h3>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            {leadershipRoles.length} roles
          </span>
        </div>

        <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
          {leadershipRoles.map((role) => (
            <li key={role.title + role.org} className="border-b border-line/70 py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm text-bone">{role.title}</p>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-gold/80">
                  {role.period}
                </span>
              </div>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                {role.org}
              </p>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted/90">{role.body}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {role.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-line/80 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Where this door ends: on people, not on a sales pitch. */}
      <div className="mt-10 border border-gold/35 bg-gold/[0.06] p-6 md:p-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
              Let&apos;s connect
            </p>
            <p className="mt-3 display text-[clamp(1.6rem,3.8vw,2.5rem)] leading-[1.02] text-bone">
              Building a room<span className="text-gold">?</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              If you would like to work with me, the quickest route is LinkedIn. If you are running an
              event, a hackathon or a panel and want help with the coordination, the promotions or the
              build, write to me with the date and I will tell you honestly where I can help.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-transform hover:-translate-y-0.5"
            >
              Connect on LinkedIn
              <span aria-hidden>↗</span>
            </a>
            <button
              onClick={openContactDialog}
              className="inline-flex items-center gap-2 border border-line px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-gold hover:text-gold"
            >
              Ask about event support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsShowcase;
