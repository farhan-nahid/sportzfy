"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Trophy, Search, Clock, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WCMatch {
  id: string;
  homeTeam: string;
  homeCode: string;
  awayTeam: string;
  awayCode: string;
  homeScore: number;
  awayScore: number;
  status: "FINISHED" | "SCHEDULED" | "LIVE";
  stage: string;
  date: string;
  time: string;
  stadium: string;
  city: string;
  matchNumber: number | null;
  attendance: string | null;
}

type TabValue = "all" | "group" | "knockout" | "finished" | "upcoming";

// ── Flag helper ───────────────────────────────────────────────────────────────

const COUNTRY_ISO: Record<string, string> = {
  MEX: "mx", RSA: "za", KOR: "kr", CZE: "cz", SUI: "ch", CAN: "ca",
  BIH: "ba", QAT: "qa", BRA: "br", MAR: "ma", SCO: "gb-sct", HAI: "ht",
  USA: "us", AUS: "au", PAR: "py", TUR: "tr", GER: "de", CIV: "ci",
  ECU: "ec", POR: "pt", ARG: "ar", FRA: "fr", ENG: "gb-eng", ESP: "es",
  ITA: "it", NED: "nl", BEL: "be", URU: "uy", JPN: "jp", COL: "co",
  SEN: "sn", DEN: "dk", POL: "pl", IRN: "ir", SWE: "se", NZL: "nz",
  GHA: "gh", HON: "hn", CHI: "cl", GBR: "gb", OMA: "om", CMR: "cm",
  CRC: "cr", NGA: "ng", CHN: "cn", IRQ: "iq", NOR: "no", KSA: "sa",
  AUT: "at", TUN: "tn", PAN: "pa", UKR: "ua", PER: "pe", EGY: "eg",
  ROU: "ro", FIN: "fi", HUN: "hu", SVN: "si", SVK: "sk", GEO: "ge",
  ALB: "al", ALG: "dz", CIV2: "ci", COD: "cd", CPV: "cv", JOR: "jo",
  UZB: "uz", CRO: "hr", VEN: "ve", BOL: "bo",
};

function flagUrl(code: string): string {
  const iso = COUNTRY_ISO[code?.toUpperCase()] || code?.toLowerCase();
  return `https://flagcdn.com/w80/${iso}.png`;
}

// ── Date formatting ───────────────────────────────────────────────────────────

function formatMatchDate(dateStr: string, timeStr: string): string {
  try {
    const dt = new Date(`${dateStr}T${timeStr}:00Z`);
    return dt.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return `${dateStr} ${timeStr}`;
  }
}

// ── Fixture Card ──────────────────────────────────────────────────────────────

function FixtureCard({ match, index }: { match: WCMatch; index: number }) {
  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "LIVE";

  // Extract group name from stage string "First Stage - Group A"
  const groupLabel = match.stage.includes(" - ")
    ? match.stage.split(" - ").slice(-1)[0]
    : null;

  const isKnockout = !groupLabel;

  return (
    <div
      className="card-enter fixture-card bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#e94560]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#e94560]/5 transition-all duration-300"
      style={{ animationDelay: `${index * 30}ms` }}
      data-type={isKnockout ? "knockout" : "group"}
      data-finished={isFinished ? "true" : "false"}
      data-home={match.homeTeam.toLowerCase()}
      data-away={match.awayTeam.toLowerCase()}
    >
      {/* Card header */}
      <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5 text-xs">
        <span className="text-gray-400 font-semibold uppercase tracking-wider">
          {match.matchNumber ? `Match ${match.matchNumber}` : match.stage.split(" - ")[0]}
        </span>
        {groupLabel ? (
          <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
            {groupLabel}
          </span>
        ) : (
          <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 capitalize">
            {match.stage.split(" - ")[0]}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col justify-between" style={{ minHeight: "180px" }}>
        <div className="space-y-3">
          {/* Home team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flagUrl(match.homeCode)}
                alt={match.homeTeam}
                className="w-7 h-5 rounded object-cover bg-white/5 border border-white/10 shadow-sm"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
              <span className="font-bold text-gray-100 text-sm truncate max-w-[150px] sm:max-w-[180px]">
                {match.homeTeam}
              </span>
            </div>
            {isFinished && (
              <span
                className={cn(
                  "font-extrabold text-lg",
                  match.homeScore > match.awayScore ? "text-white" : "text-gray-400"
                )}
              >
                {match.homeScore}
              </span>
            )}
          </div>

          {/* Away team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={flagUrl(match.awayCode)}
                alt={match.awayTeam}
                className="w-7 h-5 rounded object-cover bg-white/5 border border-white/10 shadow-sm"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
              <span className="font-bold text-gray-100 text-sm truncate max-w-[150px] sm:max-w-[180px]">
                {match.awayTeam}
              </span>
            </div>
            {isFinished && (
              <span
                className={cn(
                  "font-extrabold text-lg",
                  match.awayScore > match.homeScore ? "text-white" : "text-gray-400"
                )}
              >
                {match.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Footer: date + status */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>{formatMatchDate(match.date, match.time)}</span>
          </div>

          {isLive ? (
            <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              LIVE
            </span>
          ) : isFinished ? (
            <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              FT
            </span>
          ) : (
            <span className="text-gray-500 font-medium bg-white/5 px-2 py-0.5 rounded border border-white/8">
              Upcoming
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function FixtureSkeleton() {
  return (
    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-white/5 px-4 py-3 flex justify-between">
        <div className="h-3 bg-white/10 rounded-full w-20" />
        <div className="h-3 bg-white/8 rounded-full w-16" />
      </div>
      <div className="p-5 space-y-3" style={{ minHeight: "180px" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-5 bg-white/10 rounded" />
            <div className="h-3 bg-white/10 rounded-full w-28" />
          </div>
          <div className="h-5 bg-white/8 rounded w-6" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-5 bg-white/10 rounded" />
            <div className="h-3 bg-white/10 rounded-full w-24" />
          </div>
          <div className="h-5 bg-white/8 rounded w-6" />
        </div>
        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between">
          <div className="h-3 bg-white/8 rounded-full w-32" />
          <div className="h-5 bg-white/8 rounded w-10" />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function WorldCupClient() {
  const [upcomingMatches, setUpcomingMatches] = useState<WCMatch[]>([]);
  const [recentResults, setRecentResults] = useState<WCMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [searchQuery, setSearchQuery] = useState("");

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
    } catch {
      setError("Failed to fetch World Cup data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const iv = setInterval(() => fetchData(), 120_000);
    return () => clearInterval(iv);
  }, []);

  // All matches merged, newest finished first then upcoming
  const allMatches = useMemo(
    () => [...recentResults, ...upcomingMatches],
    [recentResults, upcomingMatches]
  );

  const filteredMatches = useMemo(() => {
    let list: WCMatch[] = [];

    switch (activeTab) {
      case "group":
        list = allMatches.filter((m) => m.stage.toLowerCase().includes("group"));
        break;
      case "knockout":
        list = allMatches.filter((m) => !m.stage.toLowerCase().includes("group"));
        break;
      case "finished":
        list = recentResults;
        break;
      case "upcoming":
        list = upcomingMatches;
        break;
      default:
        list = allMatches;
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        m.stage.toLowerCase().includes(q)
    );
  }, [allMatches, recentResults, upcomingMatches, activeTab, searchQuery]);

  const TABS: { label: string; value: TabValue; count?: number }[] = [
    { label: "All Matches",    value: "all",      count: allMatches.length },
    { label: "Group Stage",    value: "group",    count: allMatches.filter((m) => m.stage.toLowerCase().includes("group")).length },
    { label: "Knockout Stage", value: "knockout", count: allMatches.filter((m) => !m.stage.toLowerCase().includes("group")).length },
    { label: "Completed",      value: "finished", count: recentResults.length },
    { label: "Upcoming",       value: "upcoming", count: upcomingMatches.length },
  ];

  return (
    <main className="flex-1 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-r from-yellow-600/20 to-[#e94560]/10 border border-white/[0.06] rounded-3xl p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(234,179,8,0.08)_0%,_transparent_60%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mb-3">
              <Trophy className="w-3.5 h-3.5 animate-bounce" />
              FIFA World Cup 2026
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Fixtures &amp; Results
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
              Follow all the matches, dates, scores, and schedules of the 2026 World Cup hosted by
              Canada, Mexico, and USA.
            </p>
          </div>

          {/* Search + refresh */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                id="fixture-search"
                type="text"
                placeholder="Search by country…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-3 rounded-xl text-sm bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e94560]/30 focus:border-[#e94560]/30 transition-all backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>

            <button
              id="refresh-wc-btn"
              onClick={() => fetchData(true)}
              disabled={refreshing || loading}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap",
                (refreshing || loading) && "opacity-50 cursor-not-allowed"
              )}
            >
              <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            id={`tab-${tab.value}`}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
              activeTab === tab.value
                ? "bg-[#e94560] text-white border-[#e94560] shadow-lg shadow-[#e94560]/25"
                : "bg-white/5 text-gray-400 border-white/[0.06] hover:text-white hover:bg-white/8"
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  activeTab === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-gray-500"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 mb-6">
          <span className="text-red-400 text-sm">{error}</span>
          <button
            onClick={() => fetchData()}
            className="ml-auto text-xs text-red-400 hover:text-red-300 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Fixture Grid ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <FixtureSkeleton key={i} />
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Trophy className="w-14 h-14 text-gray-700" />
          <div>
            <h3 className="font-semibold text-white mb-1">No matches found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? `No results for "${searchQuery}".`
                : "No matches in this category."}
            </p>
          </div>
          <button
            onClick={() => { setActiveTab("all"); setSearchQuery(""); }}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#e94560] text-white hover:bg-[#c73452] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-600 mb-4">
            Showing <span className="text-gray-400 font-medium">{filteredMatches.length}</span> match
            {filteredMatches.length !== 1 ? "es" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match, i) => (
              <FixtureCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
