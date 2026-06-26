import { IPTV_SPORTS_PLAYLIST_URL, parseM3UToChannels } from "@/lib/iptv";
import { NextResponse } from "next/server";

export const revalidate = 3600; // ISR: re-fetch every 1 hour

export async function GET() {
  try {
    const res = await fetch(IPTV_SPORTS_PLAYLIST_URL, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Sportzfy/1.0" },
    });

    if (!res.ok) {
      throw new Error(`Playlist fetch failed: ${res.status} ${res.statusText}`);
    }

    const raw = await res.text();
    const channels = parseM3UToChannels(raw, 300);

    return NextResponse.json(
      { channels, fetchedAt: new Date().toISOString(), total: channels.length },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[/api/channels] Error fetching IPTV playlist:", error);
    return NextResponse.json(
      { error: "Failed to load channels", channels: [], fetchedAt: null },
      { status: 502 }
    );
  }
}
