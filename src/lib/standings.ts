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

export interface StandingsResponse {
  league: string;
  leagueSlug: string;
  season: number;
  standings: TeamStanding[];
}

export const LEAGUE_SLUGS: Record<string, string> = {
  "eng.1": "English Premier League",
  "esp.1": "Spanish La Liga",
  "ita.1": "Italian Serie A",
  "ger.1": "German Bundesliga",
  "fra.1": "French Ligue 1",
  "usa.1": "Major League Soccer",
};

export function parseEspnStandings(data: any): TeamStanding[] {
  const children = data.children || [];
  let entries: any[] = [];
  if (children.length > 0) {
    entries = children.flatMap((c: any) => c.standings?.entries || []);
  } else if (data.standings?.entries) {
    entries = data.standings.entries;
  }

  const standings: TeamStanding[] = entries.map((entry: any, index: number) => {
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

  standings.sort((a, b) => a.rank - b.rank || b.points - a.points);
  return standings;
}
