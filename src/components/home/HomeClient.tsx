"use client";

import { Play, RefreshCw, Search, Server, Tv, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChannelCategory, EzChannel } from "@/data/ezchannels";
import { CATEGORIES, EZ_CHANNELS } from "@/data/ezchannels";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface GroupTeam {
  rank: number;
  team: string;
  code: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface Group {
  name: string;
  standings: GroupTeam[];
}

const COUNTRY_CODE: Record<string, string> = {
  MEX: "mx",
  RSA: "za",
  KOR: "kr",
  CZE: "cz",
  SUI: "ch",
  CAN: "ca",
  BIH: "ba",
  QAT: "qa",
  BRA: "br",
  MAR: "ma",
  SCO: "gb-sct",
  HAI: "ht",
  USA: "us",
  AUS: "au",
  PAR: "py",
  TUR: "tr",
  GER: "de",
  CIV: "ci",
  ECU: "ec",
  POR: "pt",
  ARG: "ar",
  FRA: "fr",
  ENG: "gb-eng",
  ESP: "es",
  ITA: "it",
  NED: "nl",
  BEL: "be",
  URU: "uy",
  JPN: "jp",
  COL: "co",
  SEN: "sn",
  DEN: "dk",
  POL: "pl",
  IRN: "ir",
  SWE: "se",
  NZL: "nz",
  GHA: "gh",
  HON: "hn",
  CHI: "cl",
  GBR: "gb",
  OMA: "om",
  CMR: "cm",
  CRC: "cr",
  NGA: "ng",
  CHN: "cn",
  IRQ: "iq",
  NOR: "no",
  KSA: "sa",
  AUT: "at",
  TUN: "tn",
  PAN: "pa",
  UKR: "ua",
  PER: "pe",
  EGY: "eg",
  ROU: "ro",
  FIN: "fi",
  HUN: "hu",
  SVN: "si",
  SVK: "sk",
  GEO: "ge",
  ALB: "al",
  ALG: "dz",
  CIV2: "ci",
  COD: "cd",
  CPV: "cv",
  JOR: "jo",
  UZB: "uz",
  CRO: "hr",
  VEN: "ve",
  BOL: "bo",
  CUW: "cw",
};

function flagUrl(code: string): string {
  const iso = COUNTRY_CODE[code?.toUpperCase()] || code?.toLowerCase();
  return `https://flagcdn.com/w40/${iso}.png`;
}

// ── Channel Card ──────────────────────────────────────────────────────────────

function ChannelCard({
  channel,
  isPlaying,
  onClick,
}: {
  channel: EzChannel;
  isPlaying: boolean;
  onClick: (ch: EzChannel) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(channel)}
      className={cn(
        "ez-channel-card group relative block w-full cursor-pointer overflow-hidden rounded-2xl border text-left",
        "bg-white/[0.04]",
        isPlaying
          ? "border-[#e94560]/60 shadow-[#e94560]/10 shadow-lg"
          : "border-white/[0.06] hover:border-[#e94560]/40",
      )}
    >
      {/* Blurred logo backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
        <Image
          src={channel.logo}
          alt=""
          fill
          unoptimized
          loading="eager"
          className="scale-110 object-cover blur-xl"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      </div>

      {/* Card body */}
      <div className="relative p-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            <Image
              src={channel.logo}
              alt={channel.name}
              width={64}
              height={64}
              unoptimized
              loading="eager"
              className="h-16 w-16 rounded-xl border border-white/10 bg-white/5 object-cover shadow-lg transition-all group-hover:border-[#e94560]/30"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23222'/%3E%3Ctext x='50%25' y='55%25' font-size='28' text-anchor='middle' fill='%23888'%3E📺%3C/text%3E%3C/svg%3E";
              }}
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-black bg-[#e94560]" />
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="mb-1.5 truncate font-semibold text-[15px] transition-colors group-hover:text-[#e94560]">
              {channel.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#e94560]/20 bg-[#e94560]/10 px-2 py-0.5 font-medium text-[#e94560] text-xs capitalize">
                {channel.category}
              </span>
              <span className="font-medium text-gray-500 text-xs">{channel.quality}</span>
              {channel.servers.length > 1 && (
                <span className="flex items-center gap-0.5 text-gray-600 text-xs">
                  <Server className="h-3 w-3" />
                  {channel.servers.length}
                </span>
              )}
            </div>
          </div>

          {/* Play button */}
          <div
            className={cn(
              "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300",
              "group-hover:scale-110 group-hover:shadow-[#e94560]/25 group-hover:shadow-lg",
              isPlaying
                ? "bg-[#e94560]"
                : "bg-gradient-to-br from-[#e94560] to-[#c73452]",
            )}
          >
            <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Inline HLS / iframe Player ────────────────────────────────────────────────

function InlinePlayer({
  channel,
  serverIdx,
  onServerChange,
  onClose,
}: {
  channel: EzChannel;
  serverIdx: number;
  onServerChange: (i: number) => void;
  onClose: () => void;
}) {
  const server = channel.servers[serverIdx];
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  useEffect(() => {
    if (server.type !== "hls") return;
    const video = videoRef.current;
    if (!video) return;

    let destroyed = false;

    async function load() {
      // Dynamic import so HLS.js is only loaded client-side
      const { default: Hls } = await import("hls.js");
      if (destroyed || !video) return;

      if (Hls.isSupported()) {
        hlsRef.current?.destroy();
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(server.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = server.url;
        video.play().catch(() => {});
      }
    }

    void load();
    return () => {
      destroyed = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [server]);

  return (
    <div className="mb-6 w-full animate-fade-in overflow-hidden rounded-2xl border border-white/10 bg-black/60">
      {/* Player header */}
      <div className="flex items-center justify-between border-white/8 border-b bg-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={channel.logo}
            alt={channel.name}
            width={28}
            height={28}
            unoptimized
            className="h-7 w-7 rounded-lg border border-white/10 object-cover"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
          <div>
            <p className="font-semibold text-sm text-white">{channel.name}</p>
            <p className="text-gray-400 text-xs capitalize">{channel.category}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-[#e94560]/20 bg-[#e94560]/10 px-2 py-0.5 font-bold text-[#e94560] text-[10px]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e94560]" />
            LIVE
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close player"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Video / iframe */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">
          {server.type === "iframe" ? (
            server.url.includes("ezshomadhan.com") ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-black/80 px-6 text-center">
                <Tv className="mb-3 h-12 w-12 animate-pulse text-[#e94560]" />
                <h3 className="mb-1 font-semibold text-base text-white">
                  Direct Access Stream
                </h3>
                <p className="mb-4 max-w-sm text-gray-400 text-xs leading-relaxed">
                  Toffee requires direct browser authentication and cannot be embedded.
                  Click below to launch the live stream in a new tab.
                </p>
                <a
                  href={server.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#e94560] to-[#ff6b8b] px-5 py-2.5 font-bold text-sm text-white shadow-[#e94560]/30 shadow-lg transition-all hover:scale-105 hover:shadow-[#e94560]/40 hover:shadow-xl"
                >
                  <span>Launch Stream</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>
            ) : (
              <iframe
                src={server.url}
                title="Live Channel Stream"
                className="h-full w-full"
                allowFullScreen
                allow="autoplay; fullscreen"
                style={{ border: "none" }}
              />
            )
          ) : (
            <video
              ref={videoRef}
              className="h-full w-full bg-black"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>
      </div>

      {server.type === "iframe" && (
        <div className="flex items-center justify-between gap-4 border-white/8 border-t bg-white/5 px-4 py-3">
          <p className="text-gray-400 text-xs">
            This server uses an external frame. If the player remains blank, open it
            directly in a new tab:
          </p>
          <a
            href={server.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white text-xs transition-colors hover:bg-white/20"
          >
            Open Stream ↗
          </a>
        </div>
      )}

      {/* Server switcher */}
      {channel.servers.length > 1 && (
        <div className="border-white/8 border-t bg-white/5 px-4 py-3">
          <p className="mb-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
            Servers
          </p>
          <div className="flex flex-wrap gap-2">
            {channel.servers.map((srv, i) => (
              <button
                type="button"
                key={`${srv.name}-${srv.url}-${i}`}
                onClick={() => onServerChange(i)}
                className={cn(
                  "whitespace-nowrap rounded-lg border px-3 py-1.5 font-medium text-xs transition-all",
                  i === serverIdx
                    ? "border-[#e94560] bg-[#e94560] text-white shadow-[#e94560]/30 shadow-md"
                    : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white",
                )}
              >
                {srv.name}
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
        <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-full bg-white/10" />
          <div className="flex gap-2">
            <div className="h-3 w-16 rounded-full bg-white/8" />
            <div className="h-3 w-10 rounded-full bg-white/8" />
          </div>
        </div>
        <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface HomeClientProps {
  initialChannels: EzChannel[];
}

export default function HomeClient({ initialChannels }: HomeClientProps) {
  const [channels, setChannels] = useState<EzChannel[]>(initialChannels || EZ_CHANNELS);
  const [loading, setLoading] = useState(false);

  const [activeCategory, setActiveCategory] = useState<ChannelCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeChannel, setActiveChannel] = useState<EzChannel | null>(null);
  const [serverIdx, setServerIdx] = useState(0);

  const playerRef = useRef<HTMLDivElement>(null);

  // Filtered channels
  const filtered = useMemo(() => {
    const list =
      activeCategory === "all"
        ? channels
        : channels.filter((c) => c.category === activeCategory);

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.nowPlaying.toLowerCase().includes(q),
    );
  }, [channels, activeCategory, searchQuery]);

  const handlePlay = (ch: EzChannel) => {
    setActiveChannel(ch);
    setServerIdx(0);
    // Scroll to player
    setTimeout(
      () => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50,
    );
  };

  const handleClose = () => {
    setActiveChannel(null);
    setServerIdx(0);
  };

  const totalCount = channels.length;
  const categoryCount =
    activeCategory === "all"
      ? totalCount
      : channels.filter((c) => c.category === activeCategory).length;

  return (
    <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      {/* ── Inline Player ──────────────────────────────────────────────────── */}
      <div ref={playerRef}>
        {activeChannel && (
          <InlinePlayer
            channel={activeChannel}
            serverIdx={serverIdx}
            onServerChange={setServerIdx}
            onClose={handleClose}
          />
        )}
      </div>

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Tv className="h-5 w-5 text-[#e94560]" />
            Live TV
          </h2>
          <p className="mt-0.5 text-gray-500 text-xs">
            {categoryCount} channel{categoryCount !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            id="channel-search"
            type="text"
            placeholder="Search channels…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-white/5 py-2 pr-8 pl-9 text-sm text-white transition-all placeholder:text-gray-600 focus:border-[#e94560]/30 focus:outline-none focus:ring-2 focus:ring-[#e94560]/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-2.5 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Tabs ────────────────────────────────────────────── */}
      <div className="scrollbar-hide mb-5 flex items-center gap-2 overflow-x-auto pb-3">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat.value}
            id={`filter-${cat.value}`}
            onClick={() => setActiveCategory(cat.value as ChannelCategory | "all")}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-5 py-2.5 font-medium text-sm transition-all",
              activeCategory === cat.value
                ? "border-[#e94560] bg-[#e94560] text-white shadow-[#e94560]/20 shadow-lg"
                : "border-white/[0.06] bg-white/5 text-gray-400 hover:bg-white/8 hover:text-white",
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
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <Tv className="h-14 w-14 text-gray-700" />
          <div>
            <h3 className="mb-1 font-semibold text-white">No channels found</h3>
            <p className="text-gray-500 text-sm">
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
            className="mt-2 flex items-center gap-2 rounded-xl bg-[#e94560] px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-[#c73452]"
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
              style={{ animationDelay: `${i * 40}ms` }}
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
