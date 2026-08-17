"use client";

import { Play, RefreshCw, Search, Server, Tv, WifiOff, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import ChannelLogo from "@/components/shared/ChannelLogo";
import { cn } from "@/lib/utils";

interface IptvStream {
  url: string;
  quality: string | null;
  label: string | null;
}

interface IptvChannel {
  id: string;
  name: string;
  logo: string;
  country: string;
  categories: string[];
  website: string | null;
  streams: IptvStream[];
}

const CATEGORY_TABS = [
  { value: "all", label: "All Channels", icon: "📺" },
  { value: "sports", label: "Sports", icon: "⚽" },
  { value: "news", label: "News", icon: "📰" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "movies", label: "Movies", icon: "🎥" },
  { value: "kids", label: "Kids", icon: "🧒" },
];

const FLAG_CDN = (code: string) => `https://flagcdn.com/32x24/${code.toLowerCase()}.png`;

// ── Channel Card ──────────────────────────────────────────────────────────────

function ChannelCard({
  channel,
  isPlaying,
  onClick,
}: {
  channel: IptvChannel;
  isPlaying: boolean;
  onClick: (ch: IptvChannel) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(channel)}
      className={cn(
        "ez-channel-card group relative block w-full cursor-pointer overflow-hidden rounded-2xl border text-left transition-all",
        "bg-white/[0.04]",
        isPlaying
          ? "border-primary/60 shadow-lg shadow-primary/10"
          : "border-white/[0.06] hover:border-primary/40 hover:bg-white/[0.06]",
      )}
    >
      {/* Blurred logo backdrop */}
      {channel.logo && (
        <div className="pointer-events-none absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
          <Image
            src={channel.logo}
            alt=""
            fill
            unoptimized
            className="scale-110 object-cover blur-xl"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        </div>
      )}

      {/* Card body */}
      <div className="relative p-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            <ChannelLogo
              logo={channel.logo}
              name={channel.name}
              category={channel.categories[0]}
              size="md"
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 z-10 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-background bg-primary" />
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate font-semibold text-sm transition-colors group-hover:text-primary">
              {channel.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {channel.country && (
                <Image
                  src={FLAG_CDN(channel.country)}
                  alt={channel.country}
                  width={14}
                  height={10}
                  style={{ width: "auto", height: "auto" }}
                  unoptimized
                  className="rounded-sm"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              )}
              {channel.categories[0] && (
                <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary capitalize">
                  {channel.categories[0]}
                </span>
              )}
              {channel.streams.length > 1 && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Server className="h-2.5 w-2.5" />
                  {channel.streams.length}
                </span>
              )}
            </div>
          </div>

          {/* Play button */}
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300",
              "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/25",
              isPlaying
                ? "bg-primary text-primary-foreground"
                : "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
            )}
          >
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Inline HLS Player ──────────────────────────────────────────────────────────

function InlinePlayer({
  channel,
  streamIdx,
  onStreamChange,
  onClose,
}: {
  channel: IptvChannel;
  streamIdx: number;
  onStreamChange: (i: number) => void;
  onClose: () => void;
}) {
  const stream = channel.streams[streamIdx];
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  useEffect(() => {
    if (!stream?.url) return;
    const video = videoRef.current;
    if (!video) return;

    let destroyed = false;

    async function load() {
      const { default: Hls } = await import("hls.js");
      if (destroyed || !video || !stream?.url) return;

      if (Hls.isSupported()) {
        hlsRef.current?.destroy();
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(stream.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream.url;
        video.play().catch(() => {});
      }
    }

    void load();
    return () => {
      destroyed = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [stream]);

  return (
    <div className="mb-6 w-full animate-fade-in overflow-hidden rounded-2xl border border-white/10 bg-black/60">
      {/* Player header */}
      <div className="flex items-center justify-between border-white/10 border-b bg-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          {channel.logo ? (
            <Image
              src={channel.logo}
              alt={channel.name}
              width={28}
              height={28}
              unoptimized
              className="h-7 w-7 rounded-lg border border-white/10 object-contain p-0.5"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          ) : (
            <Tv className="h-5 w-5 text-primary" />
          )}
          <div>
            <p className="font-semibold text-foreground text-sm">{channel.name}</p>
            <p className="text-muted-foreground text-xs capitalize">
              {channel.categories[0] ?? "IPTV"}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-bold text-[10px] text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            LIVE
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          aria-label="Close player"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Video */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full bg-black"
            controls
            autoPlay
            playsInline
          />
        </div>
      </div>

      {/* Server switcher */}
      {channel.streams.length > 1 && (
        <div className="border-white/10 border-t bg-white/5 px-4 py-3">
          <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Servers
          </p>
          <div className="flex flex-wrap gap-2">
            {channel.streams.map((s, i) => (
              <button
                type="button"
                key={`${s.url}-${i}`}
                onClick={() => onStreamChange(i)}
                className={cn(
                  "whitespace-nowrap rounded-lg border px-3 py-1.5 font-medium text-xs transition-all",
                  i === streamIdx
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
                )}
              >
                Server {i + 1}
                {s.quality ? ` · ${s.quality}` : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ChannelSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] p-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-full bg-white/10" />
          <div className="flex gap-2">
            <div className="h-3 w-16 rounded-full bg-white/8" />
            <div className="h-3 w-10 rounded-full bg-white/8" />
          </div>
        </div>
        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function HomeClient() {
  const [channels, setChannels] = useState<IptvChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeChannel, setActiveChannel] = useState<IptvChannel | null>(null);
  const [streamIdx, setStreamIdx] = useState(0);

  const playerRef = useRef<HTMLDivElement>(null);

  async function load(cat = activeCategory) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/channels?category=${encodeURIComponent(cat)}&limit=200`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setChannels(data.channels ?? []);
    } catch {
      setError("Could not load IPTV channels. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(activeCategory);
  }, [activeCategory]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return channels;
    const q = searchQuery.toLowerCase();
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.categories.some((cat) => cat.toLowerCase().includes(q)),
    );
  }, [channels, searchQuery]);

  const handlePlay = (ch: IptvChannel) => {
    setActiveChannel(ch);
    setStreamIdx(0);
    setTimeout(
      () => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };

  const handleClose = () => {
    setActiveChannel(null);
    setStreamIdx(0);
  };

  return (
    <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Inline Player ──────────────────────────────────────────────────── */}
      <div ref={playerRef}>
        {activeChannel && (
          <InlinePlayer
            channel={activeChannel}
            streamIdx={streamIdx}
            onStreamChange={setStreamIdx}
            onClose={handleClose}
          />
        )}
      </div>

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Tv className="h-5 w-5 text-primary" />
            Live TV Channels
          </h2>
          {!loading && (
            <p className="mt-0.5 text-muted-foreground text-xs">
              {filtered.length.toLocaleString()} channel{filtered.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="channel-search"
            type="text"
            placeholder="Search channels…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 pr-8 pl-9 text-foreground text-sm transition-all placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-2.5 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Tabs ────────────────────────────────────────────── */}
      <div className="scrollbar-hide mb-5 flex items-center gap-2 overflow-x-auto pb-3">
        {CATEGORY_TABS.map((cat) => (
          <button
            type="button"
            key={cat.value}
            id={`filter-${cat.value}`}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-4 py-2 font-medium text-sm transition-all",
              activeCategory === cat.value
                ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border-white/[0.06] bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground",
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Channel Grid ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }, (_, i) => `channel-skeleton-${i}`).map((id) => (
            <ChannelSkeleton key={id} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 py-16 text-center">
          <WifiOff className="h-12 w-12 text-red-400/60" />
          <div>
            <h3 className="font-semibold text-foreground">Connection Error</h3>
            <p className="mt-1 text-muted-foreground text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => load(activeCategory)}
            className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <Tv className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <h3 className="mb-1 font-semibold text-foreground">No channels found</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery
                ? `No results for "${searchQuery}".`
                : `No channels in this category right now.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-2 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:opacity-90"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Show all channels
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((ch, i) => (
            <div
              key={ch.id}
              className="card-enter"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <ChannelCard
                channel={ch}
                isPlaying={activeChannel?.id === ch.id}
                onClick={handlePlay}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
