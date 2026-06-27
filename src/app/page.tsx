import HeroSection from "@/components/home/HeroSection";
import HomeClient from "@/components/home/HomeClient";
import Navbar from "@/components/layout/Navbar";
import type { EzChannel } from "@/data/ezchannels";

/**
 * Fetch curated channels server-side for fast initial render.
 * Falls back to empty array if the API is unavailable.
 */
async function getChannels(): Promise<EzChannel[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/channels`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.channels ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const channels = await getChannels();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Marquee notice banner */}
      <HeroSection />

      {/* Main content — channel grid + player + WC standings */}
      <HomeClient initialChannels={channels} />

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 py-6">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 animate-fade-up">
            <span className="text-lg">📺</span>
            <span className="font-semibold text-foreground">Sportzfy</span>
            <span>– Live Sports Streaming</span>
          </div>
          <p>For personal use only.</p>
        </div>
      </footer>
    </div>
  );
}
