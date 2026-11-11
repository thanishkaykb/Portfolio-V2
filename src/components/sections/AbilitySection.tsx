import GitHubCard from "./GitHubCard";
import SectionHeading from "../ui/SectionHeading";
import { useGithubActivity } from "../../lib/github-live";

export default function AbilitySection() {
  const { activity: gh } = useGithubActivity();

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
                  <span className="text-gold">in one card</span><span aria-hidden="true">.</span>
                </>
              }
              sub={`Every gold square is a real commit, pull request or review. ${gh.total.toLocaleString("en-US")} contributions across ${gh.activeDays} active days in the last twelve months, pulled from GitHub's own calendar, not typed by hand.`}
            />

            <a
              href={gh.profile}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-8 inline-flex items-center gap-2 border border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold hover:text-gold"
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
