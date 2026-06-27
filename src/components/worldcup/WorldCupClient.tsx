"use client";

import { ChevronDown, Clock, RefreshCw, Search, Trophy, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

type TabValue = "all" | "group" | "knockout" | "finished" | "upcoming";

// ── Flag helper ───────────────────────────────────────────────────────────────

const COUNTRY_ISO: Record<string, string> = {
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
  const iso = COUNTRY_ISO[code?.toUpperCase()] || code?.toLowerCase();
  return `https://flagcdn.com/w80/${iso}.png`;
}

function flagUrlMini(code: string): string {
  const iso = COUNTRY_ISO[code?.toUpperCase()] || code?.toLowerCase();
  return `https://flagcdn.com/w40/${iso}.png`;
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
      className="card-enter fixture-card overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[#e94560]/30 hover:shadow-[#e94560]/5 hover:shadow-xl"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between border-white/5 border-b bg-white/5 px-4 py-3 text-xs">
        <span className="font-semibold text-gray-400 uppercase tracking-wider">
          {match.matchNumber ? `Match ${match.matchNumber}` : match.stage.split(" - ")[0]}
        </span>
        {groupLabel ? (
          <span className="rounded border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 font-bold text-yellow-500">
            {groupLabel}
          </span>
        ) : (
          <span className="rounded border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 font-bold text-purple-400 capitalize">
            {match.stage.split(" - ")[0]}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col justify-between p-5" style={{ minHeight: "180px" }}>
        <div className="space-y-3">
          {/* Home team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={flagUrl(match.homeCode)}
                alt={match.homeTeam}
                width={28}
                height={20}
                unoptimized
                className="h-5 w-7 rounded border border-white/10 bg-white/5 object-cover shadow-sm"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
              <span className="max-w-[150px] truncate font-bold text-gray-100 text-sm sm:max-w-[180px]">
                {match.homeTeam}
              </span>
            </div>
            {isFinished && (
              <span
                className={cn(
                  "font-extrabold text-lg",
                  match.homeScore > match.awayScore ? "text-white" : "text-gray-400",
                )}
              >
                {match.homeScore}
              </span>
            )}
          </div>

          {/* Away team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={flagUrl(match.awayCode)}
                alt={match.awayTeam}
                width={28}
                height={20}
                unoptimized
                className="h-5 w-7 rounded border border-white/10 bg-white/5 object-cover shadow-sm"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
              <span className="max-w-[150px] truncate font-bold text-gray-100 text-sm sm:max-w-[180px]">
                {match.awayTeam}
              </span>
            </div>
            {isFinished && (
              <span
                className={cn(
                  "font-extrabold text-lg",
                  match.awayScore > match.homeScore ? "text-white" : "text-gray-400",
                )}
              >
                {match.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Footer: date + status */}
        <div className="mt-4 flex items-center justify-between border-white/5 border-t pt-3 text-gray-500 text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{formatMatchDate(match.date, match.time)}</span>
          </div>

          {isLive ? (
            <span className="flex items-center gap-1 rounded border border-red-500/20 bg-red-500/10 px-2 py-0.5 font-bold text-red-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
              LIVE
            </span>
          ) : isFinished ? (
            <span className="flex items-center gap-1 rounded border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-bold text-green-400">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              FT
            </span>
          ) : (
            <span className="rounded border border-white/8 bg-white/5 px-2 py-0.5 font-medium text-gray-500">
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
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04]">
      <div className="flex justify-between bg-white/5 px-4 py-3">
        <div className="h-3 w-20 rounded-full bg-white/10" />
        <div className="h-3 w-16 rounded-full bg-white/8" />
      </div>
      <div className="space-y-3 p-5" style={{ minHeight: "180px" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-7 rounded bg-white/10" />
            <div className="h-3 w-28 rounded-full bg-white/10" />
          </div>
          <div className="h-5 w-6 rounded bg-white/8" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-7 rounded bg-white/10" />
            <div className="h-3 w-24 rounded-full bg-white/10" />
          </div>
          <div className="h-5 w-6 rounded bg-white/8" />
        </div>
        <div className="mt-auto flex justify-between border-white/5 border-t pt-4">
          <div className="h-3 w-32 rounded-full bg-white/8" />
          <div className="h-5 w-10 rounded bg-white/8" />
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function WorldCupClient() {
  const [upcomingMatches, setUpcomingMatches] = useState<WCMatch[]>([]);
  const [recentResults, setRecentResults] = useState<WCMatch[]>([]);
  const [standings, setStandings] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showStandings, setShowStandings] = useState(false);

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
    } catch {
      setError("Failed to fetch World Cup data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchData();
    const iv = setInterval(() => {
      void fetchData();
    }, 120_000);
    return () => clearInterval(iv);
  }, []);

  const allMatches = useMemo(
    () => [...recentResults, ...upcomingMatches],
    [recentResults, upcomingMatches],
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
        m.stage.toLowerCase().includes(q),
    );
  }, [allMatches, recentResults, upcomingMatches, activeTab, searchQuery]);

  const TABS: { label: string; value: TabValue; count?: number }[] = [
    { label: "All Matches", value: "all", count: allMatches.length },
    {
      label: "Group Stage",
      value: "group",
      count: allMatches.filter((m) => m.stage.toLowerCase().includes("group")).length,
    },
    {
      label: "Knockout Stage",
      value: "knockout",
      count: allMatches.filter((m) => !m.stage.toLowerCase().includes("group")).length,
    },
    { label: "Completed", value: "finished", count: recentResults.length },
    { label: "Upcoming", value: "upcoming", count: upcomingMatches.length },
  ];

  return (
    <main className="mx-auto max-w-screen-xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-r from-yellow-600/20 to-[#e94560]/10 p-6 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(234,179,8,0.08)_0%,_transparent_60%)]" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 font-semibold text-xs text-yellow-400">
              <Trophy className="h-3.5 w-3.5 animate-bounce" />
              FIFA World Cup 2026
            </span>
            <h1 className="font-extrabold text-3xl text-white tracking-tight sm:text-4xl">
              Fixtures &amp; Results
            </h1>
            <p className="mt-2 max-w-xl text-gray-400 text-sm sm:text-base">
              Follow all the matches, dates, scores, and schedules of the 2026 World Cup
              hosted by Canada, Mexico, and USA.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="fixture-search"
                type="text"
                placeholder="Search by country…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pr-8 pl-10 text-sm text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-[#e94560]/30 focus:outline-none focus:ring-2 focus:ring-[#e94560]/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-3 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>

            <button
              type="button"
              id="refresh-wc-btn"
              onClick={() => {
                void fetchData(true);
              }}
              disabled={refreshing || loading}
              className={cn(
                "flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-gray-300 text-sm transition-colors hover:bg-white/10 hover:text-white",
                (refreshing || loading) && "cursor-not-allowed opacity-50",
              )}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Standings Collapsible Panel on WC Page ──────────────────────────── */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setShowStandings((v) => !v)}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-2xl border px-5 py-3 font-semibold text-sm shadow-md transition-all",
            showStandings
              ? "border-yellow-500/30 bg-yellow-500/20 text-yellow-400"
              : "border-yellow-500/20 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
          )}
        >
          <span className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            FIFA World Cup 2026 — Group Stage Standings
          </span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", showStandings && "rotate-180")}
          />
        </button>

        {showStandings && (
          <div className="mt-4 animate-fade-in rounded-3xl border border-white/[0.05] bg-white/[0.02] p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {standings.map((group) => (
                <div
                  key={group.name}
                  className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] transition-all hover:border-yellow-500/30"
                >
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/20">
                      <span className="font-bold text-xs text-yellow-500">
                        {group.name.replace("Group ", "")}
                      </span>
                    </div>
                    <span className="font-semibold text-sm">{group.name}</span>
                  </div>

                  <div className="p-3">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-white/5 border-b text-gray-500">
                          <th className="w-5 pb-1.5 text-left">#</th>
                          <th className="pb-1.5 text-left">Team</th>
                          <th className="pb-1.5 text-center">P</th>
                          <th className="pb-1.5 text-center font-bold">PTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.standings.map((t) => (
                          <tr
                            key={t.team}
                            className="border-white/5 border-b last:border-0"
                          >
                            <td className="py-1.5 text-gray-500">{t.rank}</td>
                            <td className="py-1.5">
                              <div className="flex items-center gap-1.5">
                                <Image
                                  src={flagUrlMini(t.code)}
                                  alt={t.team}
                                  width={16}
                                  height={12}
                                  unoptimized
                                  className="h-3 w-4 rounded-sm object-cover"
                                  onError={(e) =>
                                    ((e.target as HTMLImageElement).style.display =
                                      "none")
                                  }
                                />
                                <span className="max-w-[85px] truncate font-medium">
                                  {t.team}
                                </span>
                              </div>
                            </td>
                            <td className="py-1.5 text-center text-gray-400">
                              {t.played}
                            </td>
                            <td className="py-1.5 text-center font-bold text-white">
                              {t.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Filter Tabs ───────────────────────────────────────────────────────── */}
      <div className="scrollbar-hide mb-6 flex items-center gap-2 overflow-x-auto pb-4">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.value}
            id={`tab-${tab.value}`}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-xl border px-5 py-2.5 font-medium text-sm transition-all",
              activeTab === tab.value
                ? "border-[#e94560] bg-[#e94560] text-white shadow-[#e94560]/25 shadow-lg"
                : "border-white/[0.06] bg-white/5 text-gray-400 hover:bg-white/8 hover:text-white",
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-bold text-[10px]",
                  activeTab === tab.value
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-gray-500",
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
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <span className="text-red-400 text-sm">{error}</span>
          <button
            type="button"
            onClick={() => {
              void fetchData();
            }}
            className="ml-auto text-red-400 text-xs underline hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Fixture Grid ──────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }, (_, i) => `fixture-skeleton-${i}`).map((id) => (
            <FixtureSkeleton key={id} />
          ))}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <Trophy className="h-14 w-14 text-gray-700" />
          <div>
            <h3 className="mb-1 font-semibold text-white">No matches found</h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? `No results for "${searchQuery}".`
                : "No matches in this category."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setSearchQuery("");
            }}
            className="mt-2 flex items-center gap-2 rounded-xl bg-[#e94560] px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-[#c73452]"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-gray-600 text-xs">
            Showing{" "}
            <span className="font-medium text-gray-400">{filteredMatches.length}</span>{" "}
            match
            {filteredMatches.length !== 1 ? "es" : ""}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMatches.map((match, i) => (
              <FixtureCard key={match.id} match={match} index={i} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
