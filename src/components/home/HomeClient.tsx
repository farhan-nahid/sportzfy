"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Search, X, Play, Tv, Trophy, ChevronDown, RefreshCw, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EzChannel, StreamServer, ChannelCategory } from "@/data/ezchannels";
import { CATEGORIES } from "@/data/ezchannels";

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

// ── Flag helper ────────────────────────────────────────────────────────────────

const COUNTRY_CODE: Record<string, string> = {
  MEX: "mx", RSA: "za", KOR: "kr", CZE: "cz", SUI: "ch", CAN: "ca",
  BIH: "ba", QAT: "qa", BRA: "br", MAR: "ma", SCO: "gb-sct", HAI: "ht",
  USA: "us", AUS: "au", PAR: "py", TUR: "tr", GER: "de", CIV: "ci",
  ECU: "ec", POR: "pt", ARG: "ar", FRA: "fr", ENG: "gb-eng", ESP: "es",
  ITA: "it", NED: "nl", BEL: "be", URU: "uy", JPN: "jp", COL: "co",
  SEN: "sn", DEN: "dk", POL: "pl", IRN: "ir",
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
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(channel)}
      onClick={() => onClick(channel)}
      className={cn(
        "ez-channel-card group relative rounded-2xl overflow-hidden cursor-pointer border",
        "bg-white/[0.04]",
        isPlaying
          ? "border-[#e94560]/60 shadow-lg shadow-[#e94560]/10"
          : "border-white/[0.06] hover:border-[#e94560]/40"
      )}
    >
      {/* Blurred logo backdrop */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={channel.logo}
          alt=""
          className="w-full h-full object-cover blur-xl scale-110"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      </div>

      {/* Card body */}
      <div className="relative p-4">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-16 h-16 rounded-xl object-cover bg-white/5 border border-white/10 group-hover:border-[#e94560]/30 transition-all shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23222'/%3E%3Ctext x='50%25' y='55%25' font-size='28' text-anchor='middle' fill='%23888'%3E📺%3C/text%3E%3C/svg%3E";
              }}
            />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#e94560] rounded-full border-2 border-black animate-pulse" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[15px] truncate group-hover:text-[#e94560] transition-colors mb-1.5">
              {channel.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#e94560]/10 text-[#e94560] font-medium border border-[#e94560]/20 capitalize">
                {channel.category}
              </span>
              <span className="text-xs text-gray-500 font-medium">{channel.quality}</span>
              {channel.servers.length > 1 && (
                <span className="text-xs text-gray-600 flex items-center gap-0.5">
                  <Server className="w-3 h-3" />
                  {channel.servers.length}
                </span>
              )}
            </div>
          </div>

          {/* Play button */}
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300",
              "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#e94560]/25",
              isPlaying
                ? "bg-[#e94560]"
                : "bg-gradient-to-br from-[#e94560] to-[#c73452]"
            )}
          >
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
    </div>
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

    load();
    return () => {
      destroyed = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [server]);

  return (
    <div className="w-full bg-black/60 border border-white/10 rounded-2xl overflow-hidden mb-6 animate-fade-in">
      {/* Player header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/8">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-7 h-7 rounded-lg object-cover border border-white/10"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
          <div>
            <p className="text-sm font-semibold text-white">{channel.name}</p>
            <p className="text-xs text-gray-400 capitalize">{channel.category}</p>
          </div>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e94560]/10 border border-[#e94560]/20 text-[10px] font-bold text-[#e94560]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] animate-pulse" />
            LIVE
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
          aria-label="Close player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Video / iframe */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">
          {server.type === "iframe" ? (
            <iframe
              src={server.url}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              style={{ border: "none" }}
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full bg-black"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>
      </div>

      {/* Server switcher */}
      {channel.servers.length > 1 && (
        <div className="px-4 py-3 bg-white/5 border-t border-white/8">
          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
            Servers
          </p>
          <div className="flex flex-wrap gap-2">
            {channel.servers.map((srv, i) => (
              <button
                key={i}
                onClick={() => onServerChange(i)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border whitespace-nowrap",
                  i === serverIdx
                    ? "bg-[#e94560] text-white border-[#e94560] shadow-md shadow-[#e94560]/30"
                    : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
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

// ── WC Standings mini panel ───────────────────────────────────────────────────

function WCStandingsPanel({ onClose }: { onClose: () => void }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/worldcup")
      .then((r) => r.json())
      .then((d) => setGroups(d.standings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-base font-bold">FIFA World Cup 2026</h2>
            <p className="text-gray-500 text-xs">Group Stage Standings</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map((group) => (
            <div
              key={group.name}
              className="bg-white/[0.04] border border-white/[0.06] rounded-xl overflow-hidden hover:border-yellow-500/30 transition-all"
            >
              {/* Group header */}
              <div className="bg-white/5 px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-500 font-bold text-xs">
                    {group.name.replace("Group ", "")}
                  </span>
                </div>
                <span className="font-semibold text-sm">{group.name}</span>
              </div>

              {/* Standings table */}
              <div className="p-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/5">
                      <th className="text-left pb-1.5 w-5">#</th>
                      <th className="text-left pb-1.5">Team</th>
                      <th className="text-center pb-1.5">P</th>
                      <th className="text-center pb-1.5">W</th>
                      <th className="text-center pb-1.5">D</th>
                      <th className="text-center pb-1.5">L</th>
                      <th className="text-center pb-1.5">GD</th>
                      <th className="text-center pb-1.5 font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.standings.map((t) => (
                      <tr key={t.team} className="border-b border-white/5 last:border-0">
                        <td className="py-1.5 text-gray-500">{t.rank}</td>
                        <td className="py-1.5">
                          <div className="flex items-center gap-1.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={flagUrl(t.code)}
                              alt={t.team}
                              className="w-4 h-3 object-cover rounded-sm"
                              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                            />
                            <span className="font-medium truncate max-w-[70px]">{t.team}</span>
                          </div>
                        </td>
                        <td className="py-1.5 text-center text-gray-400">{t.played}</td>
                        <td className="py-1.5 text-center text-gray-400">{t.won}</td>
                        <td className="py-1.5 text-center text-gray-400">{t.drawn}</td>
                        <td className="py-1.5 text-center text-gray-400">{t.lost}</td>
                        <td className={cn("py-1.5 text-center", t.goalDifference > 0 ? "text-green-500" : t.goalDifference < 0 ? "text-red-500" : "text-gray-400")}>
                          {t.goalDifference > 0 ? `+${t.goalDifference}` : t.goalDifference}
                        </td>
                        <td className="py-1.5 text-center font-bold text-white">{t.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ChannelSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] overflow-hidden animate-pulse p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded-full w-3/4" />
          <div className="flex gap-2">
            <div className="h-3 bg-white/8 rounded-full w-16" />
            <div className="h-3 bg-white/8 rounded-full w-10" />
          </div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/10 flex-shrink-0" />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface HomeClientProps {
  initialChannels: EzChannel[];
}

export default function HomeClient({ initialChannels }: HomeClientProps) {
  const [channels, setChannels] = useState<EzChannel[]>(initialChannels);
  const [loading, setLoading] = useState(initialChannels.length === 0);

  const [activeCategory, setActiveCategory] = useState<ChannelCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [activeChannel, setActiveChannel] = useState<EzChannel | null>(null);
  const [serverIdx, setServerIdx] = useState(0);

  const [showStandings, setShowStandings] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);

  // Fetch channels if SSR returned empty
  const fetchChannels = useCallback(async () => {
    try {
      const res = await fetch("/api/channels");
      if (!res.ok) return;
      const data = await res.json();
      setChannels(data.channels ?? []);
    } catch (err) {
      console.error("Failed to fetch channels:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialChannels.length === 0) fetchChannels();
  }, [fetchChannels, initialChannels.length]);

  // Filtered channels
  const filtered = useMemo(() => {
    let list =
      activeCategory === "all"
        ? channels
        : channels.filter((c) => c.category === activeCategory);

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.nowPlaying.toLowerCase().includes(q)
    );
  }, [channels, activeCategory, searchQuery]);

  const handlePlay = (ch: EzChannel) => {
    setActiveChannel(ch);
    setServerIdx(0);
    setShowStandings(false);
    // Scroll to player
    setTimeout(() => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
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
    <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* ── World Cup Toggle Button ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          id="wc-standings-btn"
          onClick={() => setShowStandings((v) => !v)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap",
            showStandings
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"
          )}
        >
          <Trophy className="w-4 h-4" />
          FIFA World Cup 2026 — Group Standings
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showStandings && "rotate-180")} />
        </button>

        <a
          href="/world-cup"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-white/8 bg-white/5 text-gray-400 hover:text-white hover:bg-white/8 whitespace-nowrap"
        >
          <Tv className="w-4 h-4" />
          WC Fixtures & Results
        </a>
      </div>

      {/* ── World Cup Standings Panel ───────────────────────────────────────── */}
      {showStandings && (
        <WCStandingsPanel onClose={() => setShowStandings(false)} />
      )}

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
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Tv className="w-5 h-5 text-[#e94560]" />
            Live TV
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {categoryCount} channel{categoryCount !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            id="channel-search"
            type="text"
            placeholder="Search channels…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-sm bg-white/5 border border-white/8 placeholder:text-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#e94560]/30 focus:border-[#e94560]/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Tabs ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-3 mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            id={`filter-${cat.value}`}
            onClick={() => setActiveCategory(cat.value as ChannelCategory | "all")}
            className={cn(
              "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
              activeCategory === cat.value
                ? "bg-[#e94560] text-white border-[#e94560] shadow-lg shadow-[#e94560]/20"
                : "bg-white/5 text-gray-400 border-white/[0.06] hover:text-white hover:bg-white/8"
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Channel Grid ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ChannelSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Tv className="w-14 h-14 text-gray-700" />
          <div>
            <h3 className="font-semibold text-white mb-1">No channels found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? `No results for "${searchQuery}".`
                : `No channels in this category right now.`}
            </p>
          </div>
          <button
            onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#e94560] text-white hover:bg-[#c73452] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Show all channels
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((ch, i) => (
            <div key={ch.id} className="card-enter" style={{ animationDelay: `${i * 40}ms` }}>
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
