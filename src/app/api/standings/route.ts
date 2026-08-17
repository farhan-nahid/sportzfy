import { NextResponse } from "next/server";
import { LEAGUE_SLUGS, parseEspnStandings } from "@/lib/standings";

export const revalidate = 300; // Cache for 5 minutes

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get("league") ?? "eng.1";

  const urls = [
    `https://site.api.espn.com/apis/v2/sports/soccer/${encodeURIComponent(league)}/standings`,
    `https://site.web.api.espn.com/apis/v2/sports/soccer/${encodeURIComponent(league)}/standings`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
        next: { revalidate: 300 },
      });

      if (res.ok) {
        const data = await res.json();
        const standings = parseEspnStandings(data);

        if (standings.length > 0) {
          return NextResponse.json(
            {
              league: LEAGUE_SLUGS[league] || data.name || "League Standings",
              leagueSlug: league,
              season: data.season || new Date().getFullYear(),
              standings,
            },
            {
              headers: {
                "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
              },
            },
          );
        }
      }
    } catch (error) {
      console.error(`[/api/standings] Failed fetching ${url}:`, error);
    }
  }

  return NextResponse.json(
    { error: "Failed to load live league standings", standings: [] },
    { status: 502 },
  );
}
