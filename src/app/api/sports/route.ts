import { NextResponse } from "next/server";

export const revalidate = 60; // Cache for 1 minute

const SOCCER_ENDPOINTS = [
  "all",
  "eng.1",
  "esp.1",
  "ita.1",
  "ger.1",
  "fra.1",
  "usa.1",
  "uefa.champions",
];

const OTHER_ENDPOINTS = [
  {
    category: "baseball",
    url: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
  },
  {
    category: "basketball",
    url: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
  },
  {
    category: "american-football",
    url: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
  },
  {
    category: "ice-hockey",
    url: "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard",
  },
];

function transformEspnEvent(event: any, category = "football"): any {
  const comp = event.competitions?.[0];
  const homeComp = comp?.competitors?.find((c: any) => c.homeAway === "home");
  const awayComp = comp?.competitors?.find((c: any) => c.homeAway === "away");

  const homeName = homeComp?.team?.displayName || homeComp?.team?.name || "Home Team";
  const awayName = awayComp?.team?.displayName || awayComp?.team?.name || "Away Team";
  const homeLogo = homeComp?.team?.logo ?? null;
  const awayLogo = awayComp?.team?.logo ?? null;

  const state = event.status?.type?.state; // "in" = live, "pre" = upcoming, "post" = finished
  const isLive = state === "in" || event.status?.type?.name === "STATUS_IN_PROGRESS";

  const title = event.name || `${homeName} vs ${awayName}`;
  const leagueName =
    comp?.league?.name ||
    event.league?.name ||
    event.season?.slug ||
    (category === "football" ? "Football" : category);

  return {
    id: String(event.id || `match-${Math.random()}`),
    title,
    category,
    league: leagueName,
    date: new Date(event.date).getTime(),
    popular: true,
    isLive,
    statusState: state,
    statusDetail: event.status?.type?.detail || "Scheduled",
    teams: {
      home: { name: homeName, badge: homeLogo, score: homeComp?.score ?? "0" },
      away: { name: awayName, badge: awayLogo, score: awayComp?.score ?? "0" },
    },
    sources: [
      { source: "server1", id: String(event.id) },
      { source: "server2", id: String(event.id) },
    ],
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint") ?? "all";
  const source = searchParams.get("source");
  const matchId = searchParams.get("matchId");

  // Stream request
  if (matchId) {
    return NextResponse.json([
      {
        id: `stream-1-${matchId}`,
        streamNo: 1,
        language: "Server 1",
        hd: true,
        embedUrl: `https://www.freeliveiptv.com/match/${matchId}`,
        source: "server1",
      },
      {
        id: `stream-2-${matchId}`,
        streamNo: 2,
        language: "Server 2",
        hd: true,
        embedUrl: `https://daddylive.mp/embed/stream-${matchId}.php`,
        source: "server2",
      },
      {
        id: `stream-3-${matchId}`,
        streamNo: 3,
        language: "Server 3",
        hd: true,
        embedUrl: `https://vidsrc.me/embed/sports/${matchId}`,
        source: "server3",
      },
      {
        id: `stream-4-${matchId}`,
        streamNo: 4,
        language: "Server 4",
        hd: true,
        embedUrl: `https://streamed.su/watch/${matchId}`,
        source: "server4",
      },
    ]);
  }

  try {
    const matchMap = new Map<string, any>();

    if (endpoint === "football" || endpoint === "all" || endpoint === "live") {
      const soccerFetches = SOCCER_ENDPOINTS.map(async (leagueKey) => {
        try {
          const res = await fetch(
            `https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueKey}/scoreboard`,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                Accept: "application/json",
              },
              next: { revalidate: 60 },
            },
          );
          if (!res.ok) return;
          const data = await res.json();
          const events = data.events || [];
          for (const ev of events) {
            const transformed = transformEspnEvent(ev, "football");
            if (!matchMap.has(transformed.id)) {
              matchMap.set(transformed.id, transformed);
            }
          }
        } catch {
          // ignore individual fetch errors
        }
      });
      await Promise.all(soccerFetches);
    }

    if (endpoint === "all") {
      const otherFetches = OTHER_ENDPOINTS.map(async (item) => {
        try {
          const res = await fetch(item.url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
              Accept: "application/json",
            },
            next: { revalidate: 60 },
          });
          if (!res.ok) return;
          const data = await res.json();
          const events = data.events || [];
          for (const ev of events) {
            const transformed = transformEspnEvent(ev, item.category);
            if (!matchMap.has(transformed.id)) {
              matchMap.set(transformed.id, transformed);
            }
          }
        } catch {
          // ignore
        }
      });
      await Promise.all(otherFetches);
    }

    let allMatches = Array.from(matchMap.values());

    if (endpoint === "live") {
      allMatches = allMatches.filter((m) => m.isLive);
    }

    // Sort by date (oldest/earliest first)
    allMatches.sort((a, b) => a.date - b.date);

    return NextResponse.json(allMatches, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error: any) {
    console.error("[/api/sports] Error fetching matches:", error);
    return NextResponse.json([]);
  }
}
