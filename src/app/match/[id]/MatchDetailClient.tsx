"use client";

import { Calendar, ChevronLeft, Loader2, WifiOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import MatchCard from "@/components/shared/MatchCard";
import SportBadge from "@/components/shared/SportBadge";
import type { StreamedMatch, StreamedStream } from "@/lib/streamed";
import {
  fetchMatchStreams,
  formatMatchDate,
  formatMatchTime,
  getSportColor,
  getSportIcon,
  isMatchLive,
} from "@/lib/streamed";
import StreamPlayer from "./MatchPlayer";

/** Try football endpoint first, then all-sports as fallback */
async function findMatch(
  matchId: string,
): Promise<{ match: StreamedMatch | null; all: StreamedMatch[] }> {
  // 1. Football endpoint (streamed.pk data)
  try {
    const res = await fetch("/api/sports?endpoint=football");
    if (res.ok) {
      const data: StreamedMatch[] = await res.json();
      const found = data.find((m) => m.id === matchId);
      if (found) return { match: found, all: data };
    }
  } catch {
    /* ignore */
  }

  // 2. All-sports fallback (ESPN data for other sports)
  try {
    const res = await fetch("/api/sports?endpoint=all");
    if (res.ok) {
      const data: StreamedMatch[] = await res.json();
      const found = data.find((m) => m.id === matchId);
      return { match: found ?? null, all: data };
    }
  } catch {
    /* ignore */
  }

  return { match: null, all: [] };
}

interface Props {
  matchId: string;
}

export default function MatchDetailClient({ matchId }: Props) {
  const [match, setMatch] = useState<StreamedMatch | null>(null);
  const [related, setRelated] = useState<StreamedMatch[]>([]);
  const [streams, setStreams] = useState<StreamedStream[]>([]);
  const [loadingMatch, setLoadingMatch] = useState(true);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoadingMatch(true);
      setError(null);
      try {
        // Try football endpoint first (streamed.pk), then all-sports fallback
        const { match: found, all } = await findMatch(matchId);
        setMatch(found ?? null);

        if (found) {
          // Related: same category, not this match
          const rel = all
            .filter((m) => m.category === found.category && m.id !== matchId)
            .slice(0, 5);
          setRelated(rel);

          // Fetch streams for each source the match has
          setLoadingStreams(true);
          try {
            const sources = found.sources ?? [];
            if (sources.length === 0) {
              setStreams([]);
            } else {
              const streamArrays = await Promise.all(
                sources
                  .slice(0, 5)
                  .map((s) =>
                    fetchMatchStreams(s.source, s.id).catch(() => [] as StreamedStream[]),
                  ),
              );
              // Flatten — IDs are unique per source+streamNo
              const flat: StreamedStream[] = streamArrays.flat();
              // Sort by viewers descending (most-watched first)
              flat.sort((a, b) => (b.viewers ?? 0) - (a.viewers ?? 0));
              setStreams(flat);
            }
          } catch {
            setStreams([]);
          } finally {
            setLoadingStreams(false);
          }
        }
      } catch {
        setError("Could not load match data. Check your connection.");
      } finally {
        setLoadingMatch(false);
        setLoadingStreams(false);
      }
    }

    void load();
  }, [matchId]);

  if (loadingMatch) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground text-sm">Loading match data…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
        <WifiOff className="h-14 w-14 text-red-400/60" />
        <div>
          <h2 className="font-bold text-foreground text-xl">Connection Error</h2>
          <p className="mt-1 text-muted-foreground text-sm">{error}</p>
        </div>
        <Link
          href="/schedule"
          className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
        >
          ← Back to Schedule
        </Link>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
        <span className="text-5xl">📅</span>
        <div>
          <h2 className="font-bold text-foreground text-xl">Match Not Found</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            This match may have ended or is not available.
          </p>
        </div>
        <Link
          href="/schedule"
          className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
        >
          ← Back to Schedule
        </Link>
      </main>
    );
  }

  const live = isMatchLive(match);
  const color = getSportColor(match.category);
  const icon = getSportIcon(match.category);

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden border-white/[0.06] border-b py-8"
        style={{ background: `linear-gradient(135deg, ${color}10 0%, transparent 60%)` }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="orb-1 absolute -top-24 -left-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
            style={{ background: color }}
          />
        </div>
        <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/live"
            className="mb-4 inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to live sports
          </Link>

          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <SportBadge
                  category={match.category}
                  color={color}
                  icon={icon}
                  size="md"
                />
                {live && (
                  <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-1 font-bold text-[11px] text-red-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                    LIVE
                  </span>
                )}
                {match.popular && (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-semibold text-[10px] text-amber-400">
                    ⭐ Popular
                  </span>
                )}
              </div>
              <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
                {match.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatMatchDate(match.date)} · {formatMatchTime(match.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Player column */}
          <div>
            <StreamPlayer
              match={match}
              streams={streams}
              loadingStreams={loadingStreams}
            />

            {/* Match info */}
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <h2 className="mb-3 font-bold text-foreground text-sm">
                Match Information
              </h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    label: "Sport",
                    value: `${icon} ${match.category?.replace(/-/g, " ")}`,
                  },
                  { label: "Date", value: formatMatchDate(match.date) },
                  { label: "Time", value: formatMatchTime(match.date) },
                  {
                    label: "Status",
                    value: live
                      ? "🔴 Live"
                      : match.date < Date.now()
                        ? "✅ Finished"
                        : "⏰ Scheduled",
                  },
                  ...(match.sources
                    ? [
                        {
                          label: "Stream Sources",
                          value: `${match.sources.length} source${match.sources.length !== 1 ? "s" : ""}`,
                        },
                      ]
                    : []),
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-muted-foreground text-xs capitalize">{label}</dt>
                    <dd className="mt-0.5 font-semibold text-foreground text-sm capitalize">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* FAQ */}
            <div className="mt-6 space-y-3">
              <h2 className="font-bold text-foreground text-lg">
                Frequently Asked Questions
              </h2>
              {[
                {
                  q: `How can I watch ${match.title} live online?`,
                  a: `Use the player above to watch ${match.title}. Click a server button to load the live stream. Multiple servers are available if one doesn't work.`,
                },
                {
                  q: "Is it free to watch?",
                  a: "Yes, all streams listed on Sportzfy are publicly available and free to watch. No subscription or registration required.",
                },
                {
                  q: "What if the stream doesn't load?",
                  a: "Try switching to a different server using the buttons below the player. Streams can vary in availability based on your location.",
                },
                {
                  q: "Does it work on mobile?",
                  a: "Sportzfy match pages are fully responsive and designed for mobile, tablet, and desktop browsers.",
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold text-foreground text-sm">
                    {q}
                    <span className="text-muted-foreground text-xs transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-20 space-y-6">
            {related.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <h3 className="mb-3 font-bold text-foreground text-sm">
                  Related Matches
                </h3>
                <div className="space-y-2">
                  {related.map((m) => (
                    <MatchCard key={m.id} match={m} showDate />
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <h3 className="mb-2 font-bold text-foreground text-sm">
                Watch Live Channels
              </h3>
              <p className="mb-4 text-muted-foreground text-xs leading-relaxed">
                Browse 1000+ free live TV channels including sports, news, and
                entertainment.
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
      </main>
    </>
  );
}
