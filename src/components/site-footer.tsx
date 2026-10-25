import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { categories } from "@/lib/catalog";
import { site, whatsappLink } from "@/lib/site";
import logo from "@/assets/mashal-logo.jpg";

export function SiteFooter() {
  return (
    <footer className="theme-dark border-t-4 border-primary bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <img
            src={logo}
            alt="Mashal Olympics Sports Wear"
            width={220}
            height={110}
            loading="lazy"
            className="h-20 w-auto rounded-lg"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Custom sportswear and martial arts uniforms — stitched, sublimated
            and finished to your team's design.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <MessageCircle className="size-4" />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="Email"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-[0.18em] uppercase text-foreground">
            Shop
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="transition-colors hover:text-primary">
                All Products
              </Link>
            </li>
            {categories.slice(0, 4).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-[0.18em] uppercase text-foreground">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="transition-colors hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="transition-colors hover:text-primary"
              >
                Custom Orders
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition-colors hover:text-primary">
                Team &amp; Club Quotes
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg tracking-[0.18em] uppercase text-foreground">
            Get a Quote
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Send us your design, logo or team list and we'll come back with
            pricing and delivery time.
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-transform duration-300 hover:scale-105"
          >
            <Phone className="size-4" />
            Start Inquiry
          </Link>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs tracking-wide text-muted-foreground">
        © {new Date().getFullYear()} Mashal Olympics Sports Wear. All rights
        reserved.
      </div>
    </footer>
  );
}
