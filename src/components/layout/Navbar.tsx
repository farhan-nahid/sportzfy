"use client";

import { Tv2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time immediately on mount (client only)
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    // SSR placeholder — avoids hydration mismatch
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
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl gradient-brand shadow-lg">
            <Tv2 className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-background flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white live-pulse" />
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient-brand">
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
        </div>
      </div>
    </header>
  );
}
