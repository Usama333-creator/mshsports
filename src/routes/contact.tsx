import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, Flame, Send } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { categories } from "@/lib/catalog";
import { whatsappLink } from "@/lib/site";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      {
        title: "Custom Order & Quote | Mashal Olympics Sports Wear",
      },
      {
        name: "description",
        content:
          "Request a quote for custom sports shorts, shirts, gym wear, tracksuits, football kits, taekwondo, wushu and karate uniforms.",
      },
      {
        property: "og:title",
        content: "Custom Order & Quote | Mashal Olympics Sports Wear",
      },
      {
        property: "og:description",
        content:
          "Request a quote for custom sportswear and martial arts uniforms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const inputClasses =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [product, setProduct] = useState(categories[0]?.name ?? "Custom Sports Shorts");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const d = new FormData(event.currentTarget);
    const text = [
      "*New Custom Order Inquiry*",
      `Name: ${d.get("name") ?? ""}`,
      `Phone: ${d.get("phone") ?? ""}`,
      `Product: ${d.get("product") ?? product}`,
      `Quantity: ${d.get("quantity") || "-"}`,
      `Needed by: ${d.get("deadline") || "-"}`,
      `Details: ${d.get("details") || "-"}`,
    ].join("\n");
    if (supabase) {
      void supabase.from("mo_inquiries").insert({
        name: String(d.get("name") ?? ""),
        phone: String(d.get("phone") ?? ""),
        product: String(d.get("product") ?? product),
        quantity: String(d.get("quantity") ?? ""),
        deadline: String(d.get("deadline") ?? ""),
        details: String(d.get("details") ?? ""),
      });
    }
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.45em] uppercase text-primary">
            Get a Quote
          </p>
          <h1 className="mt-3 font-display text-6xl tracking-wide uppercase sm:text-7xl">
            Custom <span className="text-flame">Order</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Tell us what you need — product, design, quantities — and we'll
            reply with pricing and delivery time.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <div className="flame-border rounded-2xl border border-border bg-card p-6 sm:p-10">
              {submitted ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <CheckCircle2 className="size-16 text-primary" />
                  <h2 className="mt-6 font-display text-4xl tracking-wider uppercase">
                    Inquiry Sent
                  </h2>
                  <p className="mt-3 max-w-md text-sm text-muted-foreground">
                    Thanks — we've noted your request for{" "}
                    <span className="font-semibold text-foreground">
                      {product}
                    </span>
                    . WhatsApp has opened with your inquiry — just press send and our
                    team will reply with a quote.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 rounded-full border border-border px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Name
                      <input
                        required
                        name="name"
                        placeholder="Your full name"
                        className={inputClasses}
                      />
                    </label>
                    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Phone / WhatsApp
                      <input
                        required
                        name="phone"
                        placeholder="Your contact number"
                        className={inputClasses}
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Product
                    <select
                      name="product"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      className={inputClasses}
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Quantity
                      <input
                        name="quantity"
                        type="number"
                        min={1}
                        placeholder="e.g. 25"
                        className={inputClasses}
                      />
                    </label>
                    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Needed By
                      <input
                        name="deadline"
                        type="date"
                        className={`${inputClasses} [color-scheme:dark]`}
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Design Details
                    <textarea
                      name="details"
                      rows={5}
                      placeholder="Colors, logo placement, names & numbers, fabric preference, sizes…"
                      className={`${inputClasses} resize-y`}
                    />
                  </label>

                  <button
                    type="submit"
                    className="shine mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-display text-xl tracking-[0.15em] uppercase text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <Send className="size-5" />
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </Reveal>

          {/* Side info */}
          <Reveal variant="right" delayMs={120} className="lg:col-span-2">
            <div className="grid h-full content-start gap-6">
              <div className="rounded-2xl border border-border bg-card p-8">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Flame className="size-6" />
                </span>
                <h2 className="mt-4 font-display text-3xl tracking-wider uppercase">
                  What Happens Next
                </h2>
                <ol className="mt-4 space-y-4 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-display text-2xl leading-none text-primary">
                      1
                    </span>
                    We review your design and confirm fabric, colors and
                    sizing.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-2xl leading-none text-primary">
                      2
                    </span>
                    You get a quote with price per piece and delivery time.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-2xl leading-none text-primary">
                      3
                    </span>
                    Approve a digital sample, then we cut, stitch and ship.
                  </li>
                </ol>
              </div>

              <div className="rounded-2xl border border-border bg-card p-8">
                <h2 className="font-display text-3xl tracking-wider uppercase">
                  Not Sure Yet?
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Browse the collection first — every product page links back
                  here with the item pre-noted.
                </p>
                <Link
                  to="/shop"
                  className="mt-5 inline-flex rounded-full border border-primary/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
