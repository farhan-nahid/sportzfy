"use client";

import { Loader2, Radio, RefreshCw, WifiOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MatchCard from "@/components/shared/MatchCard";
import type { StreamedMatch } from "@/lib/streamed";
import {
  fetchLiveMatches,
  getSportColor,
  getSportIcon,
  isMatchLive,
} from "@/lib/streamed";

export default function LiveClient() {
  const [matches, setMatches] = useState<StreamedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLiveMatches();
      // Double-check with isMatchLive since the endpoint may include recent matches
      const live = Array.isArray(data) ? data.filter(isMatchLive) : [];
      setMatches(live);
      setLastFetched(new Date());
    } catch {
      setError("Could not load live matches. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const interval = setInterval(load, 60 * 1000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, StreamedMatch[]>();
    for (const m of matches) {
      const key = m.category?.toLowerCase() ?? "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return map;
  }, [matches]);

  return (
    <div>
      {/* Header bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-bold text-red-400 text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            Live now
          </span>
          {!loading && (
            <span className="text-muted-foreground text-xs">
              {matches.length} event{matches.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-muted-foreground text-sm transition-all hover:bg-white/[0.08] hover:text-foreground disabled:opacity-40"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          {lastFetched
            ? lastFetched.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Refresh"}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading live matches…</p>
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
            onClick={load}
            className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <Radio className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <h2 className="font-semibold text-foreground text-lg">
              No live events right now
            </h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Check the{" "}
              <Link
                href="/football"
                className="text-primary underline-offset-4 hover:underline"
              >
                football section
              </Link>{" "}
              for upcoming matches.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && matches.length > 0 && (
        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([sport, sportMatches]) => (
            <div key={sport}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{getSportIcon(sport)}</span>
                <h2
                  className="font-bold text-lg capitalize"
                  style={{ color: getSportColor(sport) }}
                >
                  {sport.replace(/-/g, " ")}
                </h2>
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 font-medium text-red-400 text-xs">
                  {sportMatches.length} live
                </span>
              </div>
              <div className="space-y-2">
                {sportMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
