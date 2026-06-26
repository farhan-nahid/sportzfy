"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Search,
  Calendar,
  MapPin,
  X,
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Flame,
  RefreshCw,
  Tv,
  Thermometer,
  Cloud,
  Users,
  Clock,
  Info
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FIFA_RANKINGS,
  type Match
} from "@/data/worldcup";

// ISO code flag mapping for national teams
const flagMap: Record<string, string> = {
  ARG: "🇦🇷", FRA: "🇫🇷", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", BEL: "🇧🇪", BRA: "🇧🇷", NED: "🇳🇱", POR: "🇵🇹", ESP: "🇪🇸",
  ITA: "🇮🇹", CRO: "🇭🇷", USA: "🇺🇸", GER: "🇩🇪", MAR: "🇲🇦", URU: "🇺🇾", JPN: "🇯🇵", MEX: "🇲🇽",
  COL: "🇨🇴", SEN: "🇸🇳", IRN: "🇮🇷", DEN: "🇩🇰", UKR: "🇺🇦", PER: "🇵🇪", CAN: "🇨🇦", EGY: "🇪🇬",
  KSA: "🇸🇦", AUT: "🇦🇹", TUN: "🇹🇳", PAN: "🇵🇦", SWE: "🇸🇪", RSA: "🇿🇦", NZL: "🇳🇿", GHA: "🇬🇭",
  POL: "🇵🇱", HON: "🇭🇳", CHI: "🇨🇱", AUS: "🇦🇺", GBR: "🇬🇧", ECU: "🇪🇨", OMA: "🇴🇲", CMR: "🇨🇲",
  CRC: "🇨🇷", NGA: "🇳🇬", CHN: "🇨🇳", IRQ: "🇮🇶", NOR: "🇳🇴", CZE: "🇨🇿", TUR: "🇹🇷", PAR: "🇵🇾",
  SUI: "🇨🇭", KOR: "🇰🇷", JAM: "🇯🇲", CZE_RES: "🇨🇿", VEN: "🇻🇪", BOL: "🇧🇴", PRK: "🇰🇵",
  ROU: "🇷🇴", FIN: "🇫🇮", HUN: "🇭🇺", WAL: "🏴󠁧󠁢qwerty", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", NIR: "🟨", SVN: "🇸🇮",
  SVK: "🇸🇰", GEO: "🇬🇪", ALB: "🇦🇱", ALG: "🇩🇿", BIH: "🇧🇦", CIV: "🇨🇮", COD: "🇨🇩",
  CPV: "🇨🇻", CUW: "🇨🇼", HAI: "🇭🇹", JOR: "🇯🇴", QAT: "🇶🇦", UZB: "🇺🇿"
};

// Fix UK / Wales code if needed
flagMap.WAL = "🏴󠁧󠁢󠁷󠁬󠁳󠁿";

function getFlag(code: string): string {
  const c = code?.toUpperCase() || "";
  return flagMap[c] || "⚽";
}

export default function WorldCupClient() {
  const [activeTab, setActiveTab] = useState<"matches" | "standings">("matches");
  const [standingsTab, setStandingsTab] = useState<"groups" | "rankings">("groups");
  
  // API state
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("Group A");

  // Fetch data from API
  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/worldcup");
      if (!res.ok) throw new Error("Failed to load World Cup data");
      const data = await res.json();
      
      setUpcomingMatches(data.upcomingMatches || []);
      setRecentResults(data.recentResults || []);
      setStandings(data.standings || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch World Cup data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Search Filtering
  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        recent: recentResults,
        upcoming: upcomingMatches
      };
    }
    const q = searchQuery.toLowerCase();
    
    const filterFn = (m: Match) => 
      m.homeTeam.toLowerCase().includes(q) || 
      m.awayTeam.toLowerCase().includes(q) || 
      (m.stage?.toLowerCase().includes(q) ?? false) ||
      (m.city?.toLowerCase().includes(q) ?? false) ||
      (m.stadium?.toLowerCase().includes(q) ?? false);

    return {
      recent: recentResults.filter(filterFn),
      upcoming: upcomingMatches.filter(filterFn)
    };
  }, [recentResults, upcomingMatches, searchQuery]);

  const filteredRankings = useMemo(() => {
    if (!searchQuery.trim()) return FIFA_RANKINGS;
    const q = searchQuery.toLowerCase();
    return FIFA_RANKINGS.filter(
      (r) => r.team.toLowerCase().includes(q) || r.confederation.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeGroupData = useMemo(() => {
    if (standings.length === 0) return null;
    return standings.find((g) => g.name === selectedGroup) || standings[0];
  }, [standings, selectedGroup]);

  return (
    <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 relative">

      {/* Hero Tournament Strip */}
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-card p-6 md:p-8 mb-8 animate-fade-up">
        {/* Floating gradient decorative orbs */}
        <div className="absolute inset-0 mesh-bg pointer-events-none opacity-40" />
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Trophy className="w-3.5 h-3.5" />
              FIFA World Cup 2026
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-2">
              Tournament Dashboard
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Standings, results, and upcoming schedules pulled dynamically from the official FIFA API database. 48 teams competing across Canada, Mexico, and USA.
            </p>
          </div>

          {/* Quick tournament stats */}
          <div className="grid grid-cols-2 gap-8 border-t md:border-t-0 md:border-l border-white/8 pt-4 md:pt-0 md:pl-8">
            <div className="space-y-0.5">
              <div className="text-xs text-muted-foreground font-medium">Upcoming Fixtures</div>
              <div className="text-xl sm:text-2xl font-black text-foreground">
                {loading ? "…" : upcomingMatches.length} <span className="text-xs font-bold text-muted-foreground">matches</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xs text-muted-foreground font-medium">Completed Stage</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {loading ? "…" : recentResults.length} <span className="text-xs font-bold text-muted-foreground">games</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Navigation Tabs */}
        <div className="flex bg-muted/20 border border-white/8 rounded-xl p-1 shrink-0 self-start">
          <button
            onClick={() => setActiveTab("matches")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeTab === "matches"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Matches & Results
          </button>
          <button
            onClick={() => setActiveTab("standings")}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeTab === "standings"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Standings & Rankings
          </button>
        </div>

        {/* Global Search and Refresh Box */}
        <div className="flex items-center gap-3 w-full md:max-w-md md:justify-end">
          {/* Refresh Button */}
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border border-white/8 bg-muted/20 hover:bg-muted/40 transition-all text-foreground cursor-pointer shrink-0 disabled:opacity-50"
            title="Refresh FIFA API Data"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
            <span className="hidden sm:inline">Sync API</span>
          </button>

          {/* Search Field */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={
                activeTab === "matches"
                  ? "Search teams, stadium, city..."
                  : standingsTab === "groups"
                  ? "Filter groups..."
                  : "Search countries or confederation..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-muted/20 border border-white/8 placeholder:text-muted-foreground/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted"
              >
                <X className="w-2.5 h-2.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ────────────────── LOADING & ERROR STATES ────────────────── */}

      {loading ? (
        <div className="space-y-8 animate-pulse py-10">
          <div className="space-y-3">
            <div className="h-5 bg-muted/30 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-muted/20 border border-white/8 rounded-2xl" />
              <div className="h-32 bg-muted/20 border border-white/8 rounded-2xl" />
              <div className="h-32 bg-muted/20 border border-white/8 rounded-2xl" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400 text-sm max-w-lg mx-auto my-8">
          <p className="font-semibold mb-3">{error}</p>
          <button
            onClick={() => fetchData()}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        /* ────────────────── TABS CONTENT ────────────────── */
        activeTab === "matches" && (
          <div className="space-y-8 animate-fade-in">

            {/* UPCOMING MATCHES TIMELINE */}
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-foreground flex items-center gap-2 mb-4">
                <Calendar className="w-4.5 h-4.5 text-primary" />
                Upcoming Matches
              </h2>

              {filteredMatches.upcoming.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-muted/10 p-8 text-center text-sm text-muted-foreground">
                  No upcoming matches match your query.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMatches.upcoming.slice(0, 18).map((match) => (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className="rounded-2xl border border-white/8 bg-card p-5 flex flex-col justify-between hover:border-primary/30 hover:bg-muted/5 transition-all group animate-fade-up cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold mb-3">
                          <span className="bg-muted/40 border border-white/5 px-2 py-0.5 rounded-full text-foreground uppercase tracking-wide">
                            {match.stage}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-mono text-primary font-bold">
                            {match.date} @ {match.time}
                          </span>
                        </div>

                        {/* Teams display */}
                        <div className="space-y-3 my-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl filter drop-shadow-sm select-none">
                              {getFlag(match.homeCode)}
                            </span>
                            <span className="text-sm font-bold text-foreground">{match.homeTeam}</span>
                            <span className="text-[10px] text-muted-foreground ml-auto font-mono uppercase">{match.homeCode}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl filter drop-shadow-sm select-none">
                              {getFlag(match.awayCode)}
                            </span>
                            <span className="text-sm font-bold text-foreground">{match.awayTeam}</span>
                            <span className="text-[10px] text-muted-foreground ml-auto font-mono uppercase">{match.awayCode}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center border-t border-white/5 pt-3.5 mt-2 gap-2 text-[10px] text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate flex-1">{match.stadium}, {match.city}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors mr-1">
                            Details
                          </span>
                          {match.broadcastChannel && (
                            <Link
                              href={`/?watch=${encodeURIComponent(match.broadcastChannel)}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-2.5 py-0.5 rounded hover:bg-amber-500/25 transition-all"
                            >
                              Watch
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECENT MATCH RESULTS */}
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-foreground flex items-center gap-2 mb-4">
                <Trophy className="w-4.5 h-4.5 text-amber-500" />
                Recent Results
              </h2>

              {filteredMatches.recent.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-muted/10 p-8 text-center text-sm text-muted-foreground">
                  No recent match results match your query.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMatches.recent.map((match) => (
                    <div
                      key={match.id}
                      className="rounded-2xl border border-white/8 bg-card hover:border-white/15 transition-all p-5 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold mb-4">
                        <span>{match.stage}</span>
                        <span>{match.date}</span>
                      </div>

                      <div className="flex items-center justify-between gap-4 mb-3">
                        {/* Home */}
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-2xl filter drop-shadow select-none">
                            {getFlag(match.homeCode)}
                          </span>
                          <span className="text-sm font-bold text-foreground truncate max-w-[120px] sm:max-w-none">
                            {match.homeTeam}
                          </span>
                        </div>
                        
                        {/* Score */}
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="flex items-center gap-2 bg-muted/30 px-3 py-1 rounded-xl border border-white/5 font-mono font-extrabold text-foreground text-sm hover:bg-muted transition-all cursor-pointer"
                          title="View Match Statistics"
                        >
                          <span>{match.homeScore}</span>
                          <span className="text-muted-foreground">:</span>
                          <span>{match.awayScore}</span>
                        </button>

                        {/* Away */}
                        <div className="flex-1 flex items-center justify-end gap-2 text-right">
                          <span className="text-sm font-bold text-foreground truncate max-w-[120px] sm:max-w-none">
                            {match.awayTeam}
                          </span>
                          <span className="text-2xl filter drop-shadow select-none">
                            {getFlag(match.awayCode)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* STANDINGS & FIFA RANKINGS CONTENT */}
      {!loading && !error && activeTab === "standings" && (
        <div className="space-y-6 animate-fade-in">
          {/* Subheader controls */}
          <div className="flex border-b border-white/8 pb-4 gap-4 items-center">
            <button
              onClick={() => setStandingsTab("groups")}
              className={cn(
                "pb-2 text-xs font-bold transition-all relative",
                standingsTab === "groups"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Group Standings
            </button>
            <button
              onClick={() => setStandingsTab("rankings")}
              className={cn(
                "pb-2 text-xs font-bold transition-all relative",
                standingsTab === "rankings"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              FIFA World Rankings
            </button>
          </div>

          {/* STANDINGS SUB-TAB */}
          {standingsTab === "groups" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Group Selector Side Panel */}
              <div className="lg:col-span-1 space-y-2">
                <div className="text-xs text-muted-foreground font-semibold px-2 mb-2 uppercase tracking-widest">Select Group</div>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-1.5">
                  {standings.map((group) => (
                    <button
                      key={group.name}
                      onClick={() => setSelectedGroup(group.name)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all border",
                        selectedGroup === group.name
                          ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                          : "bg-muted/10 text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30"
                      )}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standings Table Card */}
              <div className="lg:col-span-3 rounded-2xl border border-white/8 bg-card p-5 overflow-hidden">
                {activeGroupData ? (
                  <>
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                      <h3 className="font-black text-foreground text-sm flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        {activeGroupData.name} Standings
                      </h3>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                        Top 2 Advance + Best 3rd
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-muted-foreground font-semibold border-b border-white/5 uppercase text-[10px]">
                            <th className="py-2.5 pl-2 text-center w-8">#</th>
                            <th className="py-2.5">Team</th>
                            <th className="py-2.5 text-center w-10">P</th>
                            <th className="py-2.5 text-center w-8">W</th>
                            <th className="py-2.5 text-center w-8">D</th>
                            <th className="py-2.5 text-center w-8">L</th>
                            <th className="py-2.5 text-center w-12">GD</th>
                            <th className="py-2.5 text-center w-12 pr-2 font-bold text-foreground">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                          {activeGroupData.standings.map((team: any, idx: number) => (
                            <tr
                              key={team.team}
                              className={cn(
                                "hover:bg-muted/20 transition-colors",
                                idx < 2 ? "bg-primary/2 text-foreground" : "text-muted-foreground/80"
                              )}
                            >
                              <td className="py-3 pl-2 text-center font-bold text-foreground w-8">
                                <span className={cn(
                                  "w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px]",
                                  idx < 2 ? "bg-primary/15 text-primary" : "bg-muted/40 text-muted-foreground"
                                )}>
                                  {team.rank}
                                </span>
                              </td>
                              <td className="py-3 font-extrabold text-foreground flex items-center gap-2">
                                <span className="text-lg filter drop-shadow-sm select-none">
                                  {getFlag(team.code)}
                                </span>
                                <span className="truncate max-w-[150px] sm:max-w-none">{team.team}</span>
                                <span className="text-[10px] text-muted-foreground font-semibold font-mono uppercase">
                                  {team.code}
                                </span>
                              </td>
                              <td className="py-3 text-center w-10 font-mono font-bold text-foreground">{team.played}</td>
                              <td className="py-3 text-center w-8 font-mono">{team.won}</td>
                              <td className="py-3 text-center w-8 font-mono">{team.drawn}</td>
                              <td className="py-3 text-center w-8 font-mono">{team.lost}</td>
                              <td className={cn(
                                "py-3 text-center w-12 font-mono font-bold",
                                team.goalDifference > 0 ? "text-emerald-400" : team.goalDifference < 0 ? "text-red-400" : "text-muted-foreground"
                              )}>
                                {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                              </td>
                              <td className="py-3 text-center w-12 pr-2 font-mono font-black text-foreground bg-white/3 rounded-lg text-sm">
                                {team.points}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">No standings calculated yet.</div>
                )}
              </div>
            </div>
          )}

          {/* FIFA WORLD RANKINGS SUB-TAB */}
          {standingsTab === "rankings" && (
            <div className="rounded-2xl border border-white/8 bg-card p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                <h3 className="font-black text-foreground text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                  Official FIFA Men&apos;s World Rankings
                </h3>
                <span className="text-[10px] text-muted-foreground font-semibold font-mono">
                  Last Updated: June 2026
                </span>
              </div>

              {filteredRankings.length === 0 ? (
                <div className="text-center p-8 text-sm text-muted-foreground">
                  No matching rankings found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-muted-foreground font-semibold border-b border-white/5 uppercase text-[10px]">
                        <th className="py-2.5 pl-2 text-center w-12">Rank</th>
                        <th className="py-2.5">Country</th>
                        <th className="py-2.5 w-16 text-center">Change</th>
                        <th className="py-2.5 w-24 text-center">Points</th>
                        <th className="py-2.5 w-28 text-center pr-2">Confederation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {filteredRankings.map((team) => (
                        <tr key={team.team} className="hover:bg-muted/10 transition-colors">
                          <td className="py-3 pl-2 text-center font-black text-foreground text-sm w-12">
                            {team.rank}
                          </td>
                          <td className="py-3 font-extrabold text-foreground flex items-center gap-2">
                            <span className="text-lg filter drop-shadow-sm select-none">
                              {getFlag(team.code)}
                            </span>
                            <span>{team.team}</span>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase">{team.code}</span>
                          </td>
                          <td className="py-3 text-center w-16">
                            <span className={cn(
                              "inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold font-mono",
                              team.change === "up" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                              team.change === "down" && "bg-red-500/10 text-red-400 border border-red-500/20",
                              team.change === "same" && "bg-muted/30 text-muted-foreground border border-white/5"
                            )}>
                              {team.change === "up" && <TrendingUp className="w-3 h-3" />}
                              {team.change === "down" && <TrendingDown className="w-3 h-3" />}
                              {team.change === "same" && <Minus className="w-3 h-3" />}
                              {team.changeValue > 0 && team.changeValue}
                            </span>
                          </td>
                          <td className="py-3 text-center w-24 font-mono font-bold text-foreground">
                            {team.points.toFixed(2)}
                          </td>
                          <td className="py-3 text-center w-28 pr-2 font-semibold text-muted-foreground font-mono">
                            {team.confederation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ────────────────── MATCH STATS MODAL ────────────────── */}

      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedMatch(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />

          <div className="relative bg-card border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/5 sticky top-0 bg-card z-10">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                {selectedMatch.status === "SCHEDULED" ? "Match Details" : "Match Statistics"}
              </span>
              <button
                onClick={() => setSelectedMatch(null)}
                className="w-8 h-8 rounded-lg bg-muted/40 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {selectedMatch.status === "SCHEDULED" ? (
                <div className="space-y-6">
                  {/* VS Header Card */}
                  <div className="rounded-2xl bg-muted/20 border border-white/5 p-6 flex flex-col items-center justify-between gap-6 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Stage & Match number */}
                    <div className="w-full flex items-center justify-between border-b border-white/5 pb-3.5 z-10">
                      <span className="text-[10px] bg-muted/60 border border-white/5 px-2.5 py-1 rounded-full text-foreground font-bold uppercase tracking-wider">
                        {selectedMatch.stage}
                      </span>
                      {selectedMatch.matchNumber && (
                        <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full font-black font-mono">
                          MATCH #{selectedMatch.matchNumber}
                        </span>
                      )}
                    </div>

                    {/* Team flags & VS */}
                    <div className="w-full flex items-center justify-between gap-4 z-10 px-2">
                      <div className="flex-1 flex flex-col items-center text-center">
                        <span className="text-5xl md:text-6xl mb-3 filter drop-shadow-md select-none transition-transform hover:scale-110 duration-300">
                          {getFlag(selectedMatch.homeCode)}
                        </span>
                        <span className="text-base font-black text-foreground tracking-tight">{selectedMatch.homeTeam}</span>
                        <span className="text-xs text-muted-foreground font-bold font-mono uppercase mt-0.5 tracking-wider bg-muted/30 px-2 py-0.5 rounded">
                          {selectedMatch.homeCode}
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] animate-pulse">
                          <span className="text-primary font-black text-sm tracking-widest font-mono">VS</span>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col items-center text-center">
                        <span className="text-5xl md:text-6xl mb-3 filter drop-shadow-md select-none transition-transform hover:scale-110 duration-300">
                          {getFlag(selectedMatch.awayCode)}
                        </span>
                        <span className="text-base font-black text-foreground tracking-tight">{selectedMatch.awayTeam}</span>
                        <span className="text-xs text-muted-foreground font-bold font-mono uppercase mt-0.5 tracking-wider bg-muted/30 px-2 py-0.5 rounded">
                          {selectedMatch.awayCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info grid (Date, Venue, Channel) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Time & Venue */}
                    <div className="rounded-xl border border-white/5 bg-muted/10 p-4 space-y-3.5">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider pb-1.5 border-b border-white/5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        Match Schedule & Venue
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-[10px] text-muted-foreground font-semibold uppercase">Date & Time</div>
                            <div className="font-extrabold text-foreground font-mono text-[13px]">
                              {selectedMatch.date} @ {selectedMatch.time}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="text-[10px] text-muted-foreground font-semibold uppercase">Location</div>
                            <div className="font-extrabold text-foreground">
                              {selectedMatch.stadium}
                            </div>
                            <div className="text-muted-foreground font-medium">
                              {selectedMatch.city}
                            </div>
                          </div>
                        </div>
                        {selectedMatch.broadcastChannel && (
                          <div className="flex items-center gap-3">
                            <Tv className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-[10px] text-muted-foreground font-semibold uppercase">Broadcast Channel</div>
                              <div className="font-extrabold text-amber-400">
                                {selectedMatch.broadcastChannel}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Weather card */}
                    {selectedMatch.weather && (selectedMatch.weather.temp !== null || selectedMatch.weather.condition !== null) ? (
                      <div className="rounded-xl border border-white/5 bg-muted/10 p-4 space-y-3.5">
                        <h4 className="text-xs font-black uppercase text-foreground tracking-wider pb-1.5 border-b border-white/5 flex items-center gap-1.5">
                          <Cloud className="w-3.5 h-3.5 text-sky-400" />
                          Weather Forecast
                        </h4>
                        <div className="space-y-3 text-xs">
                          {selectedMatch.weather.temp !== null && (
                            <div className="flex items-center gap-3">
                              <Thermometer className="w-4 h-4 text-orange-400" />
                              <div>
                                <div className="text-[10px] text-muted-foreground font-semibold uppercase">Temperature</div>
                                <div className="font-extrabold text-foreground font-mono text-[13px]">
                                  {selectedMatch.weather.temp}°C
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedMatch.weather.humidity !== null && (
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 flex items-center justify-center font-bold text-sky-400 text-[10px] font-mono">%</div>
                              <div>
                                <div className="text-[10px] text-muted-foreground font-semibold uppercase">Humidity</div>
                                <div className="font-extrabold text-foreground font-mono text-[13px]">
                                  {selectedMatch.weather.humidity}%
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedMatch.weather.condition && (
                            <div className="flex items-center gap-3">
                              <Info className="w-4 h-4 text-sky-300" />
                              <div>
                                <div className="text-[10px] text-muted-foreground font-semibold uppercase">Condition</div>
                                <div className="font-extrabold text-foreground capitalize">
                                  {selectedMatch.weather.condition}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-white/5 bg-muted/10 p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <Cloud className="w-8 h-8 text-muted-foreground/50" />
                        <div className="text-xs text-muted-foreground font-medium">Weather forecast not available yet.</div>
                      </div>
                    )}
                  </div>

                  {/* Officials Section */}
                  {selectedMatch.officials && selectedMatch.officials.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider pb-1.5 border-b border-white/5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        Match Officials
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedMatch.officials.map((official, idx) => (
                          <div key={idx} className="bg-muted/15 border border-white/5 p-3 rounded-lg flex items-center justify-between text-xs">
                            <span className="font-extrabold text-foreground">{official.name}</span>
                            <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-bold uppercase tracking-wider">
                              {official.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Score strip */}
                  <div className="rounded-xl bg-muted/20 border border-white/5 p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col items-center text-center">
                      <span className="text-3xl mb-1 filter drop-shadow select-none">{getFlag(selectedMatch.homeCode)}</span>
                      <span className="text-sm font-extrabold text-foreground">{selectedMatch.homeTeam}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold font-mono uppercase">{selectedMatch.homeCode}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-foreground font-mono">{selectedMatch.homeScore}</span>
                        <span className="text-muted-foreground font-black text-xl">:</span>
                        <span className="text-3xl font-black text-foreground font-mono">{selectedMatch.awayScore}</span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 border border-white/5 px-2 py-0.5 rounded-full mt-2 uppercase">
                        Full Time
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col items-center text-center">
                      <span className="text-3xl mb-1 filter drop-shadow select-none">{getFlag(selectedMatch.awayCode)}</span>
                      <span className="text-sm font-extrabold text-foreground">{selectedMatch.awayTeam}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold font-mono uppercase">{selectedMatch.awayCode}</span>
                    </div>
                  </div>

                  {/* STATS BARS */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-foreground tracking-wider pb-1.5 border-b border-white/5">Team Stats</h4>
                    
                    {/* Possession */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                        <span>{selectedMatch.stats.possession.home}%</span>
                        <span className="text-foreground uppercase tracking-wide text-[10px]">Ball Possession</span>
                        <span>{selectedMatch.stats.possession.away}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden flex bg-muted/40 border border-white/5">
                        <div 
                          className="bg-primary transition-all duration-500" 
                          style={{ width: `${selectedMatch.stats.possession.home}%` }} 
                        />
                        <div 
                          className="bg-amber-500 transition-all duration-500" 
                          style={{ width: `${selectedMatch.stats.possession.away}%` }} 
                        />
                      </div>
                    </div>

                    {/* Shots */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                        <span>{selectedMatch.stats.shots.home}</span>
                        <span className="text-foreground uppercase tracking-wide text-[10px]">Total Shots</span>
                        <span>{selectedMatch.stats.shots.away}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden flex bg-muted/40 border border-white/5">
                        <div 
                          className="bg-primary transition-all duration-500" 
                          style={{ 
                            width: `${
                              (selectedMatch.stats.shots.home / (selectedMatch.stats.shots.home + selectedMatch.stats.shots.away || 1)) * 100
                            }%` 
                          }} 
                        />
                        <div 
                          className="bg-amber-500 transition-all duration-500" 
                          style={{ 
                            width: `${
                              (selectedMatch.stats.shots.away / (selectedMatch.stats.shots.home + selectedMatch.stats.shots.away || 1)) * 100
                            }%` 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Shots on Target */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                        <span>{selectedMatch.stats.shotsOnTarget.home}</span>
                        <span className="text-foreground uppercase tracking-wide text-[10px]">Shots on Target</span>
                        <span>{selectedMatch.stats.shotsOnTarget.away}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden flex bg-muted/40 border border-white/5">
                        <div 
                          className="bg-primary transition-all duration-500" 
                          style={{ 
                            width: `${
                              (selectedMatch.stats.shotsOnTarget.home / (selectedMatch.stats.shotsOnTarget.home + selectedMatch.stats.shotsOnTarget.away || 1)) * 100
                            }%` 
                          }} 
                        />
                        <div 
                          className="bg-amber-500 transition-all duration-500" 
                          style={{ 
                            width: `${
                              (selectedMatch.stats.shotsOnTarget.away / (selectedMatch.stats.shotsOnTarget.home + selectedMatch.stats.shotsOnTarget.away || 1)) * 100
                            }%` 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Passes */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                        <span>{selectedMatch.stats.passes.home}</span>
                        <span className="text-foreground uppercase tracking-wide text-[10px]">Passes Completed</span>
                        <span>{selectedMatch.stats.passes.away}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden flex bg-muted/40 border border-white/5">
                        <div 
                          className="bg-primary transition-all duration-500" 
                          style={{ 
                            width: `${
                              (selectedMatch.stats.passes.home / (selectedMatch.stats.passes.home + selectedMatch.stats.passes.away || 1)) * 100
                            }%` 
                          }} 
                        />
                        <div 
                          className="bg-amber-500 transition-all duration-500" 
                          style={{ 
                            width: `${
                              (selectedMatch.stats.passes.away / (selectedMatch.stats.passes.home + selectedMatch.stats.passes.away || 1)) * 100
                            }%` 
                          }} 
                        />
                      </div>
                    </div>

                    {/* Fouls & Cards */}
                    <div className="grid grid-cols-3 text-center gap-2 pt-2 border-t border-white/5 text-[11px] font-bold">
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Fouls</div>
                        <div className="text-sm font-black text-foreground">
                          {selectedMatch.stats.fouls.home} – {selectedMatch.stats.fouls.away}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Yellow Cards</div>
                        <div className="text-sm font-black text-amber-400">
                          {selectedMatch.stats.yellowCards.home} – {selectedMatch.stats.yellowCards.away}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Red Cards</div>
                        <div className="text-sm font-black text-red-500">
                          {selectedMatch.stats.redCards.home} – {selectedMatch.stats.redCards.away}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TIMELINE OF EVENTS */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-foreground tracking-wider pb-1.5 border-b border-white/5">Match Events</h4>
                    
                    {selectedMatch.events.length === 0 ? (
                      <div className="text-center text-xs text-muted-foreground py-4">No events logged for this match yet.</div>
                    ) : (
                      <div className="relative pl-4 border-l border-white/8 space-y-4 my-2">
                        {selectedMatch.events.map((ev, idx) => (
                          <div key={idx} className="relative flex items-start gap-3">
                            <span className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-primary border-2 border-card flex items-center justify-center" />
                            
                            <span className="font-mono text-xs font-black text-primary min-w-[28px]">{ev.minute}&apos;</span>
                            <div className="flex-1 text-xs">
                              <span className={cn(
                                "font-extrabold text-foreground px-2 py-0.5 rounded mr-2",
                                ev.team === "home" ? "bg-primary/10 text-primary border border-primary/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              )}>
                                {ev.team === "home" ? selectedMatch.homeCode : selectedMatch.awayCode}
                              </span>
                              <span className="font-black text-foreground mr-1.5">{ev.player}</span>
                              <span className="text-muted-foreground font-medium">{ev.detail}</span>
                            </div>
                            <span className="text-sm shrink-0 select-none">
                              {ev.type === "GOAL" && "⚽"}
                              {ev.type === "YELLOW_CARD" && "🟨"}
                              {ev.type === "RED_CARD" && "🟥"}
                              {ev.type === "SUBSTITUTION" && "🔄"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* STARTING LINEUPS */}
                  {selectedMatch.lineups && selectedMatch.lineups.home.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase text-foreground tracking-wider pb-1.5 border-b border-white/5">Lineups</h4>
                      <div className="grid grid-cols-2 gap-4">
                        
                        {/* Home lineups */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-primary uppercase mb-1.5">{selectedMatch.homeTeam}</div>
                          <div className="space-y-1 text-[11px] font-semibold text-muted-foreground">
                            {selectedMatch.lineups.home.map((p, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className="w-4 text-center font-bold font-mono text-[10px] text-white/40">{i+1}</span>
                                <span className={cn(i === 0 && "text-foreground font-bold")}>{p} {i === 0 && "(GK)"}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Away lineups */}
                        <div className="space-y-1 text-right">
                          <div className="text-[10px] font-bold text-amber-400 uppercase mb-1.5">{selectedMatch.awayTeam}</div>
                          <div className="space-y-1 text-[11px] font-semibold text-muted-foreground">
                            {selectedMatch.lineups.away.map((p, i) => (
                              <div key={i} className="flex items-center justify-end gap-1.5">
                                <span>{p} {i === 0 && "(GK)"}</span>
                                <span className="w-4 text-center font-bold font-mono text-[10px] text-white/40">{i+1}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between bg-muted/10">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {selectedMatch.stadium}, {selectedMatch.city}
              </span>
              <button
                onClick={() => setSelectedMatch(null)}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/70 text-xs font-bold transition-all text-foreground"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
