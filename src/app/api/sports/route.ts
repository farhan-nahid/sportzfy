import { NextResponse } from "next/server";

export const revalidate = 60; // Cache for 1 minute

const STREAMED_BASE = "https://streamed.pk";

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
    poster: null,
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

/** Normalize a streamed.pk match into our StreamedMatch shape */
function transformStreamedMatch(m: any): any {
  const now = Date.now();
  const matchDate = typeof m.date === "number" ? m.date : new Date(m.date).getTime();
  const isLive = matchDate <= now && now - matchDate < 3 * 60 * 60 * 1000;

  // poster may be a relative path like "/api/images/proxy/..."
  let poster: string | null = null;
  if (m.poster) {
    poster = m.poster.startsWith("http") ? m.poster : `${STREAMED_BASE}${m.poster}`;
  }

  // Team badge keys need to be resolved via the proxy
  const resolveBadge = (badge?: string): string | null => {
    if (!badge) return null;
    if (badge.startsWith("http")) return badge;
    // Short badge keys used by streamed.pk — serve via their proxy
    return `${STREAMED_BASE}/api/images/badge/${badge}`;
  };

  return {
    id: m.id,
    title: m.title,
    category: m.category || "football",
    league: m.category || "Football",
    date: matchDate,
    poster,
    popular: m.popular ?? false,
    isLive,
    teams: {
      home: {
        name: m.teams?.home?.name ?? "Home",
        badge: resolveBadge(m.teams?.home?.badge),
        score: m.teams?.home?.score ?? "",
      },
      away: {
        name: m.teams?.away?.name ?? "Away",
        badge: resolveBadge(m.teams?.away?.badge),
        score: m.teams?.away?.score ?? "",
      },
    },
    sources: Array.isArray(m.sources) ? m.sources : [],
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint") ?? "all";
  const source = searchParams.get("source");
  const matchId = searchParams.get("matchId");

  // Stream request — fetch real streams from streamed.pk
  if (matchId && source) {
    try {
      const streamRes = await fetch(
        `${STREAMED_BASE}/api/stream/${encodeURIComponent(source)}/${encodeURIComponent(matchId)}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Referer: "https://streamed.pk/",
            Accept: "application/json",
          },
          next: { revalidate: 30 },
        },
      );
      if (streamRes.ok) {
        const streamData = await streamRes.json();
        // streamed.pk returns streams where all share same id (the match id)
        // Generate unique IDs using source + streamNo
        if (Array.isArray(streamData) && streamData.length > 0) {
          const mapped = streamData.map((s: any, i: number) => ({
            // Make IDs truly unique: source + streamNo combo
            id: `${source}-${s.streamNo ?? i + 1}`,
            streamNo: s.streamNo ?? i + 1,
            language: s.language || `Server ${i + 1}`,
            hd: s.hd ?? true,
            embedUrl: s.embedUrl ?? null,
            viewers: s.viewers ?? 0,
            source,
          }));
          return NextResponse.json(mapped);
        }
      }
    } catch {
      // fall through to fallback
    }

    // Fallback: no streams available from this source
    return NextResponse.json([]);
  }

  // Legacy matchId-only call without source — return generic embeds
  if (matchId) {
    return NextResponse.json([
      {
        id: `stream-1-${matchId}`,
        streamNo: 1,
        language: "Server 1",
        hd: true,
        embedUrl: `https://embedme.top/embed/alpha/${matchId}/1`,
        source: "alpha",
      },
      {
        id: `stream-2-${matchId}`,
        streamNo: 2,
        language: "Server 2",
        hd: true,
        embedUrl: `https://embedme.top/embed/alpha/${matchId}/2`,
        source: "alpha",
      },
    ]);
  }

  try {
    const matchMap = new Map<string, any>();

    if (endpoint === "football" || endpoint === "all" || endpoint === "live") {
      // Primary: streamed.pk football API
      try {
        const res = await fetch(`${STREAMED_BASE}/api/matches/football`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Referer: "https://streamed.pk/",
            Accept: "application/json",
          },
          next: { revalidate: 60 },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            for (const m of data) {
              const transformed = transformStreamedMatch(m);
              if (!matchMap.has(transformed.id)) {
                matchMap.set(transformed.id, transformed);
              }
            }
          }
        }
      } catch {
        // Fallback to ESPN below
      }

      // If no results from streamed.pk, fallback to ESPN
      if (matchMap.size === 0) {
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

    // Sort: live first, then by date ascending
    allMatches.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return a.date - b.date;
    });

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
