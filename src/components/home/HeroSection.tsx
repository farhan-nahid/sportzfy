"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  value: string | number;
  color: string;
  suffix?: string;
}

function AnimatedStat({ stat, delay }: { stat: StatItem; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div ref={ref} className="flex items-center gap-1.5">
      <span
        className={`text-xl font-extrabold ${stat.color} stat-pop`}
        style={{ animationDelay: `${delay}ms`, animationPlayState: visible ? "running" : "paused" }}
      >
        {stat.value}{stat.suffix ?? ""}
      </span>
      <span className="text-sm text-muted-foreground">{stat.label}</span>
    </div>
  );
}

interface HeroProps {
  liveCount: number;
  totalChannels: number;
}

export default function HeroSection({ liveCount, totalChannels }: HeroProps) {
  return (
    <div className="relative overflow-hidden border-b border-white/5">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-bg pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="orb-1 absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.22 274 / 40%) 0%, transparent 70%)",
          }}
        />
        <div
          className="orb-2 absolute top-10 right-10 w-60 h-60 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.6 0.2 220 / 50%) 0%, transparent 70%)",
          }}
        />
        <div
          className="orb-3 absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.22 27 / 40%) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(oklch(1 0 0) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
        <div className="max-w-2xl">
          {/* Live badge */}
          <div className="animate-fade-up delay-0 inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs font-semibold text-red-400 tracking-wide">
              Streaming Live Now
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            <span className="animate-fade-up delay-100 block text-gradient-brand">
              Live Sports,
            </span>
            <span className="animate-fade-up delay-200 block text-foreground">
              Anywhere. Anytime.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-300 text-muted-foreground text-base md:text-lg leading-relaxed">
            Stream cricket, football, basketball, tennis and more {" "}
            <span className="text-foreground/70 font-medium">
              Click any channel to watch instantly.
            </span>
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-5 mt-6">
            {[
              { label: "Live Now",  value: liveCount || "…", color: "text-red-400",     delay: 400 },
              { label: "Countries", value: "10+",             color: "text-primary",     delay: 500 },
              { label: "Sports",    value: "10",              color: "text-emerald-400", delay: 600 },
              { label: "Channels",  value: totalChannels || "…", color: "text-amber-400", delay: 700 },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span
                  className={`text-2xl font-extrabold ${s.color} stat-pop`}
                  style={{ animationDelay: `${s.delay}ms` }}
                >
                  {s.value}
                </span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Divider glow line */}
          <div
            className="animate-fade-in delay-800 mt-8 h-px w-full max-w-sm"
            style={{
              background:
                "linear-gradient(to right, oklch(0.65 0.22 274 / 60%), oklch(0.6 0.2 220 / 30%), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
