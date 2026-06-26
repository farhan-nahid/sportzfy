import HomeClient from "@/components/home/HomeClient";
import Navbar from "@/components/layout/Navbar";
import type { Channel } from "@/data/channels";

/**
 * Fetch channels server-side for fast initial render.
 * Falls back to empty array if the API is unavailable.
 */
async function getChannels(): Promise<{ channels: Channel[]; fetchedAt: string | null }> {
  try {
    // In production, call the absolute URL; in development use relative
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/channels`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return { channels: [], fetchedAt: null };
    const data = await res.json();
    return { channels: data.channels ?? [], fetchedAt: data.fetchedAt ?? null };
  } catch {
    // During build / when API isn't yet running, return empty — client will fetch
    return { channels: [], fetchedAt: null };
  }
}

export default async function HomePage() {
  const { channels, fetchedAt } = await getChannels();

  const totalChannels = channels.length;
  const liveCount = channels.filter((c) => c.isLive).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero strip */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-red-500/5 pointer-events-none" />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
              <span className="text-gradient-brand">Live Sports,</span>
              <br />
              <span className="text-foreground">Anywhere. Anytime.</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Stream cricket, football, basketball, tennis and more — live from
              public IPTV feeds worldwide. Click any channel to watch instantly.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-4 mt-5">
              {[
                { label: "Live Now", value: liveCount || "…", color: "text-red-400" },
                { label: "Countries", value: "10+", color: "text-primary" },
                { label: "Sports", value: "10", color: "text-emerald-400" },
                { label: "Channels", value: totalChannels || "…", color: "text-amber-400" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-1.5">
                  <span className={`text-xl font-extrabold ${stat.color}`}>
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content — client component handles filters + player */}
      <HomeClient initialChannels={channels} initialFetchedAt={fetchedAt} />

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 py-6">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-lg">📺</span>
            <span className="font-semibold text-foreground">Sportzfy</span>
            <span>– Live Sports Streaming via IPTV</span>
          </div>
          <p>
            Powered by{" "}
            <a
              href="https://github.com/iptv-org/iptv"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              iptv-org
            </a>{" "}
            public playlists. For personal use only.
          </p>
        </div>
      </footer>
    </div>
  );
}
