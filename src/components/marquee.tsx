import { marqueeItems } from "@/lib/catalog";

export function Marquee() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="relative overflow-hidden bg-primary py-4 text-primary-foreground">
      <div className="marquee-track items-center gap-10">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 font-display text-2xl tracking-[0.2em] uppercase">
            {item}
            <span className="inline-block size-2 rotate-45 bg-black" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}
