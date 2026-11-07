import { motion } from "framer-motion";
import PortraitAperture from "../ui/PortraitAperture";
import SectionHeading from "../ui/SectionHeading";
import { profile } from "../../lib/data";
import { scrollToSection, useReducedMotion } from "../../lib/hooks";

const paragraphs = [
  "I'm Thanishka Yogesh, a second-year Computer Science and Engineering student at Sri Sairam Engineering College in Chennai, building websites and the systems behind them.",
  "Most of what I know came from shipping: an accessibility platform that translates between speech and sign language, an RTI portal with authenticated dashboards, a QR studio with cloud storage, a risk-intelligence dashboard with explainable predictions. Each project started with a question I couldn't answer yet.",
  "Alongside coursework I've completed five internships, including full-stack development at Prodigy InfoTech, front-end design at Oasis Infobyte and artificial intelligence and app development at CodeAlpha. I lead outreach and multimedia for the IEEE TEMS Sairam Chapter, volunteer with the IEEE Reliability Society, and I'm a MAGIC member at Unnat Bharat Abhiyan, where I am the Advocate, and separately at UiAutomisticx Club, where I am the Mastermind. I will make a big contribution in both and drive real change there.",
  "I care about the parts people feel rather than notice: type that holds up at 360px, states for loading and error, keyboard access, motion that explains instead of performing. Away from code I'm an artist and a poet, and I'm currently looking for internships where I can work on real products with people who care about the details.",
];

const interests = [
  "Full-stack development",
  "Website development",
  "AI & explainable ML",
  "Creative coding & 3D",
  "UI/UX & design systems",
  "Community building",
];

export default function About() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="relative border-t border-line py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <PortraitAperture variant="about" className="mx-auto w-[46vw] max-w-[190px] sm:max-w-[240px] lg:w-full lg:max-w-[330px]" />

              <div className="mt-14 grid grid-cols-2 gap-4">
                <div className="border border-line p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">Degree</p>
                  <p className="mt-2 text-sm leading-snug text-bone">{profile.degree}</p>
                  <p className="mt-1 text-xs text-muted">{profile.department}</p>
                </div>
                <div className="border border-line p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">College</p>
                  <p className="mt-2 text-sm leading-snug text-bone">{profile.college}</p>
                  <p className="mt-1 text-xs text-muted">{profile.education}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="border border-line p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">CGPA</p>
                  <p className="mt-2 display text-2xl leading-none text-gold">{profile.cgpa}</p>
                  <p className="mt-1 text-xs text-muted">Current average</p>
                </div>
                <div className="border border-line p-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                    Internships
                  </p>
                  <p className="mt-2 display text-2xl leading-none text-gold">
                    {profile.internships}
                  </p>
                  <p className="mt-1 text-xs text-muted">Completed</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="border border-line/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted/70">
                Speaks {profile.languages.join(" · ")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionHeading
              index="03"
              label="About"
              title={
                <>
                  A developer who likes
                  <br />
                  <span className="text-gold">the whole picture.</span>
                </>
              }
            />

            <div className="mt-8 space-y-5">
              {paragraphs.map((paragraph, index) => (
                <motion.p
                  key={paragraph.slice(0, 24)}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className={
                    index === 0
                      ? "text-lg leading-relaxed text-bone/90 md:text-xl"
                      : "text-sm leading-relaxed text-muted md:text-base"
                  }
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <blockquote className="mt-10 border-l-2 border-gold pl-5">
              <p className="text-base leading-relaxed text-bone/85 md:text-lg">
                “Build the interface. Then earn it, with structure, states and data that behaves.”
              </p>
              <footer className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
                Working principle
              </footer>
            </blockquote>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection("story")}
                className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-transform hover:-translate-y-0.5"
              >
                Read my story ↓
              </button>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-line px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:border-gold hover:text-gold"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
