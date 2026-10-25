import { Link } from "@tanstack/react-router";
import { ArrowRight, Flame } from "lucide-react";
import footballImg from "@/assets/football-kit.jpg";
import taekwondoImg from "@/assets/taekwondo.jpg";
import gymImg from "@/assets/gym-wear.jpg";
import { Reveal } from "@/components/reveal";
import { useBanners, type Banner } from "@/lib/data";

// Shown until you add your own banners in Admin → Banners ("athletes" placement).
const defaults: Banner[] = [
  { id: "d1", placement: "athletes", title: "On The Pitch", subtitle: "Football kits cut for ninety minutes of play", image_url: footballImg, link: "/shop", sort: 1, active: true },
  { id: "d2", placement: "athletes", title: "On The Mat", subtitle: "Taekwondo, karate & wushu uniforms for competition", image_url: taekwondoImg, link: "/shop", sort: 2, active: true },
  { id: "d3", placement: "athletes", title: "In The Gym", subtitle: "Breathable training wear that moves with you", image_url: gymImg, link: "/shop", sort: 3, active: true },
];

function SmartLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  if (/^https?:\/\//.test(to)) {
    return <a href={to} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
  }
  return <Link to={to as "/"} className={className}>{children}</Link>;
}

export function AthleteBanners() {
  const { data } = useBanners("athletes");
  const { data: promoData } = useBanners("promo");
  const items = data && data.length > 0 ? data : defaults;
  const promo = promoData?.[0];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <Reveal className="text-center">
        <p className="text-xs font-bold tracking-[0.45em] uppercase text-primary">Worn By Athletes</p>
        <h2 className="mt-3 font-display text-5xl tracking-wide uppercase sm:text-6xl">
          Built For <span className="text-flame">Champions</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {items.map((b, i) => (
          <Reveal key={b.id} variant={i === 0 ? "left" : "right"} delayMs={i * 90} className={i === 0 ? "md:col-span-2 md:row-span-2" : ""}>
            <SmartLink
              to={b.link || "/shop"}
              className={`banner-zoom card-hover group relative block overflow-hidden rounded-3xl border border-border bg-foreground ${i === 0 ? "min-h-[360px] md:min-h-[560px]" : "min-h-[270px]"}`}
            >
              <img src={b.image_url} alt={b.title} loading="lazy" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" aria-hidden />
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
                <Flame className="size-3" /> Athlete Series
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <h3 className={`font-display uppercase tracking-wider text-white ${i === 0 ? "text-5xl sm:text-6xl" : "text-3xl"}`}>{b.title}</h3>
                {b.subtitle && <p className="mt-2 max-w-md text-sm text-white/75 sm:text-base">{b.subtitle}</p>}
                <span className="banner-cta mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Shop the look <ArrowRight className="size-4 text-primary" />
                </span>
              </div>
            </SmartLink>
          </Reveal>
        ))}
      </div>

      <Reveal variant="scale" className="mt-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          {promo?.image_url && (
            <img src={promo.image_url} alt="" className="absolute inset-0 size-full object-cover opacity-25 mix-blend-multiply" loading="lazy" />
          )}
          <div className="relative">
            <h3 className="font-display text-4xl uppercase tracking-wider sm:text-5xl">{promo?.title ?? "Outfit Your Entire Team"}</h3>
            <p className="mx-auto mt-2 max-w-xl text-primary-foreground/85">
              {promo?.subtitle ?? "Send your design, colours and sizes — get a quote with pricing and delivery time. No obligation."}
            </p>
            <SmartLink to={promo?.link || "/contact"} className="btn-lift mt-6 inline-flex items-center gap-2 rounded-full bg-black px-8 py-3.5 font-display text-lg uppercase tracking-[0.15em] text-white">
              Start Your Order <ArrowRight className="size-5" />
            </SmartLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
