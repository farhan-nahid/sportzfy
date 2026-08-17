import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

const LEAGUE_SLUGS: Record<string, string> = {
  "eng.1": "English Premier League",
  "esp.1": "Spanish La Liga",
  "ita.1": "Italian Serie A",
  "ger.1": "German Bundesliga",
  "fra.1": "French Ligue 1",
  "usa.1": "Major League Soccer",
};

export interface TeamStanding {
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get("league") ?? "eng.1";

  const targetUrl = `https://site.api.espn.com/apis/v2/sports/soccer/${encodeURIComponent(league)}/standings`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`ESPN API returned HTTP ${res.status}`);
    }

    const data = await res.json();
    const standingsGroup = data.children?.[0]?.standings?.entries || [];

    const standings: TeamStanding[] = standingsGroup.map((entry: any, index: number) => {
      const statsMap = new Map<string, any>();
      for (const s of entry.stats || []) {
        statsMap.set(s.name, s.value);
      }

      const rank = statsMap.get("rank") ?? index + 1;
      const played = statsMap.get("gamesPlayed") ?? 0;
      const won = statsMap.get("wins") ?? 0;
      const drawn = statsMap.get("ties") ?? 0;
      const lost = statsMap.get("losses") ?? 0;
      const goalsFor = statsMap.get("pointsFor") ?? 0;
      const goalsAgainst = statsMap.get("pointsAgainst") ?? 0;
      const goalDiff = statsMap.get("pointDifferential") ?? 0;
      const points = statsMap.get("points") ?? 0;

      return {
        rank,
        teamId: entry.team?.id || `team-${index}`,
        teamName: entry.team?.displayName || entry.team?.name || "Team",
        teamLogo: entry.team?.logos?.[0]?.href ?? null,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDiff,
        points,
      };
    });

    // Sort by rank / points
    standings.sort((a, b) => a.rank - b.rank || b.points - a.points);

    return NextResponse.json(
      {
        league: LEAGUE_SLUGS[league] || data.name || "League Standings",
        leagueSlug: league,
        season: data.season || new Date().getFullYear(),
        standings,
      },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
        },
      },
    );
  } catch (error: any) {
    console.error("[/api/standings] Error fetching standings:", error);
    return NextResponse.json(
      { error: "Failed to load league standings", standings: [] },
      { status: 502 },
    );
  }
}
