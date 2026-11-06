import { cn } from "../../lib/hooks";

type Props = {
  items?: string[];
  className?: string;
  reverse?: boolean;
};

export default function Marquee({ items, className, reverse }: Props) {
  const words =
    items ??
    [
      "Website Development",
      "Full-Stack",
      "React",
      "TypeScript",
      "UI/UX",
      "Creative Development",
      "Chennai",
    ];
  const row = [...words, ...words];

  return (
    <div
      className={cn(
        "group relative flex overflow-hidden border-y border-line bg-ink py-4 md:py-5",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "marquee-track flex w-max shrink-0 items-center gap-8 whitespace-nowrap pr-8",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {row.concat(row).map((word, index) => (
          <span key={`${word}-${index}`} className="flex items-center gap-8">
            <span className="display text-lg tracking-[0.02em] text-bone/75 md:text-2xl">
              {word}
            </span>
            <span className="text-[10px] text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
