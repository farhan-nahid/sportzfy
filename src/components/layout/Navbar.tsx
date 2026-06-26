"use client";

import { Tv2, Zap, Sun, Moon } from "lucide-react";
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
      <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-white/8">
        <span className="font-mono font-semibold text-foreground w-[4.5rem] text-center">
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
    <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-full border border-white/8">
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
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all duration-200 group overflow-hidden"
    >
      {/* Sun icon */}
      <Sun
        className={`absolute w-4 h-4 text-amber-400 transition-all duration-300 ${
          isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
        }`}
      />
      {/* Moon icon */}
      <Moon
        className={`absolute w-4 h-4 text-primary transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
        }`}
      />
    </button>
  );
}

export default function Navbar() {
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
          ? "border-b border-white/8 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/20"
          : "border-b border-transparent bg-transparent backdrop-blur-md"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex items-center justify-center w-9 h-9">
            {/* Icon container */}
            <div className="relative z-10 flex items-center justify-center w-9 h-9 rounded-xl gradient-brand shadow-lg">
              <Tv2 className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-background flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
              </span>
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight logo-text-shimmer group-hover:[animation-duration:1.5s] transition-all">
            Sportzfy
          </span>
        </a>

        {/* Center tagline */}
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="w-4 h-4 text-primary" />
          <span>Live Sports. Any Country. Any Sport.</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs font-semibold text-red-400">LIVE</span>
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
