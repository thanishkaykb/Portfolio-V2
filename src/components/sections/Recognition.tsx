import { certifications, honors, profile } from "../../lib/data";
import SectionHeading from "../ui/SectionHeading";

export default function Recognition() {
  return (
    <section id="honours" className="relative border-t border-line py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            index="05"
            label="Recognition"
            title={
              <>
                Honours and
                <br />
                <span className="text-gold">certificates.</span>
              </>
            }
          />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Prizes, records and certifications, each naming the event or the body it came from.
            Participation is never presented as a win.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">Honours</h3>
            <ul className="mt-4 space-y-3">
              {honors.map((honor) => (
                <li key={honor.title} className="border-t border-line pt-3">
                  <p className="text-sm text-bone">{honor.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{honor.detail}</p>
                  {honor.link && (
                    <a
                      href={honor.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-1 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-gold/80 transition-colors hover:text-gold"
                    >
                      {honor.linkLabel ?? "View"}
                      <span aria-hidden>↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
              Certifications
            </h3>
            <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {certifications.map((cert) => (
                <li
                  key={`${cert.issuer}-${cert.name}`}
                  className="flex items-baseline justify-between gap-3 border-t border-line py-2.5"
                >
                  <span className="text-xs leading-snug text-bone/85">{cert.name}</span>
                  <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.14em] text-muted">
                    {cert.issuer}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[10px] leading-relaxed text-muted/70">
              Certifications as listed on my résumé and LinkedIn profile. Certificate links are
              available on request.
            </p>
          </div>
        </div>

        <p className="mt-10 font-mono text-[9px] uppercase tracking-[0.18em] text-muted/70">
          More about {profile.firstName} on{" "}
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="text-gold/80 underline-offset-4 hover:underline"
          >
            LinkedIn ↗
          </a>
        </p>
      </div>
    </section>
  );
}
