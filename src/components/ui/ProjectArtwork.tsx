import { useState } from "react";
import { cn } from "../../lib/hooks";
import type { Project } from "../../lib/data";

export type ArtworkMotif =
  | Project["motif"]
  | "doors"
  | "palette"
  | "type"
  | "place"
  | "portal";

/**
 * Shows the real captured landing page when a screenshot exists at `shot`
 * (public/projects/*.jpg, captured from the deployed site). If the file is
 * missing the original code-drawn motif is used instead, so a card is never
 * empty and never shows a fake screenshot.
 */
export default function ProjectArtwork({
  motif,
  label,
  sub,
  shot,
  className,
}: {
  motif: ArtworkMotif;
  label?: string;
  sub?: string;
  shot?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showShot = Boolean(shot) && !failed;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#0b0b0a]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 80% at 82% 0%, rgba(255,201,40,0.14), transparent 55%), radial-gradient(90% 60% at 0% 100%, rgba(255,201,40,0.07), transparent 60%)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-25" />

      {/* browser chrome */}
      <div className="relative flex items-center justify-between border-b border-line/80 bg-black/30 px-3 py-2">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 rounded-full bg-bone/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-bone/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
        </div>
        <span className="max-w-[70%] truncate font-mono text-[8px] uppercase tracking-[0.2em] text-muted/80">
          {label ?? motif}
        </span>
        <span className="font-mono text-[8px] text-gold/60">↗</span>
      </div>

      {showShot ? (
        <div className="relative h-[calc(100%-30px)] w-full overflow-hidden">
          <img
            src={shot}
            alt={label ? `${label} landing page` : "Project landing page"}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-top"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
            style={{ background: "linear-gradient(to top, rgba(8,8,8,0.55), transparent)" }}
          />
        </div>
      ) : (
        <div className="relative h-[calc(100%-30px)] p-3 sm:p-4">
          {renderMotif(motif, sub)}
        </div>
      )}
    </div>
  );
}

function renderMotif(motif: ArtworkMotif, sub?: string) {
  switch (motif) {
    case "signs":
      return (
        <div className="flex h-full flex-col justify-between gap-2">
          <div className="flex items-baseline justify-between">
            <p className="display text-[clamp(0.95rem,2.2vw,1.5rem)] leading-none text-bone">
              Silent voices,
              <br />
              <span className="text-gold">seen</span><span aria-hidden="true">.</span>
            </p>
            <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-gold/70">
              live
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {["A", "B", "ILY", "YES", "TY", "HELLO"].map((sign, index) => (
              <div
                key={sign}
                className={cn(
                  "grid aspect-square place-items-center border text-[7px] uppercase tracking-wider",
                  index === 2
                    ? "border-gold/60 bg-gold/10 text-gold"
                    : "border-line text-bone/70",
                )}
              >
                {sign}
              </div>
            ))}
          </div>
          <div className="border border-line/80 bg-black/30 p-2">
            <p className="font-mono text-[6.5px] uppercase tracking-[0.2em] text-muted">
              Voice → sign
            </p>
            <p className="mt-1 truncate text-[10px] text-bone">
              “Good morning” <span className="text-gold">→ 4 signs</span>
            </p>
          </div>
        </div>
      );

    case "civic":
      return (
        <div className="flex h-full gap-2">
          <div className="hidden w-1/4 flex-col gap-1 border-r border-line/70 pr-2 sm:flex">
            {["Overview", "New RTI", "My RTIs", "Profile"].map((item, index) => (
              <div
                key={item}
                className={cn(
                  "px-1.5 py-1 text-[7px] uppercase tracking-[0.12em]",
                  index === 2 ? "bg-gold/12 text-gold" : "text-muted/80",
                )}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-bone">My RTIs</p>
              <span className="bg-gold px-1.5 py-0.5 font-mono text-[6px] uppercase tracking-[0.14em] text-ink">
                New +
              </span>
            </div>
            {["Municipal road repair", "Water quality report", "College admission data"].map(
              (row, index) => (
                <div
                  key={row}
                  className="flex items-center justify-between border border-line/70 px-2 py-1.5"
                >
                  <span className="truncate text-[8px] text-bone/85">{row}</span>
                  <span
                    className={cn(
                      "font-mono text-[6px] uppercase tracking-[0.12em]",
                      index === 0 ? "text-gold" : "text-muted",
                    )}
                  >
                    {index === 0 ? "Draft" : index === 1 ? "Filed" : "Saved"}
                  </span>
                </div>
              ),
            )}
            <div className="mt-auto flex h-8 items-end gap-1">
              {[35, 55, 40, 72, 60, 88, 50].map((height, index) => (
                <span
                  key={index}
                  className={cn(
                    "flex-1",
                    index === 5 ? "bg-gold/80" : "bg-bone/15",
                  )}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      );

    case "event":
      return (
        <div className="flex h-full flex-col justify-between">
          <div>
            <p className="font-mono text-[6.5px] uppercase tracking-[0.22em] text-gold">
              IEEE Reliability Society · SEC SBC
            </p>
            <p className="display mt-1 text-[clamp(1.1rem,3vw,1.9rem)] leading-[0.86] text-bone">
              Intellect
              <br />
              Hack <span className="text-gold">2026</span>
            </p>
          </div>
          <div className="space-y-1">
            {["Online prelims", "Ideate & present", "Build & demo"].map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-1 w-1 shrink-0 rounded-full",
                    index === 1 ? "bg-gold" : "bg-line",
                  )}
                />
                <span className="h-px flex-1 bg-line/70" />
                <span
                  className={cn(
                    "font-mono text-[6.5px] uppercase tracking-[0.14em]",
                    index === 1 ? "text-gold" : "text-muted/80",
                  )}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line/80 pt-1.5">
            <span className="font-mono text-[6.5px] uppercase tracking-[0.16em] text-muted">
              6 hours · 2–4 members
            </span>
            <span className="border border-gold/50 px-1.5 py-0.5 font-mono text-[6px] uppercase tracking-[0.14em] text-gold">
              Register
            </span>
          </div>
        </div>
      );

    case "qr": {
      const cells = Array.from({ length: 15 * 15 }, (_, index) => {
        const row = Math.floor(index / 15);
        const col = index % 15;
        const finder =
          (row < 4 && col < 4) || (row < 4 && col > 10) || (row > 10 && col < 4);
        const value = (row * 7 + col * 11 + row * col * 3) % 9 < 4;
        return { on: finder || value, finder };
      });
      return (
        <div className="flex h-full items-center gap-3">
          <div className="grid aspect-square h-full max-h-[86%] w-[52%] shrink-0 grid-cols-15 gap-[1px] border border-line/60 bg-bone/90 p-[3px]">
            {cells.map((cell, index) => (
              <span
                key={index}
                className={cell.finder ? "bg-ink" : cell.on ? "bg-ink/85" : "bg-transparent"}
              />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-[9px] text-bone">QR studio</p>
            {["Rounded", "Dots", "Diamond"].map((style, index) => (
              <div
                key={style}
                className={cn(
                  "flex items-center justify-between border px-1.5 py-1 text-[7px]",
                  index === 0 ? "border-gold/50 text-gold" : "border-line/70 text-muted",
                )}
              >
                {style}
                <span className="h-1.5 w-1.5 rounded-full border border-current" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "nutrition":
      return (
        <div className="grid h-full grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative grid aspect-square w-full max-w-[104px] place-items-center rounded-full"
              style={{
                background:
                  "conic-gradient(#FFC928 0deg 236deg, rgba(255,201,40,0.12) 236deg 360deg)",
              }}
            >
              <div className="grid h-[78%] w-[78%] place-items-center rounded-full bg-[#0b0b0a]">
                <div className="text-center">
                  <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-muted">kcal</p>
                  <p className="text-sm text-bone">1,842</p>
                </div>
              </div>
            </div>
            <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.18em] text-gold/70">
              Gemini vision
            </p>
          </div>
          <div className="flex flex-col justify-center gap-2">
            {[
              { label: "Protein", value: 74, grams: "112g" },
              { label: "Carbs", value: 58, grams: "196g" },
              { label: "Fat", value: 34, grams: "61g" },
            ].map((macro) => (
              <div key={macro.label}>
                <div className="flex items-baseline justify-between font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted">
                  <span>{macro.label}</span>
                  <span className="text-bone/80">{macro.grams}</span>
                </div>
                <div className="mt-1 h-[3px] w-full bg-line">
                  <div className="h-[3px] bg-gold/80" style={{ width: `${macro.value}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-1 border border-line/70 p-1.5">
              <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-muted">
                Identified
              </p>
              <p className="text-[8px] text-bone/90">Paneer bowl · 1 serving</p>
            </div>
          </div>
        </div>
      );

    case "capsule":
      return (
        <div className="flex h-full flex-col justify-between gap-2">
          <div className="flex items-baseline justify-between">
            <p className="text-[9px] text-bone">Farewell · 2026</p>
            <span className="font-mono text-[6px] uppercase tracking-[0.16em] text-gold">
              locked
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["12", "08", "43", "21"].map((unit, index) => (
              <div key={index} className="border border-line/80 bg-black/30 py-1 text-center">
                <p className="font-mono text-[11px] leading-none text-bone">{unit}</p>
                <p className="mt-0.5 font-mono text-[5.5px] uppercase tracking-[0.1em] text-muted">
                  {["days", "hrs", "min", "sec"][index]}
                </p>
              </div>
            ))}
          </div>
          <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "relative overflow-hidden border border-line/60",
                  index === 0 && "bg-gold/15",
                  index === 3 && "bg-bone/10",
                )}
              >
                <span className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-1 left-1 font-mono text-[5px] uppercase tracking-[0.1em] text-bone/60">
                  {index < 2 ? "photo" : index === 2 ? "video" : ""}
                </span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-muted">
            Revealed together · 6 contributors
          </p>
        </div>
      );

    case "portal":
      return (
        <div className="flex h-full flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full border border-gold/50 font-mono text-[6px] text-gold">
              IN
            </span>
            <p className="text-[9px] leading-tight text-bone">
              One Nation
              <br />
              <span className="text-muted">One Portal</span>
            </p>
          </div>
          {["Schemes", "Announcements", "Citizen services"].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between border-b border-line/60 pb-1 text-[8px] text-bone/80"
            >
              {row}
              <span className="text-[6px] text-gold/70">→</span>
            </div>
          ))}
          <div className="mt-auto border border-line/70 bg-black/20 p-1.5">
            <p className="font-mono text-[6px] uppercase tracking-[0.14em] text-muted">Search</p>
            <p className="text-[7px] text-bone/70">Find a scheme…</p>
          </div>
        </div>
      );

    case "ai":
      return (
        <div className="flex h-full flex-col justify-end gap-1.5">
          <div className="max-w-[80%] border border-line/70 bg-black/30 px-2 py-1.5">
            <p className="text-[7.5px] leading-snug text-bone/85">
              Summarise chapter 4 into flashcards.
            </p>
          </div>
          <div className="ml-auto max-w-[85%] border border-gold/40 bg-gold/10 px-2 py-1.5">
            <p className="text-[7.5px] leading-snug text-bone">
              12 cards created · 4 sources cited
            </p>
          </div>
          <div className="flex items-center gap-1 border border-line/60 px-2 py-1">
            <span className="h-1 w-1 rounded-full bg-gold/70" />
            <span className="font-mono text-[6px] uppercase tracking-[0.14em] text-muted">
              study buddy
            </span>
          </div>
        </div>
      );

    case "doors":
      return (
        <div className="grid h-full grid-cols-5 gap-1.5">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={cn(
                "relative flex flex-col justify-end border p-1",
                index === 1 ? "border-gold/50 bg-gold/10" : "border-line/70 bg-black/20",
              )}
            >
              <span
                className={cn(
                  "absolute right-1 top-1 h-full w-px",
                  index === 1 ? "bg-gold/80" : "bg-gold/25",
                )}
                style={{ height: "calc(100% - 8px)" }}
              />
              <span className="font-mono text-[6px] text-gold/70">0{index + 1}</span>
              <span className="mt-1 font-mono text-[5px] uppercase leading-tight tracking-[0.08em] text-muted">
                {["web", "full-stack", "ui/ux", "creative", "projects"][index]}
              </span>
            </div>
          ))}
        </div>
      );

    case "palette":
      return (
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-1 gap-1.5">
            {[
              { hex: "#080808", name: "Ink" },
              { hex: "#F5F2E9", name: "Bone" },
              { hex: "#FFC928", name: "Gold" },
            ].map((swatch) => (
              <div key={swatch.name} className="flex flex-1 flex-col">
                <div
                  className="flex-1 border border-line/50"
                  style={{ backgroundColor: swatch.hex }}
                />
                <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.12em] text-muted">
                  {swatch.hex}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.2em] text-gold/70">
            One accent, used deliberately
          </p>
        </div>
      );

    case "type":
      return (
        <div className="flex h-full flex-col justify-between">
          <p className="display text-[clamp(2rem,7vw,3.4rem)] leading-[0.8] text-bone">
            Aa<span className="text-gold">.</span>
          </p>
          <div className="space-y-1">
            <p className="display text-[7px] uppercase tracking-[0.3em] text-muted">
              Anton · display
            </p>
            <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-muted">
              JetBrains Mono · labels
            </p>
            <p className="text-[7px] text-bone/70">Inter · body copy and interface text</p>
          </div>
          <div className="h-px w-full bg-line" />
        </div>
      );

    case "risk":
      return (
        <div className="flex h-full flex-col justify-between gap-2">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] text-bone">
              PAIMANA<span className="text-gold">·</span>AI
            </p>
            <span className="border border-gold/40 px-1.5 py-0.5 font-mono text-[5.5px] uppercase tracking-[0.14em] text-gold">
              live
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: "Cost", value: 72 },
              { label: "Schedule", value: 46 },
              { label: "Execution", value: 88 },
            ].map((risk) => (
              <div key={risk.label} className="border border-line/70 p-1">
                <p className="font-mono text-[5.5px] uppercase tracking-[0.1em] text-muted">
                  {risk.label}
                </p>
                <p className="mt-0.5 text-[10px] text-bone">{risk.value}</p>
                <div className="mt-1 h-[2px] w-full bg-line">
                  <div className="h-[2px] bg-gold" style={{ width: `${risk.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex h-10 items-end gap-1">
            {[28, 44, 38, 62, 51, 74, 68, 86, 58, 92].map((height, index) => (
              <span
                key={index}
                className={index > 7 ? "flex-1 bg-gold/80" : "flex-1 bg-bone/15"}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <p className="font-mono text-[6px] uppercase tracking-[0.16em] text-muted">
            SHAP explainability · what-if simulation
          </p>
        </div>
      );

    case "place":
      return (
        <div className="relative flex h-full flex-col justify-between">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, #292929 1px, transparent 1px), linear-gradient(to bottom, #292929 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="relative flex items-center justify-between">
            <p className="font-mono text-[6.5px] uppercase tracking-[0.18em] text-muted">
              Chennai · TN
            </p>
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(255,201,40,0.5)]" />
          </div>
          <p className="relative display text-[clamp(1rem,3vw,1.8rem)] leading-none text-bone">
            13.08° N
            <br />
            <span className="text-gold">80.27° E</span>
          </p>
          <p className="relative font-mono text-[6px] uppercase tracking-[0.16em] text-muted">
            {sub ?? "Where the work happens"}
          </p>
        </div>
      );

    default:
      return (
        <div className="grid h-full place-items-center">
          <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-muted">
            {sub ?? "Project"}
          </p>
        </div>
      );
  }
}
