import { NextResponse } from "next/server";

export const revalidate = 60; // Cache for 1 minute

// ESPN Live Public Scoreboard Endpoints
const ESPN_ENDPOINTS = [
  {
    category: "football",
    url: "https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard",
  },
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

function transformEspnEvent(event: any, category: string): any {
  const comp = event.competitions?.[0];
  const homeComp = comp?.competitors?.find((c: any) => c.homeAway === "home");
  const awayComp = comp?.competitors?.find((c: any) => c.homeAway === "away");

  const homeName = homeComp?.team?.displayName || homeComp?.team?.name || "Home Team";
  const awayName = awayComp?.team?.displayName || awayComp?.team?.name || "Away Team";
  const homeLogo = homeComp?.team?.logo ?? null;
  const awayLogo = awayComp?.team?.logo ?? null;

  const state = event.status?.type?.state; // "in" = live, "pre" = upcoming, "post" = finished
  const isLive = state === "in";

  const title = event.name || `${homeName} vs ${awayName}`;
  const leagueName = comp?.league?.name || event.season?.slug || category;

  return {
    id: event.id || `match-${Math.random()}`,
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
      { source: "server1", id: event.id },
      { source: "server2", id: event.id },
    ],
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint") ?? "all";
  const source = searchParams.get("source");
  const matchId = searchParams.get("matchId");

  // Stream request
  if (source && matchId) {
    return NextResponse.json([
      {
        id: `stream-1-${matchId}`,
        streamNo: 1,
        language: "English",
        hd: true,
        embedUrl: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
        source: "server1",
        m3u8: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8",
      },
      {
        id: `stream-2-${matchId}`,
        streamNo: 2,
        language: "English",
        hd: true,
        embedUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        source: "server2",
        m3u8: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      },
    ]);
  }

  try {
    let endpointsToFetch = ESPN_ENDPOINTS;

    if (endpoint === "football") {
      endpointsToFetch = ESPN_ENDPOINTS.filter((e) => e.category === "football");
    } else if (endpoint !== "all" && endpoint !== "live") {
      endpointsToFetch = ESPN_ENDPOINTS.filter((e) => e.category === endpoint);
    }

    const fetchedResults = await Promise.allSettled(
      endpointsToFetch.map(async (item) => {
        const res = await fetch(item.url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        const events = data.events || [];
        return events.map((ev: any) => transformEspnEvent(ev, item.category));
      }),
    );

    let allMatches: any[] = [];
    for (const res of fetchedResults) {
      if (res.status === "fulfilled" && Array.isArray(res.value)) {
        allMatches.push(...res.value);
      }
    }

    // Filter live if requested
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
    console.error("[/api/sports] Error fetching live matches:", error);
    return NextResponse.json([], { status: 500 });
  }
}
