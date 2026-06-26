"use client";

import { type Channel, COUNTRIES, SPORTS } from "@/data/channels";
import LiveBadge from "./LiveBadge";
import { Play, Signal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const QUALITY_COLORS: Record<string, string> = {
  "4K": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  FHD: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  HD: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

interface ChannelCardProps {
  channel: Channel;
  onWatch: (channel: Channel) => void;
  isActive?: boolean;
}

export default function ChannelCard({ channel, onWatch, isActive = false }: ChannelCardProps) {
  const country = COUNTRIES.find((c) => c.code === channel.country);
  const sport = SPORTS.find((s) => s.value === channel.sport);

  // Logo: URL image or emoji
  const logoIsUrl = channel.logo.startsWith("http");

  return (
    <div
      className={cn(
        "channel-card group relative flex flex-col rounded-2xl border bg-card overflow-hidden cursor-pointer",
        isActive
          ? "border-primary/60 shadow-lg shadow-primary/20"
          : channel.isLive
          ? "border-white/10"
          : "border-white/8"
      )}
      onClick={() => channel.isLive && onWatch(channel)}
    >
      {/* Card Header — thumbnail area */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden bg-gradient-to-br from-muted/60 via-muted/40 to-background">
        {/* Decorative background glow */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            channel.isLive
              ? "bg-gradient-to-br from-primary/10 via-transparent to-red-500/5"
              : "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
          )}
        />

        {/* Channel logo */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border overflow-hidden",
              channel.isLive
                ? "bg-primary/20 border-primary/30 group-hover:scale-110 transition-transform duration-300"
                : "bg-muted/50 border-white/8"
            )}
          >
            {logoIsUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.textContent = sport?.emoji ?? "📺";
                    parent.style.fontSize = "1.875rem";
                  }
                }}
              />
            ) : (
              <span className="text-3xl">{channel.logo}</span>
            )}
          </div>
          <span className="text-xs font-semibold text-muted-foreground/60 tracking-wide">
            {country?.flag} {channel.language}
          </span>
        </div>

        {/* Live badge top-left */}
        {channel.isLive && (
          <div className="absolute top-3 left-3">
            <LiveBadge viewers={channel.viewers} />
          </div>
        )}

        {/* Quality badge top-right */}
        <div
          className={cn(
            "absolute top-3 right-3 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border",
            QUALITY_COLORS[channel.quality]
          )}
        >
          {channel.quality}
        </div>

        {/* Not live overlay */}
        {!channel.isLive && (
          <div className="absolute inset-0 bg-background/40 flex items-end justify-center pb-3">
            <span className="text-xs text-muted-foreground/60 font-medium">
              Offline
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-2.5 p-4 flex-1">
        {/* Channel name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
            {channel.name}
          </h3>
          {channel.isLive && (
            <Signal className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          )}
        </div>

        {/* Current match */}
        {channel.currentMatch && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {channel.currentMatch}
          </p>
        )}

        {/* Footer tags */}
        <div className="flex items-center gap-1.5 mt-auto pt-1 flex-wrap">
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0.5 rounded-full border-white/10 text-muted-foreground bg-muted/20"
          >
            {sport?.emoji} {channel.sport}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0.5 rounded-full border-white/10 text-muted-foreground bg-muted/20"
          >
            {country?.flag} {country?.name}
          </Badge>
        </div>
      </div>

      {/* Watch button */}
      <div className="px-4 pb-4">
        <button
          id={`watch-${channel.id}`}
          disabled={!channel.isLive}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
            channel.isLive
              ? "gradient-brand text-white shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
              : "bg-muted/30 text-muted-foreground cursor-not-allowed"
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (channel.isLive) onWatch(channel);
          }}
        >
          {channel.isLive ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Watch Live
            </>
          ) : (
            "Not Available"
          )}
        </button>
      </div>
    </div>
  );
}
