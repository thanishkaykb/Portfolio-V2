import { profile } from "../../lib/data";
import SectionHeading from "../ui/SectionHeading";

const process = [
  {
    step: "01",
    title: "Understand the ask",
    body: "Who is this for, what do they need to do, and what does success look like on a phone?",
  },
  {
    step: "02",
    title: "Structure before style",
    body: "Content hierarchy, routes and data shape first, the interface is easier once the model is honest.",
  },
  {
    step: "03",
    title: "Build in components",
    body: "Tokens, primitives and states (empty, loading, error) so the product stays consistent as it grows.",
  },
  {
    step: "04",
    title: "Test, deploy, document",
    body: "Responsive checks, keyboard access, real deployments on Vercel, and a README worth reading.",
  },
];

/** The craft half of the Website Development door: how I build, with the work above it. */
export function WebWorkShowcase() {
  return (
    <div>
      <SectionHeading
        label="The craft"
        title={
          <>
            The web is
            <br />
            <span className="text-gold">the medium.</span>
          </>
        }
        sub="Websites are my primary craft: responsive interfaces wired to real data, built with React, TypeScript and Tailwind, then shipped."
      />

      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {process.map((item) => (
          <li key={item.step} className="border-t border-line pt-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
                {item.step}
              </span>
              <p className="text-sm text-bone">{item.title}</p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-muted">
          Every project in this door is publicly deployed or open-source. No commercial client
          claims. These are personal, team and event builds.
        </p>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex shrink-0 items-center gap-2 border border-line px-5 py-3 text-[11px] uppercase tracking-[0.16em] text-bone transition-colors hover:border-gold hover:text-gold"
        >
          See the code ↗
        </a>
      </div>
    </div>
  );
}

export default WebWorkShowcase;
