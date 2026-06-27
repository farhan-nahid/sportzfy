import { NextResponse } from "next/server";
import { EZ_CHANNELS } from "@/data/ezchannels";

// Static curated channel list — no external fetch needed
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(
    {
      channels: EZ_CHANNELS,
      fetchedAt: new Date().toISOString(),
      total: EZ_CHANNELS.length,
    },
    {
      headers: {
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      },
    },
  );
}
