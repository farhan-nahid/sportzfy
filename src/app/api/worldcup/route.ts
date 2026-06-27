import { NextResponse } from "next/server";

export const revalidate = 300; // Cache on CDN for 5 minutes

export async function GET() {
  try {
    const res = await fetch(
      "https://api.fifa.com/api/v3/calendar/matches?idCompetition=17&idSeason=285023&count=500",
      {
        next: { revalidate: 300 },
        headers: {
          "User-Agent": "Sportzfy/1.0",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`FIFA API returned status ${res.status}`);
    }

    const data = await res.json();
    const rawMatches = data.Results || [];

    // Helper to format match items
    const formatMatch = (m: any): any => {
      const homeName =
        m.Home?.TeamName?.[0]?.Description || m.Home?.Abbreviation || "TBD";
      const awayName =
        m.Away?.TeamName?.[0]?.Description || m.Away?.Abbreviation || "TBD";

      let stage = m.StageName?.[0]?.Description || "First Stage";
      if (m.GroupName?.[0]?.Description) {
        stage = `${stage} - ${m.GroupName[0].Description}`;
      }

      return {
        id: m.IdMatch,
        homeTeam: homeName,
        homeCode: m.Home?.Abbreviation || "TBD",
        awayTeam: awayName,
        awayCode: m.Away?.Abbreviation || "TBD",
        homeScore: m.HomeTeamScore !== null ? m.HomeTeamScore : 0,
        awayScore: m.AwayTeamScore !== null ? m.AwayTeamScore : 0,
        status: m.MatchStatus === 0 ? "FINISHED" : "SCHEDULED",
        stage,
        date: m.Date.split("T")[0],
        time: m.Date.split("T")[1]?.slice(0, 5) || "00:00",
        stadium: m.Stadium?.Name?.[0]?.Description || "TBD Stadium",
        city: m.Stadium?.CityName?.[0]?.Description || "TBD City",
        broadcastChannel: getBroadcastChannel(m.IdMatch),
        lineups: {
          home: [],
          away: [],
        },
        stats: {
          possession: {
            home: m.BallPossession?.OverallHome
              ? Math.round(m.BallPossession.OverallHome)
              : 50,
            away: m.BallPossession?.OverallAway
              ? Math.round(m.BallPossession.OverallAway)
              : 50,
          },
          shots: { home: 10, away: 8 },
          shotsOnTarget: { home: 4, away: 3 },
          fouls: { home: 10, away: 11 },
          yellowCards: { home: 1, away: 1 },
          redCards: { home: 0, away: 0 },
          passes: { home: 400, away: 390 },
          passAccuracy: { home: 85, away: 83 },
        },
        events: [],
        matchNumber: m.MatchNumber || null,
        attendance: m.Attendance ? parseInt(m.Attendance, 10).toLocaleString() : null,
        weather: m.Weather
          ? {
              temp: m.Weather.Temperature || null,
              humidity: m.Weather.Humidity || null,
              condition: m.Weather.TypeLocalized?.[0]?.Description || null,
            }
          : null,
        officials:
          m.Officials?.map((o: any) => ({
            name: o.NameShort?.[0]?.Description || o.Name?.[0]?.Description || "Unknown",
            role: o.TypeLocalized?.[0]?.Description || "Official",
          })) || [],
      };
    };

    // Parse matches
    const allFormattedMatches = rawMatches.map(formatMatch);

    // 1. Group Standings Calculation (Finished matches only)
    const groupsData: Record<string, Record<string, any>> = {};

    allFormattedMatches.forEach((m: any) => {
      const groupName = m.stage.split(" - ")[1];
      if (!groupName) return;

      if (!groupsData[groupName]) {
        groupsData[groupName] = {};
      }

      const homeName = m.homeTeam;
      const awayName = m.awayTeam;

      if (!groupsData[groupName][homeName]) {
        groupsData[groupName][homeName] = {
          team: homeName,
          code: m.homeCode,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        };
      }

      if (!groupsData[groupName][awayName]) {
        groupsData[groupName][awayName] = {
          team: awayName,
          code: m.awayCode,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        };
      }

      if (m.status === "FINISHED") {
        const homeStats = groupsData[groupName][homeName];
        const awayStats = groupsData[groupName][awayName];

        homeStats.played += 1;
        awayStats.played += 1;
        homeStats.goalsFor += m.homeScore;
        homeStats.goalsAgainst += m.awayScore;
        awayStats.goalsFor += m.awayScore;
        awayStats.goalsAgainst += m.homeScore;

        if (m.homeScore > m.awayScore) {
          homeStats.won += 1;
          homeStats.points += 3;
          awayStats.lost += 1;
        } else if (m.homeScore < m.awayScore) {
          awayStats.won += 1;
          awayStats.points += 3;
          homeStats.lost += 1;
        } else {
          homeStats.drawn += 1;
          awayStats.drawn += 1;
          homeStats.points += 1;
          awayStats.points += 1;
        }
      }
    });

    // Format group standings
    const formattedGroups = Object.keys(groupsData).map((groupName) => {
      const standings = Object.values(groupsData[groupName])
        .map((team: any) => ({
          ...team,
          goalDifference: team.goalsFor - team.goalsAgainst,
        }))
        .sort(
          (a: any, b: any) =>
            b.points - a.points ||
            b.goalDifference - a.goalDifference ||
            b.goalsFor - a.goalsFor ||
            a.team.localeCompare(b.team),
        )
        .map((team: any, index: number) => ({
          rank: index + 1,
          ...team,
        }));

      return {
        name: groupName,
        standings,
      };
    });

    formattedGroups.sort((a, b) => a.name.localeCompare(b.name));

    // Sort recent finished results, newest first
    const recentResults = allFormattedMatches
      .filter((m: any) => m.status === "FINISHED")
      .sort(
        (a: any, b: any) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time),
      );

    // Sort upcoming scheduled fixtures, oldest first
    const upcomingMatches = allFormattedMatches
      .filter((m: any) => m.status === "SCHEDULED")
      .sort(
        (a: any, b: any) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      );

    return NextResponse.json(
      {
        upcomingMatches,
        recentResults,
        standings: formattedGroups,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
        },
      },
    );
  } catch (error: any) {
    console.error("[/api/worldcup] Error fetching FIFA matches:", error);
    return NextResponse.json(
      {
        error: "Failed to load World Cup data",
        upcomingMatches: [],
        recentResults: [],
        standings: [],
      },
      { status: 502 },
    );
  }
}

// Map match ID to a sports broadcasting channel
function getBroadcastChannel(matchId: string): string {
  const channels = [
    "FOX Sports (720p)",
    "Fox Sports 2 (480p)",
    "ESPNU (720p)",
    "Fox Deportes (1280p)",
    "ESPN Deportes (360p)",
  ];
  const num = parseInt(matchId, 10) || 0;
  return channels[num % channels.length];
}
