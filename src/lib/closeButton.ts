/**
 * Shared look for the Close control on every detail overlay. The old button
 * was a thin grey outline on a dark sheet, which readers kept losing; a gold
 * border, gold label and a solid gold hover/pressed fill stay obvious on both
 * the near-black body and the lighter sticky bar, and the icon flips to ink
 * (dark on gold) so the glyph itself is never the only contrast.
 */
export const closeButtonClass =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 border border-gold bg-gold/10 px-4 py-2.5 font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-gold transition-colors duration-200 hover:bg-gold hover:text-ink focus-visible:bg-gold focus-visible:text-ink focus-visible:outline-none active:bg-gold active:text-ink";

export const closeIconButtonClass =
  "grid h-10 w-10 shrink-0 place-items-center border border-gold bg-gold/10 font-mono text-[13px] leading-none text-gold transition-colors duration-200 hover:bg-gold hover:text-ink focus-visible:bg-gold focus-visible:text-ink focus-visible:outline-none active:bg-gold active:text-ink";
