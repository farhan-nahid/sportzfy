"use client";

import { useEffect } from "react";
import { X, Signal } from "lucide-react";
import { type Channel, COUNTRIES, SPORTS } from "@/data/channels";
import StreamPlayer from "./StreamPlayer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlayerModalProps {
  channel: Channel;
  onClose: () => void;
}

const QUALITY_COLORS: Record<string, string> = {
  "4K": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  FHD: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  HD: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export default function PlayerModal({ channel, onClose }: PlayerModalProps) {
  const country = COUNTRIES.find((c) => c.code === channel.country);
  const sport = SPORTS.find((s) => s.value === channel.sport);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label={`Watching ${channel.name}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-3 min-w-0">
            {/* Channel logo */}
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0",
              "bg-primary/20 border border-primary/30"
            )}>
              {channel.logo.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-8 h-8 object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span>{channel.logo}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-foreground truncate">{channel.name}</h2>
                <Signal className="w-3 h-3 text-primary shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                {/* Live badge */}
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

          <button
            id="player-modal-close"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-muted/40 hover:bg-muted/70 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player */}
        <div className="p-4 sm:p-5">
          {channel.streamUrl ? (
            <StreamPlayer src={channel.streamUrl} channelName={channel.name} autoPlay />
          ) : (
            <div className="aspect-video flex items-center justify-center bg-muted/20 rounded-xl border border-white/5">
              <p className="text-sm text-muted-foreground">No stream URL available.</p>
            </div>
          )}
        </div>

        {/* Channel meta footer */}
        <div className="px-5 pb-5 flex flex-wrap items-center gap-2">
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

        {/* Disclaimer */}
        <div className="px-5 pb-4">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            Streams sourced from public IPTV playlists via iptv-org. Availability varies by region.
            Press <kbd className="font-mono bg-muted/30 px-1 rounded text-[9px]">Esc</kbd> to close.
          </p>
        </div>
      </div>
    </div>
  );
}
