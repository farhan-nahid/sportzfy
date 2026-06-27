"use client";

import { Moon, Sun, Trophy, Tv2, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <div className="hidden items-center gap-1 rounded-full border border-white/8 bg-muted/30 px-3 py-1.5 text-muted-foreground text-xs sm:flex">
        <span className="w-[4.5rem] text-center font-mono font-semibold text-foreground">
          --:--:--
        </span>
        <span>Local</span>
      </div>
    );
  }

  const hh = time.getHours().toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");
  const ss = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-white/8 bg-muted/20 px-3 py-1.5 text-muted-foreground text-xs sm:flex">
      <span className="font-mono font-semibold text-foreground tabular-nums">
        {hh}:{mm}
        <span className="text-primary">:{ss}</span>
      </span>
      <span>Local</span>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-muted/20 transition-all duration-200 hover:border-primary/40 hover:bg-muted/40"
    >
      {/* Sun icon */}
      <Sun
        className={`absolute h-4 w-4 text-amber-400 transition-all duration-300 ${
          isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      {/* Moon icon */}
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-white/8 border-b bg-background/60 shadow-black/20 shadow-lg backdrop-blur-xl"
          : "border-transparent border-b bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo and Nav links */}
        <div className="flex shrink-0 items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center">
              {/* Icon container */}
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

          <nav className="hidden h-8 items-center gap-1.5 border-white/10 border-l pl-5 sm:flex">
            <Link
              href="/"
              className={`rounded-lg px-3 py-1.5 font-semibold text-xs tracking-wide transition-all ${
                pathname === "/"
                  ? "border border-primary/20 bg-primary/15 text-primary"
                  : "border border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              }`}
            >
              Live Channels
            </Link>
            <Link
              href="/world-cup"
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 font-semibold text-xs tracking-wide transition-all ${
                pathname === "/world-cup"
                  ? "border border-amber-500/25 bg-amber-500/15 text-amber-400"
                  : "border border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              World Cup 2026
            </Link>
          </nav>
        </div>

        {/* Center tagline */}
        <div className="hidden items-center gap-2 text-muted-foreground text-sm md:flex">
          <Zap className="h-4 w-4 text-primary" />
          <span>Live Sports. Any Country. Any Sport.</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Live badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="font-semibold text-red-400 text-xs">LIVE</span>
          </div>

          {/* Live clock */}
          <LiveClock />

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
