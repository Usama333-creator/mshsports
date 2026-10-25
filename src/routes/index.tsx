import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Package,
  Scissors,
  Truck,
} from "lucide-react";
import shortsImg from "@/assets/shorts.jpg";
import footballImg from "@/assets/football-kit.jpg";
import taekwondoImg from "@/assets/taekwondo.jpg";
import { HeroSlider } from "@/components/hero-slider";
import { Marquee } from "@/components/marquee";
import { Reveal } from "@/components/reveal";
import { AthleteBanners } from "@/components/athlete-banners";
import { CylinderGallery } from "@/components/cylinder-gallery";
import { CustomizeDesign } from "@/components/customize-design";
import { categories } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Mashal Olympics Sports Wear | Custom Sportswear & Martial Arts Uniforms",
      },
      {
        name: "description",
        content:
          "Custom sports shorts, shirts, tank tops, gym wear, tracksuits, football kits, taekwondo, wushu and karate uniforms — made to your design by Mashal Olympics Sports Wear.",
      },
      {
        property: "og:title",
        content: "Mashal Olympics Sports Wear | Custom Sportswear",
      },
      {
        property: "og:description",
        content:
          "Custom sportswear and martial arts uniforms, made to your team's design.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Scissors,
    title: "Fully Custom",
    text: "Your colors, logos, names and numbers — sublimation, embroidery and printing under one roof.",
  },
  {
    icon: Package,
    title: "Low Minimums",
    text: "From single kits to full team orders, we produce the quantity your club actually needs.",
  },
  {
    icon: Award,
    title: "Competition Grade",
    text: "Fabric and cuts built for taekwondo, wushu, karate and football at competition level.",
  },
  {
    icon: Truck,
    title: "Fast Dispatch",
    text: "Streamlined production and dispatch so your kit arrives before match day.",
  },
];

const showcase = [
  { image: shortsImg, label: "Custom Shorts" },
  { image: footballImg, label: "Football Kits" },
  { image: taekwondoImg, label: "Taekwondo Dobok" },
];

function Index() {
  return (
    <main>
      {/* ---------- Slider hero banner ---------- */}
      <HeroSlider />

      <Marquee />

      {/* ---------- Category grid ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs font-bold tracking-[0.45em] uppercase text-primary">
            What We Make
          </p>
          <h2 className="mt-3 font-display text-5xl tracking-wide uppercase sm:text-6xl">
            Every Sport. <span className="text-flame">Every Design.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delayMs={(i % 4) * 90}>
              <Link
                to="/contact"
                className="product-card card-hover group relative block overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="size-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="font-display text-2xl tracking-wider uppercase text-white">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">{c.tagline}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] uppercase text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Get Quote <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Athlete banners ---------- */}
      <AthleteBanners />

      {/* ---------- Scroll-driven cylinder gallery ---------- */}
      <CylinderGallery />

      {/* ---------- Showcase strip ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {showcase.map((s, i) => (
            <Reveal key={s.label} variant={i === 1 ? "up" : i === 0 ? "left" : "right"}>
              <div className="product-card group relative overflow-hidden rounded-2xl border border-border">
                <img
                  src={s.image}
                  alt={s.label}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-[3/4] size-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
                  aria-hidden
                />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-display text-3xl tracking-wider uppercase text-white text-glow">
                    {s.label}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delayMs={i * 100}>
                <div className="group">
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <f.icon className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-2xl tracking-wider uppercase">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Customize your design ---------- */}
      <CustomizeDesign />

      {/* ---------- CTA ---------- */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[60rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pulse-glow bg-[radial-gradient(ellipse,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
          <Reveal>
            <h2 className="font-display text-5xl tracking-wide uppercase sm:text-6xl">
              Your Team. <span className="text-flame">Your Kit.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Send us your design or idea and get a quote with pricing and
              delivery time — no obligation.
            </p>
            <Link
              to="/contact"
              className="shine mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-display text-xl tracking-[0.15em] uppercase text-primary-foreground transition-transform duration-300 hover:scale-105"
            >
              Start Your Order <ArrowRight className="size-5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
