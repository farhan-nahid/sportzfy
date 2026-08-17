/**
 * Streamed.su API client — routes through /api/sports proxy for fast, reliable data loading
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StreamedTeam {
  name: string;
  badge?: string;
  score?: string;
}

export interface StreamedSource {
  source: string; // e.g. "daddylive", "alpha", "streamtp"
  id: string;
}

export interface StreamedMatch {
  id: string;
  title: string;
  category: string;
  league?: string;
  date: number; // Unix timestamp (ms)
  poster?: string | null;
  popular: boolean;
  teams?: {
    home?: StreamedTeam;
    away?: StreamedTeam;
  };
  sources?: StreamedSource[];
}

export interface StreamedStream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
  m3u8?: string;
}

// ─── Display helpers ──────────────────────────────────────────────────────────

export const SPORT_ICONS: Record<string, string> = {
  football: "⚽",
  basketball: "🏀",
  baseball: "⚾",
  rugby: "🏉",
  cricket: "🏏",
  tennis: "🎾",
  "motor-sports": "🏎️",
  fight: "🥊",
  "american-football": "🏈",
  "ice-hockey": "🏒",
  golf: "⛳",
  other: "🎯",
};

export const SPORT_COLORS: Record<string, string> = {
  football: "#22c55e",
  basketball: "#f97316",
  baseball: "#eab308",
  rugby: "#a855f7",
  cricket: "#06b6d4",
  tennis: "#84cc16",
  "motor-sports": "#ef4444",
  fight: "#ec4899",
  "american-football": "#3b82f6",
  "ice-hockey": "#64748b",
  golf: "#8b5cf6",
  other: "#6b7280",
};

export function getSportIcon(category: string): string {
  return SPORT_ICONS[category.toLowerCase()] ?? "🎯";
}

export function getSportColor(category: string): string {
  return SPORT_COLORS[category.toLowerCase()] ?? "#6b7280";
}

export function formatMatchTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatMatchDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function isMatchLive(match: StreamedMatch): boolean {
  const now = Date.now();
  const matchTime = match.date;
  // Consider live if started within the last 3 hours or explicitly in past 30 min
  return matchTime <= now && now - matchTime < 3 * 60 * 60 * 1000;
}

export function groupMatchesByDay(
  matches: StreamedMatch[],
): { label: string; date: string; matches: StreamedMatch[] }[] {
  const groups = new Map<string, StreamedMatch[]>();
  for (const match of matches) {
    const d = new Date(match.date);
    const key = d.toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(match);
  }
  return Array.from(groups.entries()).map(([dateStr, ms]) => ({
    label: new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    date: dateStr,
    matches: ms,
  }));
}

// ─── Client API functions using local /api/sports proxy ───────────────────────

/** Fetch all matches */
export async function fetchAllMatches(): Promise<StreamedMatch[]> {
  const res = await fetch("/api/sports?endpoint=all");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Fetch football-only matches */
export async function fetchFootballMatches(): Promise<StreamedMatch[]> {
  const res = await fetch("/api/sports?endpoint=football");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Fetch live matches */
export async function fetchLiveMatches(): Promise<StreamedMatch[]> {
  const res = await fetch("/api/sports?endpoint=live");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Fetch streams for a match */
export async function fetchMatchStreams(
  source: string,
  matchId: string,
): Promise<StreamedStream[]> {
  const res = await fetch(
    `/api/sports?source=${encodeURIComponent(source)}&matchId=${encodeURIComponent(matchId)}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
