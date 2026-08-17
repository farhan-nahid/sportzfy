"use client";

import { Menu, Moon, Sun, Tv2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { href: "/", label: "All IPTV" },
  { href: "/live", label: "Live Sports" },
  { href: "/football", label: "Football" },
  { href: "/standings", label: "Point Table" },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-muted/20 transition-all duration-200 hover:border-primary/40 hover:bg-muted/40"
    >
      <Sun
        className={`absolute h-4 w-4 text-amber-400 transition-all duration-300 ${
          isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 text-primary transition-all duration-300 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        }`}
      />
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "border-white/8 border-b bg-background/70 shadow-black/20 shadow-lg backdrop-blur-xl"
          : "border-transparent border-b bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <div className="gradient-brand relative z-10 flex h-9 w-9 items-center justify-center rounded-xl shadow-lg">
                <Tv2 className="h-5 w-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-background bg-red-500">
                  <span className="live-pulse h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </div>
            </div>
            <span className="logo-text-shimmer font-bold text-xl tracking-tight transition-all group-hover:[animation-duration:1.5s]">
              Sportzfy
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden h-8 items-center gap-0.5 border-white/10 border-l pl-5 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 font-semibold text-xs tracking-wide transition-all ${
                  pathname === link.href
                    ? "border border-primary/20 bg-primary/15 text-primary"
                    : "border border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Live badge */}
          <Link
            href="/live"
            className="hidden items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 transition-colors hover:bg-red-500/15 min-[360px]:flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="font-semibold text-red-400 text-xs">LIVE</span>
          </Link>

          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-muted/20 text-foreground transition-all hover:bg-muted/30 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="border-white/8 border-t bg-background/95 backdrop-blur-lg md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-3 font-semibold text-sm transition-all ${
                  pathname === link.href
                    ? "border border-primary/20 bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/[0.06] pt-2">
              {[
                { href: "/channels", label: "📺 Channel Directory" },
                { href: "/blog", label: "📝 Blog" },
                { href: "/disclaimer", label: "⚠️ Disclaimer" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex rounded-xl px-4 py-2.5 text-muted-foreground text-sm transition-all hover:bg-muted/30 hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
