import { cn } from "../../lib/hooks";

type Props = {
  index?: string;
  label: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
  titleClassName?: string;
};

export default function SectionHeading({
  index,
  label,
  title,
  sub,
  className,
  align = "left",
  titleClassName,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {index && <span className="font-mono text-[10px] tracking-[0.2em] text-gold">{index}</span>}
        <span className="h-px w-8 bg-line" aria-hidden />
        <span className="eyebrow text-bone/70">{label}</span>
      </div>
      <h2
        className={cn(
          "display text-[clamp(2.4rem,7.4vw,5.6rem)] text-bone",
          align === "center" && "max-w-4xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            "max-w-xl text-sm leading-relaxed text-muted md:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
