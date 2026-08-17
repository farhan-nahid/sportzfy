"use client";

import { Loader2, RefreshCw, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MatchCard from "@/components/shared/MatchCard";
import type { StreamedMatch } from "@/lib/streamed";
import { groupMatchesByDay, isMatchLive } from "@/lib/streamed";
import { cn } from "@/lib/utils";

const LEAGUES = [
  { name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", searchKey: "premier" },
  { name: "La Liga", flag: "🇪🇸", searchKey: "la liga" },
  { name: "Serie A", flag: "🇮🇹", searchKey: "serie a" },
  { name: "Bundesliga", flag: "🇩🇪", searchKey: "bundesliga" },
  { name: "Ligue 1", flag: "🇫🇷", searchKey: "ligue 1" },
  { name: "Champions League", flag: "🏆", searchKey: "champions" },
  { name: "Europa League", flag: "🇪🇺", searchKey: "europa" },
  { name: "MLS", flag: "🇺🇸", searchKey: "mls" },
];

function transformEspnEvent(event: any, category = "football"): StreamedMatch {
  const comp = event.competitions?.[0];
  const homeComp = comp?.competitors?.find((c: any) => c.homeAway === "home");
  const awayComp = comp?.competitors?.find((c: any) => c.homeAway === "away");

  const homeName = homeComp?.team?.displayName || homeComp?.team?.name || "Home Team";
  const awayName = awayComp?.team?.displayName || awayComp?.team?.name || "Away Team";
  const homeLogo = homeComp?.team?.logo ?? null;
  const awayLogo = awayComp?.team?.logo ?? null;

  const state = event.status?.type?.state;
  const title = event.name || `${homeName} vs ${awayName}`;
  const leagueName =
    comp?.league?.name || event.league?.name || event.season?.slug || "Football";

  return {
    id: String(event.id || `match-${Math.random()}`),
    title,
    category,
    league: leagueName,
    date: new Date(event.date).getTime(),
    popular: true,
    teams: {
      home: { name: homeName, badge: homeLogo, score: homeComp?.score ?? "0" },
      away: { name: awayName, badge: awayLogo, score: awayComp?.score ?? "0" },
    },
    sources: [
      { source: "server1", id: String(event.id) },
      { source: "server2", id: String(event.id) },
    ],
  };
}

async function loadFootballData(): Promise<StreamedMatch[]> {
  // 1. Internal server API
  try {
    const res = await fetch("/api/sports?endpoint=football");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Proceed to direct fetch
  }

  // 2. Direct browser fetch to ESPN API (works globally with CORS Access-Control-Allow-Origin: *)
  try {
    const espnRes = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard",
    );
    if (espnRes.ok) {
      const espnData = await espnRes.json();
      const events = espnData.events || [];
      return events.map((ev: any) => transformEspnEvent(ev, "football"));
    }
  } catch {
    //
  }

  return [];
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
        setError("No live or upcoming football fixtures found right now.");
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

  const liveMatches = useMemo(
    () => filteredMatches.filter((m) => isMatchLive(m)),
    [filteredMatches],
  );

  const upcomingMatches = useMemo(
    () =>
      filteredMatches
        .filter((m) => !isMatchLive(m) && m.date >= Date.now() - 2 * 60 * 60 * 1000)
        .sort((a, b) => a.date - b.date),
    [filteredMatches],
  );

  const otherMatches = useMemo(
    () => filteredMatches.filter((m) => !isMatchLive(m) && !upcomingMatches.includes(m)),
    [filteredMatches, upcomingMatches],
  );

  const groupedUpcoming = useMemo(
    () => groupMatchesByDay(upcomingMatches),
    [upcomingMatches],
  );

  const groupedOther = useMemo(() => groupMatchesByDay(otherMatches), [otherMatches]);

  const todayUpcoming = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return upcomingMatches.filter((m) => new Date(m.date) <= end);
  }, [upcomingMatches]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading football fixtures…</p>
      </div>
    );
  }

  if (error && matches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 py-16 text-center">
        <WifiOff className="h-12 w-12 text-red-400/60" />
        <div>
          <h3 className="font-semibold text-foreground">Connection Error</h3>
          <p className="mt-1 text-muted-foreground text-sm">{error}</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* League quick-links / Top Competitions */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-foreground text-lg">Top Competitions</h2>
          {selectedLeague && (
            <button
              type="button"
              onClick={() => setSelectedLeague(null)}
              className="flex items-center gap-1 font-medium text-primary text-xs hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Show all competitions
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {LEAGUES.map((league) => {
            const isSelected = selectedLeague === league.searchKey;
            return (
              <button
                key={league.name}
                type="button"
                onClick={() => setSelectedLeague(isSelected ? null : league.searchKey)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all",
                  isSelected
                    ? "border-primary bg-primary/15 text-primary shadow-lg shadow-primary/10"
                    : "border-white/[0.08] bg-white/[0.04] text-muted-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.08]",
                )}
              >
                <span className="text-2xl">{league.flag}</span>
                <span
                  className={cn(
                    "font-medium text-[11px] leading-tight",
                    isSelected ? "font-bold text-primary" : "text-muted-foreground",
                  )}
                >
                  {league.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Main column */}
        <div className="space-y-8">
          {/* Refresh & status info */}
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {filteredMatches.length} fixture{filteredMatches.length !== 1 ? "s" : ""}
              {selectedLeague && (
                <span className="ml-1.5 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs capitalize">
                  Filter: {selectedLeague}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={load}
              className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-white/[0.08] hover:text-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          {/* Live now */}
          {liveMatches.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-bold text-foreground text-lg">Live Now</h2>
                <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-medium text-red-400 text-xs">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                  {liveMatches.length} live
                </span>
              </div>
              <div className="space-y-2">
                {liveMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {groupedUpcoming.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-bold text-foreground text-lg">
                Upcoming & Scheduled Fixtures
              </h2>
              {groupedUpcoming.map((group) => (
                <div key={group.date} className="space-y-3">
                  <div className="flex items-center gap-2 border-white/[0.06] border-b pb-2">
                    <span className="font-bold text-primary text-xs uppercase tracking-wider">
                      📅 {group.label}
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                      {group.matches.length} match{group.matches.length !== 1 ? "es" : ""}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.matches.map((m) => (
                      <MatchCard key={m.id} match={m} showDate={false} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Other / Recent Matches */}
          {groupedOther.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-bold text-foreground text-lg">
                Other Football Matches
              </h2>
              {groupedOther.map((group) => (
                <div key={group.date} className="space-y-3">
                  <div className="flex items-center gap-2 border-white/[0.06] border-b pb-2">
                    <span className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
                      📅 {group.label}
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 font-medium text-[10px] text-muted-foreground">
                      {group.matches.length} match{group.matches.length !== 1 ? "es" : ""}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.matches.map((m) => (
                      <MatchCard key={m.id} match={m} showDate={false} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {filteredMatches.length === 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] py-16 text-center">
              <p className="font-semibold text-foreground">
                No fixtures found for this competition
              </p>
              <p className="mt-1 text-muted-foreground text-sm">
                Try selecting a different league or clear the filter.
              </p>
              <button
                type="button"
                onClick={() => setSelectedLeague(null)}
                className="mt-4 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground text-xs transition-opacity hover:opacity-90"
              >
                Show all football fixtures
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="sticky top-20 space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
            <h3 className="mb-3 font-bold text-foreground text-sm">Quick Stats</h3>
            <dl className="space-y-3">
              {[
                { label: "Live Matches", value: liveMatches.length },
                { label: "Today's Fixtures", value: todayUpcoming.length },
                { label: "Total Fixtures", value: filteredMatches.length },
                {
                  label: "Popular Matches",
                  value: filteredMatches.filter((m) => m.popular).length,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="text-muted-foreground text-xs">{label}</dt>
                  <dd className="font-bold text-foreground text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-foreground text-sm">
              <span>🏆</span> League Point Tables
            </h3>
            <p className="mb-4 text-muted-foreground text-xs leading-relaxed">
              Check live standings, points, goals, wins, and losses for Premier League, La
              Liga, Serie A, and more.
            </p>
            <Link
              href="/standings"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/20 px-4 py-2.5 font-bold text-amber-400 text-sm transition-all hover:bg-amber-500/30"
            >
              🏆 View Point Tables
            </Link>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <h3 className="mb-2 font-bold text-foreground text-sm">
              Watch Live Football
            </h3>
            <p className="mb-4 text-muted-foreground text-xs leading-relaxed">
              Stream football channels from beIN Sports, Fox Sports, Sky Sports, and 100+
              more for free.
            </p>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-primary-foreground text-sm transition-all hover:opacity-90"
            >
              📺 Browse Channels
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
