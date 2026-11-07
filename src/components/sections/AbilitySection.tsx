import GitHubCard from "./GitHubCard";
import SectionHeading from "../ui/SectionHeading";
import { githubContributions as gh } from "../../lib/github-contributions";

export default function AbilitySection() {
  return (
    <section id="ability" className="relative border-t border-line py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-6">
            <SectionHeading
              index="02"
              label="GitHub activity"
              title={
                <>
                  A year of building,
                  <br />
                  <span className="text-gold">in one card.</span>
                </>
              }
              sub={`Every green square is a real commit, pull request or review. ${gh.total.toLocaleString("en-US")} contributions across ${gh.activeDays} active days in the last twelve months, pulled from GitHub's own calendar, not typed by hand.`}
            />

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6">
              {[
                { term: "Handle", detail: `@${gh.handle}` },
                {
                  term: "Contributions",
                  detail: `${gh.total.toLocaleString("en-US")} in 12 months`,
                },
                { term: "Active days", detail: `${gh.activeDays}, with a ${gh.longestStreak}-day best streak` },
                {
                  term: "Busiest day",
                  detail: `${gh.bestDay.count} contributions on ${gh.bestDay.date}`,
                },
              ].map((item) => (
                <div key={item.term} className="border-t border-line pt-3">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.24em] text-gold/80">
                    {item.term}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-snug text-bone/85">{item.detail}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 max-w-md text-xs leading-relaxed text-muted">
              This is the same graph that lives on github.com/{gh.handle}, public work only, so
              private repositories never inflate the count.
            </p>

            <a
              href={gh.profile}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-6 inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold hover:text-gold"
            >
              Open my GitHub
              <span aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          </div>

          <div className="lg:col-span-6">
            <GitHubCard />
          </div>
        </div>
      </div>
    </section>
  );
}
