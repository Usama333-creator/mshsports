import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flame, MessageCircle, Search } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { categories } from "@/lib/catalog";
import { formatPrice, useProducts } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      {
        title: "Shop | Mashal Olympics Sports Wear",
      },
      {
        name: "description",
        content:
          "Browse the full Mashal Olympics Sports Wear collection — custom shorts, jerseys, gym wear, tracksuits, football kits and martial arts uniforms.",
      },
      {
        property: "og:title",
        content: "Shop | Mashal Olympics Sports Wear",
      },
      {
        property: "og:description",
        content:
          "Custom shorts, shirts, gym wear, tracksuits, football kits and martial arts uniforms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { cat?: string } => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const { data: products = [], isLoading } = useProducts();
  const [cat, setCat] = useState(search.cat ?? "all");
  const [q, setQ] = useState("");

  const needle = q.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      (cat === "all" || p.category_slug === cat) &&
      (!needle || `${p.name} ${p.description ?? ""}`.toLowerCase().includes(needle)),
  );
  const catOf = (slug: string) => categories.find((c) => c.slug === slug);

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.45em] uppercase text-primary">The Collection</p>
          <h1 className="mt-3 font-display text-6xl tracking-wide uppercase sm:text-7xl">
            Shop <span className="text-flame">All Products</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Every item is made to order — pick a product, send us your design, logo and sizes, and we handle the rest.
          </p>
        </Reveal>

        {/* Filters */}
        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[{ slug: "all", name: "All" }, ...categories].map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCat(c.slug)}
                className={`btn-lift rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] ${
                  cat === c.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <label className="relative block w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
            />
          </label>
        </div>

        {/* Products from Supabase */}
        {products.length > 0 ? (
          filtered.length > 0 ? (
            <div className="mt-10 grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((p, i) => {
                const c = catOf(p.category_slug);
                const img = p.image_url ?? c?.image;
                return (
                  <Reveal key={p.id} delayMs={(i % 4) * 80} variant="scale">
                    <article className="product-card card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background">
                      <div className="relative aspect-[4/5] overflow-hidden bg-card">
                        {img && <img src={img} alt={p.name} loading="lazy" className="size-full object-cover" />}
                        {p.featured && (
                          <span className="shine absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                            <Flame className="size-3" /> Featured
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 rounded-full bg-black/85 px-3 py-1 text-xs font-bold text-white">
                          {formatPrice(p.price)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{c?.name ?? p.category_slug}</p>
                        <h2 className="mt-1 font-display text-2xl uppercase tracking-wide">{p.name}</h2>
                        {p.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
                        <div className="mt-auto flex gap-2 pt-5">
                          <a
                            href={whatsappLink(`Hi! I'd like to order: ${p.name} (${formatPrice(p.price)})`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-lift inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground"
                          >
                            <MessageCircle className="size-4" /> Order
                          </a>
                          <Link
                            to="/contact"
                            className="red-sweep inline-flex flex-1 items-center justify-center rounded-full border border-foreground px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em]"
                          >
                            Customize
                          </Link>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="mt-16 pb-24 text-center text-muted-foreground">No products match your search.</p>
          )
        ) : isLoading ? (
          <p className="mt-16 pb-24 text-center text-muted-foreground">Loading collection…</p>
        ) : (
          /* Fallback: category cards until products are added in the admin panel */
          <div className="mt-10 grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {categories
              .filter((c) => cat === "all" || c.slug === cat)
              .map((c, i) => (
                <Reveal key={c.slug} delayMs={(i % 3) * 100} variant="scale">
                  <Link
                    to="/contact"
                    className="product-card card-hover group relative block overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img src={c.image} alt={c.name} loading="lazy" className="size-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" aria-hidden />
                      <span className="shine absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                        <Flame className="size-3" /> Made to Order
                      </span>
                      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 transition-transform duration-300 group-hover:translate-y-0">
                        <h2 className="font-display text-3xl tracking-wider uppercase text-white">{c.name}</h2>
                        <p className="mt-1 text-sm text-white/70">{c.tagline}</p>
                        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 group-hover:bg-primary">
                          Get Quote <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}
