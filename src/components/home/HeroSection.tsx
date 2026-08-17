"use client";

import { cn } from "@/lib/utils";

const STATS = [
  { icon: "📺", label: "Live Channels", value: "1,000+" },
  { icon: "🌍", label: "Countries", value: "150+" },
  { icon: "⚡", label: "HD Quality", value: "Free" },
  { icon: "📡", label: "Always On", value: "24/7" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-white/[0.06] border-b">
      {/* Animated mesh bg */}
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-1 absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="orb-2 absolute top-0 -right-32 h-72 w-72 rounded-full bg-primary/6 blur-3xl" />
        <div className="orb-3 absolute -bottom-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Top badge */}
        <div className="mb-5 flex animate-fade-up items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-bold text-[11px] text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            LIVE NOW
          </span>
          <span className="text-muted-foreground text-xs">
            Free IPTV • No Registration
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up font-bold text-3xl tracking-tight delay-100 sm:text-4xl lg:text-5xl">
          <span className="text-gradient-brand">Free Live IPTV</span>
          <br />
          <span className="text-foreground/90">Watch Any Channel, Anywhere</span>
        </h1>

        <p className="mt-4 max-w-lg animate-fade-up text-muted-foreground text-sm leading-relaxed delay-200 sm:text-base">
          Stream thousands of live TV channels in HD — sports, football, news, movies, and
          entertainment from 150+ countries. No subscription, no sign-up.
        </p>

        {/* Stats row */}
        <div className="mt-8 flex animate-fade-up flex-wrap gap-4 delay-300">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5",
                "backdrop-blur-sm",
              )}
            >
              <span className="text-lg">{stat.icon}</span>
              <div>
                <p className="font-bold text-foreground text-sm leading-none">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category pills */}
        <div className="mt-6 flex animate-fade-up flex-wrap gap-2 delay-400">
          {[
            "⚽ Football",
            "🏏 Cricket",
            "📺 News",
            "🎬 Movies",
            "🎵 Music",
            "🌍 International",
          ].map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-muted-foreground text-xs"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Scrolling marquee notice */}
        <div className="mt-6 animate-fade-up overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 delay-500">
          <div className="marquee-container">
            <div className="marquee-track" style={{ animationDuration: "30s" }}>
              {[
                "📡 All streams are publicly available",
                "🔴 Live sports streaming 24/7",
                "📺 1000+ channels available",
                "🌍 Watch from anywhere",
                "⚡ HD quality streams",
                "📡 All streams are publicly available",
                "🔴 Live sports streaming 24/7",
                "📺 1000+ channels available",
                "🌍 Watch from anywhere",
                "⚡ HD quality streams",
              ].map((text, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static marquee items
                <span key={i} className="marquee-item px-6 text-muted-foreground text-xs">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
