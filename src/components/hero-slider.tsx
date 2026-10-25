import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useBanners } from "@/lib/data";
import heroImg from "@/assets/hero.jpg";
import footballImg from "@/assets/football-kit.jpg";
import taekwondoImg from "@/assets/taekwondo.jpg";

const typedWords = ["Football.", "Taekwondo.", "Karate.", "Wushu.", "Gym.", "Your Team."];

function useTyping(words: string[]) {
  const [text, setText] = useState("");
  useEffect(() => {
    let w = 0;
    let c = 0;
    let del = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[w];
      c += del ? -1 : 1;
      setText(word.slice(0, c));
      let delay = del ? 45 : 100;
      if (!del && c === word.length) {
        del = true;
        delay = 1300;
      } else if (del && c === 0) {
        del = false;
        w = (w + 1) % words.length;
        delay = 300;
      }
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, [words]);
  return text;
}

type Slide = {
  image: string;
  eyebrow: string;
  cta: { to: "/shop" | "/contact"; label: string };
  render: (typed: string) => React.ReactNode;
  body: string;
};

const slides: Slide[] = [
  {
    image: heroImg,
    eyebrow: "Custom Sportswear Manufacturer",
    body: "Shorts, shirts, tank tops, gym wear, tracksuits, football kits and martial arts uniforms — every piece stitched to your design, your colors, your team.",
    cta: { to: "/shop", label: "Explore Collection" },
    render: (typed) => (
      <>
        Mashal <span className="text-flame">Olympics</span>
        <br />
        Made for <span className="text-flame">{typed}</span>
        <span className="typing-caret" aria-hidden />
      </>
    ),
  },
  {
    image: footballImg,
    eyebrow: "Team Orders Open",
    body: "Club colors, names and numbers — sublimated football kits with low minimums and fast dispatch before match day.",
    cta: { to: "/contact", label: "Get a Team Quote" },
    render: () => (
      <>
        Your Club. <br />
        <span className="text-flame">Your Kit.</span>
      </>
    ),
  },
  {
    image: taekwondoImg,
    eyebrow: "Carry the Flame",
    body: "Competition-grade taekwondo dobok, wushu and karate uniforms in every size, built for the mat.",
    cta: { to: "/shop", label: "Shop Martial Arts" },
    render: () => (
      <>
        Train Like <br />
        <span className="text-flame">A Champion.</span>
      </>
    ),
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const typed = useTyping(typedWords);
  const { data: heroBanners } = useBanners("hero");
  const go = useCallback((d: number) => setI((v) => (v + d + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <section
      className="theme-dark relative min-h-screen overflow-hidden bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, n) => (
        <div
          key={s.eyebrow}
          className={`absolute inset-0 transition-opacity duration-1000 ${n === i ? "z-10 opacity-100" : "z-0 opacity-0"}`}
          aria-hidden={n !== i}
        >
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <img
              src={heroBanners?.[n]?.image_url ?? s.image}
              alt=""
              width={1600}
              height={900}
              className={`size-full object-cover ${n === i ? "kenburns" : ""}`}
            />
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--background)_5%,color-mix(in_oklab,var(--background)_70%,transparent)_45%,color-mix(in_oklab,var(--background)_15%,transparent)),linear-gradient(to_top,var(--background)_4%,transparent_45%)]"
            aria-hidden
          />
          <div className="relative flex min-h-screen items-center">
            <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 md:pr-28">
              <div key={n === i ? `on-${i}` : `off-${n}`} className="max-w-3xl">
                <p
                  className="animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 text-xs font-bold tracking-[0.45em] uppercase text-primary"
                  style={{ animationDelay: "150ms" }}
                >
                  {s.eyebrow}
                </p>
                <h1
                  className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both duration-1000 mt-5 font-display text-6xl leading-[0.95] tracking-wide uppercase text-foreground text-glow sm:text-7xl md:text-8xl"
                  style={{ animationDelay: "300ms" }}
                >
                  {s.render(typed)}
                </h1>
                <p
                  className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-1000 mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                  style={{ animationDelay: "550ms" }}
                >
                  {s.body}
                </p>
                <div
                  className="animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-1000 mt-10 flex flex-wrap items-center gap-4"
                  style={{ animationDelay: "750ms" }}
                >
                  <Link
                    to={s.cta.to}
                    className="shine group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-xl tracking-[0.15em] uppercase text-primary-foreground shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--primary)_70%,transparent)] transition-transform duration-300 hover:scale-105"
                  >
                    {s.cta.label}
                    <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/contact"
                    className="flame-border inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-8 py-4 font-display text-xl tracking-[0.15em] uppercase text-foreground backdrop-blur transition-colors duration-300 hover:text-primary"
                  >
                    <Flame className="size-5 text-primary" />
                    Custom Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Right-side rail: counter, slide bars, arrows and scroll hint */}
      <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex lg:right-8">
        <span className="font-display text-xl tracking-widest text-foreground">
          0{i + 1}
          <span className="text-muted-foreground"> / 0{slides.length}</span>
        </span>
        <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="grid size-10 place-items-center rounded-full border border-border bg-background/50 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary">
          <ChevronLeft className="size-5 rotate-90" />
        </button>
        <div className="flex flex-col gap-2">
          {slides.map((s, n) => (
            <button
              key={s.eyebrow}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Go to slide ${n + 1}`}
              className={`w-1.5 rounded-full transition-all duration-500 ${n === i ? "h-12 bg-primary" : "h-6 bg-foreground/30 hover:bg-foreground/60"}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Next slide" className="grid size-10 place-items-center rounded-full border border-border bg-background/50 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary">
          <ChevronRight className="size-5 rotate-90" />
        </button>
        <div className="mt-2 flex flex-col items-center gap-2 text-primary">
          <span className="text-[10px] font-bold tracking-[0.35em] uppercase [writing-mode:vertical-rl]">Scroll</span>
          <ChevronDown className="size-6 scroll-hint" />
        </div>
      </div>

      {/* Mobile dots */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center gap-2 md:hidden">
        {slides.map((s, n) => (
          <button
            key={s.eyebrow}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Go to slide ${n + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? "w-10 bg-primary" : "w-4 bg-foreground/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
