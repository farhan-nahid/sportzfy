"use client";

import { Loader2, RefreshCw, Trophy, WifiOff } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TeamStanding {
  rank: number;
  teamId: string;
  teamName: string;
  teamLogo: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

interface StandingsResponse {
  league: string;
  leagueSlug: string;
  season: number;
  standings: TeamStanding[];
}

const LEAGUE_TABS = [
  { slug: "eng.1", name: "Premier League", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { slug: "esp.1", name: "La Liga", flag: "🇪🇸" },
  { slug: "ita.1", name: "Serie A", flag: "🇮🇹" },
  { slug: "ger.1", name: "Bundesliga", flag: "🇩🇪" },
  { slug: "fra.1", name: "Ligue 1", flag: "🇫🇷" },
  { slug: "usa.1", name: "MLS", flag: "🇺🇸" },
];

export default function StandingsClient() {
  const [selectedLeague, setSelectedLeague] = useState("eng.1");
  const [data, setData] = useState<StandingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(slug = selectedLeague) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/standings?league=${encodeURIComponent(slug)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch {
      setError("Could not load standings. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(selectedLeague);
  }, [selectedLeague]);

  const activeLeague = LEAGUE_TABS.find((l) => l.slug === selectedLeague);

  return (
    <div className="space-y-6">
      {/* League Tabs */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {LEAGUE_TABS.map((tab) => {
          const isSelected = selectedLeague === tab.slug;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setSelectedLeague(tab.slug)}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 font-semibold text-sm transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-white/[0.08] bg-white/[0.04] text-muted-foreground hover:border-primary/30 hover:bg-white/[0.08] hover:text-foreground",
              )}
            >
              <span className="text-lg">{tab.flag}</span>
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-white/[0.06] border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg sm:text-xl">
              {activeLeague?.flag} {data?.league || activeLeague?.name}
            </h2>
            <p className="text-muted-foreground text-xs">
              Official League Standings & Point Table
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => load(selectedLeague)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-white/[0.08] hover:text-foreground disabled:opacity-40"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading point table…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 py-16 text-center">
          <WifiOff className="h-12 w-12 text-red-400/60" />
          <div>
            <h3 className="font-semibold text-foreground">Connection Error</h3>
            <p className="mt-1 text-muted-foreground text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => load(selectedLeague)}
            className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && data && data.standings.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-xl">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-white/[0.08] border-b bg-white/[0.04] text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5 text-center font-bold">#</th>
                <th className="px-4 py-3.5 font-bold">Team</th>
                <th className="px-3 py-3.5 text-center font-bold" title="Matches Played">
                  MP
                </th>
                <th
                  className="px-3 py-3.5 text-center font-bold text-emerald-400"
                  title="Won"
                >
                  W
                </th>
                <th
                  className="px-3 py-3.5 text-center font-bold text-amber-400"
                  title="Drawn"
                >
                  D
                </th>
                <th
                  className="px-3 py-3.5 text-center font-bold text-red-400"
                  title="Lost"
                >
                  L
                </th>
                <th
                  className="hidden px-3 py-3.5 text-center font-bold sm:table-cell"
                  title="Goals For"
                >
                  GF
                </th>
                <th
                  className="hidden px-3 py-3.5 text-center font-bold sm:table-cell"
                  title="Goals Against"
                >
                  GA
                </th>
                <th className="px-3 py-3.5 text-center font-bold" title="Goal Difference">
                  GD
                </th>
                <th className="px-4 py-3.5 text-center font-bold text-primary">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.standings.map((team) => {
                // Highlight qualification colors (Top 4 = Champions League, 5 = Europa League, Bottom 3 = Relegation)
                const isCL = team.rank <= 4;
                const isEL = team.rank === 5;
                const isRelegation = team.rank >= data.standings.length - 2;

                return (
                  <tr
                    key={team.teamId}
                    className="transition-colors hover:bg-white/[0.04]"
                  >
                    {/* Rank */}
                    <td className="px-4 py-3 text-center font-bold text-xs">
                      <span
                        className={cn(
                          "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                          isCL &&
                            "border border-emerald-500/30 bg-emerald-500/20 font-extrabold text-emerald-400",
                          isEL &&
                            "border border-blue-500/30 bg-blue-500/20 font-bold text-blue-400",
                          isRelegation &&
                            "border border-red-500/30 bg-red-500/20 font-semibold text-red-400",
                          !isCL && !isEL && !isRelegation && "text-muted-foreground",
                        )}
                      >
                        {team.rank}
                      </span>
                    </td>

                    {/* Team logo + name */}
                    <td className="px-4 py-3 font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        {team.teamLogo ? (
                          <Image
                            src={team.teamLogo}
                            alt={team.teamName}
                            width={24}
                            height={24}
                            unoptimized
                            className="h-6 w-6 flex-shrink-0 object-contain"
                            onError={(e) =>
                              ((e.target as HTMLImageElement).style.display = "none")
                            }
                          />
                        ) : (
                          <div className="h-6 w-6 flex-shrink-0 rounded-full bg-white/10" />
                        )}
                        <span className="max-w-[180px] truncate sm:max-w-xs">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="px-3 py-3 text-center font-medium text-muted-foreground">
                      {team.played}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-emerald-400/90">
                      {team.won}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-amber-400/90">
                      {team.drawn}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-red-400/90">
                      {team.lost}
                    </td>
                    <td className="hidden px-3 py-3 text-center text-muted-foreground sm:table-cell">
                      {team.goalsFor}
                    </td>
                    <td className="hidden px-3 py-3 text-center text-muted-foreground sm:table-cell">
                      {team.goalsAgainst}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-foreground">
                      {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
                    </td>
                    <td className="px-4 py-3 text-center font-extrabold text-base text-primary">
                      {team.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Qualification Legend */}
      {!loading && !error && data && data.standings.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-muted-foreground text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-emerald-500 bg-emerald-500/40" />
            <span>Champions League (Top 4)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-blue-500 bg-blue-500/40" />
            <span>Europa League (5th)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-red-500 bg-red-500/40" />
            <span>Relegation Zone</span>
          </div>
        </div>
      )}
    </div>
  );
}
