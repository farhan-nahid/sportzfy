import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

const IPTV_ORG_CHANNELS = "https://iptv-org.github.io/api/channels.json";
const IPTV_ORG_STREAMS = "https://iptv-org.github.io/api/streams.json";

// Sport-related category keywords
const SPORT_KEYWORDS = [
  "sports",
  "football",
  "soccer",
  "basketball",
  "baseball",
  "cricket",
  "rugby",
  "tennis",
  "racing",
  "motorsport",
  "golf",
  "boxing",
  "mma",
  "fighting",
  "hockey",
];

export interface IptvChannel {
  id: string;
  name: string;
  logo: string;
  country: string;
  categories: string[];
  website: string | null;
  streams: IptvStream[];
}

export interface IptvStream {
  url: string;
  quality: string | null;
  label: string | null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "all";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "200", 10), 500);

  try {
    // Fetch channels + streams in parallel
    const [channelsRes, streamsRes] = await Promise.all([
      fetch(IPTV_ORG_CHANNELS, {
        cache: "no-store",
        headers: { "User-Agent": "Sportzfy/1.0" },
      }),
      fetch(IPTV_ORG_STREAMS, {
        cache: "no-store",
        headers: { "User-Agent": "Sportzfy/1.0" },
      }),
    ]);

    if (!channelsRes.ok || !streamsRes.ok) {
      throw new Error("Failed to fetch from iptv-org");
    }

    const [rawChannels, rawStreams]: [any[], any[]] = await Promise.all([
      channelsRes.json(),
      streamsRes.json(),
    ]);

    // Build a stream map keyed by channel ID
    const streamMap = new Map<string, IptvStream[]>();
    for (const s of rawStreams) {
      if (!s.channel) continue;
      if (!streamMap.has(s.channel)) streamMap.set(s.channel, []);
      streamMap.get(s.channel)!.push({
        url: s.url,
        quality: s.quality ?? null,
        label: s.label ?? null,
      });
    }

    // Filter channels based on category, exclude closed/nsfw/no-streams
    let filtered = rawChannels.filter((ch: any) => {
      if (ch.is_nsfw) return false;
      if (ch.closed) return false;
      if (!streamMap.has(ch.id)) return false;
      return true;
    });

    if (category !== "all") {
      if (category === "sports") {
        filtered = filtered.filter((ch: any) =>
          ch.categories?.some((cat: string) =>
            SPORT_KEYWORDS.some((kw) => cat.toLowerCase().includes(kw)),
          ),
        );
      } else {
        filtered = filtered.filter((ch: any) => ch.categories?.includes(category));
      }
    }

    // Sort: sport channels first, then by name
    filtered.sort((a: any, b: any) => {
      const aIsSport = a.categories?.some((cat: string) =>
        SPORT_KEYWORDS.some((kw) => cat.toLowerCase().includes(kw)),
      );
      const bIsSport = b.categories?.some((cat: string) =>
        SPORT_KEYWORDS.some((kw) => cat.toLowerCase().includes(kw)),
      );
      if (aIsSport && !bIsSport) return -1;
      if (!aIsSport && bIsSport) return 1;
      return a.name.localeCompare(b.name);
    });

    // Limit results and transform
    const channels: IptvChannel[] = filtered.slice(0, limit).map((ch: any) => ({
      id: ch.id,
      name: ch.name,
      logo: "",
      country: ch.country ?? "",
      categories: ch.categories ?? [],
      website: ch.website ?? null,
      streams: (streamMap.get(ch.id) ?? []).slice(0, 4), // max 4 streams per channel
    }));

    return NextResponse.json(
      { channels, total: filtered.length },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=300",
        },
      },
    );
  } catch (error: any) {
    console.error("[/api/channels] Error:", error.message);
    return NextResponse.json(
      { error: "Failed to load channel data", channels: [], total: 0 },
      { status: 502 },
    );
  }
}
