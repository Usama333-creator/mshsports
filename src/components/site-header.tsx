import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logo from "@/assets/mashal-logo.jpg";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? "header-solid py-2" : pathname === "/" ? "theme-dark py-3" : "py-3"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group flex items-center">
          <img
            src={logo}
            alt="Mashal Olympics Sports Wear"
            width={220}
            height={110}
            className="h-16 w-auto rounded-lg transition-transform duration-300 group-hover:scale-105 sm:h-20"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-active={pathname === item.to}
              className="nav-link text-sm font-semibold tracking-wide uppercase text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="shine inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-[0_8px_30px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-transform duration-300 hover:scale-105"
          >
            Custom Order
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-lg border border-border text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="header-solid mt-3 flex flex-col gap-1 px-6 py-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-wide text-foreground/90 hover:bg-card hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
