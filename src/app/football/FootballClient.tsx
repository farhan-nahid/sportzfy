"use client";

import { Loader2, RefreshCw, WifiOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { StreamedMatch } from "@/lib/streamed";
import { formatMatchTime, isMatchLive } from "@/lib/streamed";
import { cn } from "@/lib/utils";

const STREAMED_BASE = "https://streamed.pk";

const LEAGUES = [
  { name: "All", flag: "🌍", searchKey: null },
  { name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", searchKey: "premier" },
  { name: "La Liga", flag: "🇪🇸", searchKey: "la liga" },
  { name: "Serie A", flag: "🇮🇹", searchKey: "serie a" },
  { name: "Bundesliga", flag: "🇩🇪", searchKey: "bundesliga" },
  { name: "Ligue 1", flag: "🇫🇷", searchKey: "ligue 1" },
  { name: "Champions League", flag: "🏆", searchKey: "champions" },
  { name: "MLS", flag: "🇺🇸", searchKey: "mls" },
];

async function loadFootballData(): Promise<StreamedMatch[]> {
  const res = await fetch("/api/sports?endpoint=football");
  if (res.ok) {
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
  }
  return [];
}

function getMatchPoster(match: StreamedMatch): string | null {
  if (match.poster) return match.poster;
  return null;
}

function getPosterUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${STREAMED_BASE}${path}`;
}

function TeamBadge({
  badge,
  name,
  size = 28,
}: {
  badge?: string | null;
  name: string;
  size?: number;
}) {
  const [err, setErr] = useState(false);
  if (!badge || err) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-white/10 font-black text-white/80"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <Image
      src={badge}
      alt={name}
      width={size}
      height={size}
      className="object-contain"
      onError={() => setErr(true)}
      unoptimized
    />
  );
}

function MatchCard({ match }: { match: StreamedMatch }) {
  const live = isMatchLive(match);
  const poster = getMatchPoster(match);
  const href = `/match/${match.id}`;
  const time = formatMatchTime(match.date);

  const homeTeam = match.teams?.home;
  const awayTeam = match.teams?.away;

  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04] transition-all duration-200 hover:border-green-500/30 hover:bg-white/[0.07] hover:-translate-y-0.5">
        {/* Poster */}
        <div className="relative aspect-video w-full overflow-hidden bg-black/60">
          {poster ? (
            <img
              src={getPosterUrl(poster)}
              alt={match.title}
              className="size-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 25% 25%, rgba(34,197,94,0.35), transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(16,185,129,0.25), transparent 50%),
                  linear-gradient(135deg, #050d08, #0a1a10)`,
              }}
            >
              {homeTeam && awayTeam ? (
                <div className="flex items-center gap-3">
                  <TeamBadge badge={homeTeam.badge} name={homeTeam.name} size={36} />
                  <span className="font-black text-white/50 text-sm">VS</span>
                  <TeamBadge badge={awayTeam.badge} name={awayTeam.name} size={36} />
                </div>
              ) : (
                <span className="text-3xl">⚽</span>
              )}
            </div>
          )}

          {/* Live / time badge */}
          <span
            className={cn(
              "absolute right-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-black uppercase text-white",
              live ? "bg-red-500" : "bg-black/65",
            )}
          >
            {live ? "Live" : time}
          </span>

          {/* Popular star */}
          {match.popular && (
            <span className="absolute left-2 top-2 rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-black text-black">
              ⭐
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="line-clamp-2 font-black text-sm text-white transition group-hover:text-green-300">
            {match.title}
          </h3>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-[11px] font-semibold">
              Football
            </span>
            <span
              className={cn(
                "text-[11px] font-bold",
                live ? "text-red-400" : "text-slate-500",
              )}
            >
              {live ? "🔴 Live" : time}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DateGroup({
  label,
  matches,
  eventCount,
}: {
  label: string;
  matches: StreamedMatch[];
  eventCount: number;
}) {
  return (
    <section className="grid gap-5 md:grid-cols-[110px_minmax(0,1fr)]">
      <div className="text-center md:text-right">
        <p className="font-black text-lg text-white">{label}</p>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          {eventCount} event{eventCount !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid gap-x-4 gap-y-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </section>
  );
}

export default function FootballClient() {
  const [matches, setMatches] = useState<StreamedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await loadFootballData();
      setMatches(data);
      if (data.length === 0) {
        setError("No football fixtures found right now. Try refreshing.");
      }
    } catch {
      setError("Could not load football fixtures. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const interval = setInterval(load, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredMatches = useMemo(() => {
    if (!selectedLeague) return matches;
    const key = selectedLeague.toLowerCase();
    return matches.filter((m) => {
      const league = (m.league || "").toLowerCase();
      const title = (m.title || "").toLowerCase();
      const home = (m.teams?.home?.name || "").toLowerCase();
      const away = (m.teams?.away?.name || "").toLowerCase();
      return (
        league.includes(key) ||
        title.includes(key) ||
        home.includes(key) ||
        away.includes(key)
      );
    });
  }, [matches, selectedLeague]);

  const liveCount = useMemo(
    () => filteredMatches.filter((m) => isMatchLive(m)).length,
    [filteredMatches],
  );

  // Group by day, with live matches shown first within each day
  const groupedByDay = useMemo(() => {
    const sorted = [...filteredMatches].sort((a, b) => {
      if (isMatchLive(a) && !isMatchLive(b)) return -1;
      if (!isMatchLive(a) && isMatchLive(b)) return 1;
      return a.date - b.date;
    });

    const groups = new Map<string, StreamedMatch[]>();
    for (const m of sorted) {
      const d = new Date(m.date);
      const key = d.toDateString();
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(m);
    }

    return Array.from(groups.entries()).map(([dateStr, ms]) => {
      const d = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      let label: string;
      if (d.toDateString() === today.toDateString()) {
        label = `Today, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      } else if (d.toDateString() === tomorrow.toDateString()) {
        label = `Tomorrow, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      } else {
        label = d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
      }

      return { date: dateStr, label, matches: ms };
    });
  }, [filteredMatches]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-24">
        <Loader2 className="h-12 w-12 animate-spin text-green-400" />
        <p className="text-slate-400 text-sm">Loading football fixtures…</p>
      </div>
    );
  }

  if (error && matches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 py-20 text-center">
        <WifiOff className="h-12 w-12 text-red-400/60" />
        <div>
          <h3 className="font-semibold text-white">Could Not Load Fixtures</h3>
          <p className="mt-1 text-slate-400 text-sm">{error}</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-xl bg-green-500 px-5 py-2.5 font-bold text-black text-sm hover:bg-green-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-green-400">
            Live and upcoming
          </p>
          <h1 className="mt-2 font-black text-3xl text-white sm:text-5xl">
            Football Streams
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold text-slate-400">
            Browse football matches from the Streamed schedule, with live events shown
            first.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {liveCount > 0 && (
            <span className="w-fit rounded-full bg-red-500/15 px-3 py-1 text-xs font-black uppercase text-red-100">
              {liveCount} live
            </span>
          )}
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-slate-400 text-sm transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* League filter pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        {LEAGUES.map((league) => {
          const isSelected = selectedLeague === league.searchKey;
          return (
            <button
              key={league.name}
              type="button"
              onClick={() =>
                setSelectedLeague(
                  isSelected && league.searchKey !== null ? null : league.searchKey,
                )
              }
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all",
                isSelected
                  ? "border-green-500 bg-green-500/20 text-green-300"
                  : "border-white/[0.08] bg-white/[0.04] text-slate-300 hover:border-green-500/30 hover:bg-white/[0.08] hover:text-white",
              )}
            >
              <span>{league.flag}</span>
              {league.name}
            </button>
          );
        })}
      </div>

      {/* Fixture count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          {filteredMatches.length} fixture{filteredMatches.length !== 1 ? "s" : ""}
          {selectedLeague && (
            <span className="ml-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-medium text-green-400 text-xs capitalize">
              {selectedLeague}
            </span>
          )}
        </p>
      </div>

      {/* Grouped matches */}
      {groupedByDay.length > 0 ? (
        <div className="space-y-12">
          {groupedByDay.map((group) => (
            <DateGroup
              key={group.date}
              label={group.label}
              matches={group.matches}
              eventCount={group.matches.length}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] py-20 text-center">
          <p className="font-semibold text-white">No fixtures found</p>
          <p className="mt-1 text-slate-400 text-sm">
            Try selecting a different league or clear the filter.
          </p>
          {selectedLeague && (
            <button
              type="button"
              onClick={() => setSelectedLeague(null)}
              className="mt-4 rounded-xl bg-green-500 px-4 py-2 font-bold text-black text-xs transition-opacity hover:opacity-90"
            >
              Show all football fixtures
            </button>
          )}
        </div>
      )}
    </div>
  );
}
