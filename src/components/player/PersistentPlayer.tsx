"use client";

import { useEffect, useRef } from "react";
import {
  X,
  Minimize2,
  Maximize2,
  Signal,
} from "lucide-react";
import { type Channel, COUNTRIES, SPORTS } from "@/data/channels";
import StreamPlayer, { type StreamPlayerHandle } from "./StreamPlayer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlayerMode = "modal" | "mini";

interface PersistentPlayerProps {
  channel: Channel;
  mode: PlayerMode;
  onMinimize: () => void; // modal → mini
  onExpand: () => void;   // mini → modal
  onStop: () => void;     // fully stop (both modes)
}

// ─── Quality colours ──────────────────────────────────────────────────────────

const QUALITY_COLORS: Record<string, string> = {
  "4K": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  FHD: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  HD: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PersistentPlayer({
  channel,
  mode,
  onMinimize,
  onExpand,
  onStop,
}: PersistentPlayerProps) {
  const playerRef = useRef<StreamPlayerHandle>(null);
  const country = COUNTRIES.find((c) => c.code === channel.country);
  const sport = SPORTS.find((s) => s.value === channel.sport);
  const logoIsUrl = channel.logo.startsWith("http");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (mode === "modal") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mode]);

  // Esc key closes modal → mini
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mode === "modal") onMinimize();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, onMinimize]);

  const handleStop = () => {
    playerRef.current?.stop();
    onStop();
  };

  // ── MINI-PLAYER ─────────────────────────────────────────────────────────────
  if (mode === "mini") {
    return (
      <div
        className={cn(
          "fixed bottom-5 right-5 z-[200] w-72 rounded-2xl overflow-hidden",
          "border border-white/15 shadow-2xl shadow-black/60",
          "bg-card animate-in slide-in-from-bottom-4 fade-in duration-300"
        )}
      >
        {/* Mini header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/8">
          <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 overflow-hidden text-sm">
            {logoIsUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={channel.logo} alt="" className="w-5 h-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : channel.logo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-foreground truncate">{channel.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] text-red-400 font-bold uppercase tracking-wide">Live</span>
            </div>
          </div>
          {/* Expand */}
          <button
            id="mini-player-expand"
            onClick={onExpand}
            className="w-6 h-6 rounded-md bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
            title="Expand player"
          >
            <Maximize2 className="w-3 h-3 text-white/70" />
          </button>
          {/* Stop */}
          <button
            id="mini-player-stop"
            onClick={handleStop}
            className="w-6 h-6 rounded-md bg-white/8 hover:bg-red-500/30 flex items-center justify-center transition-colors"
            title="Stop stream"
          >
            <X className="w-3 h-3 text-white/70" />
          </button>
        </div>

        {/* Player — always show controls in mini mode */}
        <StreamPlayer
          ref={playerRef}
          src={channel.streamUrl ?? ""}
          channelName={channel.name}
          autoPlay
          alwaysShowControls
          className="rounded-none"
        />
      </div>
    );
  }

  // ── MODAL ────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onMinimize}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden",
          "border border-white/10 bg-card shadow-2xl shadow-black/60",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
        role="dialog"
        aria-modal="true"
        aria-label={`Watching ${channel.name}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 overflow-hidden">
              {logoIsUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={channel.logo} alt={channel.name} className="w-7 h-7 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <span className="text-lg">{channel.logo}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-foreground truncate">{channel.name}</h2>
                <Signal className="w-3 h-3 text-primary shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
                <span className={cn(
                  "text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border",
                  QUALITY_COLORS[channel.quality]
                )}>
                  {channel.quality}
                </span>
                {channel.viewers && (
                  <span className="text-[9px] text-muted-foreground">{channel.viewers} watching</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Minimize to mini-player */}
            <button
              id="player-modal-minimize"
              onClick={onMinimize}
              className="w-8 h-8 rounded-xl bg-muted/40 hover:bg-muted/70 flex items-center justify-center transition-colors"
              title="Minimize — keep playing"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            {/* Stop stream */}
            <button
              id="player-modal-stop"
              onClick={handleStop}
              className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/25 flex items-center justify-center transition-colors"
              title="Stop stream"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="p-4 sm:p-5">
          {channel.streamUrl ? (
            <StreamPlayer
              ref={playerRef}
              src={channel.streamUrl}
              channelName={channel.name}
              autoPlay
            />
          ) : (
            <div className="aspect-video flex items-center justify-center bg-muted/20 rounded-xl border border-white/5">
              <p className="text-sm text-muted-foreground">No stream URL available.</p>
            </div>
          )}
        </div>

        {/* Footer meta */}
        <div className="px-5 pb-4 flex flex-wrap items-center gap-2">
          {channel.currentMatch && (
            <p className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
              📺 {channel.currentMatch}
            </p>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            {sport && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full border-white/10 text-muted-foreground bg-muted/20">
                {sport.emoji} {channel.sport}
              </Badge>
            )}
            {country && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full border-white/10 text-muted-foreground bg-muted/20">
                {country.flag} {country.name}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 rounded-full border-white/10 text-muted-foreground bg-muted/20">
              🌐 {channel.language}
            </Badge>
          </div>
        </div>

        {/* Hint */}
        <div className="px-5 pb-4">
          <p className="text-[10px] text-muted-foreground/40 text-center">
            Click <kbd className="font-mono bg-muted/30 px-1 rounded text-[9px]">−</kbd> to minimize and keep the stream playing in the corner.
            Press <kbd className="font-mono bg-muted/30 px-1 rounded text-[9px]">Esc</kbd> or click outside to minimize.
          </p>
        </div>
      </div>
    </div>
  );
}
