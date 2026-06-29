import HeroSection from "@/components/home/HeroSection";
import HomeClient from "@/components/home/HomeClient";
import Navbar from "@/components/layout/Navbar";
import { EZ_CHANNELS } from "@/data/ezchannels";

export default async function HomePage() {
  const channels = EZ_CHANNELS;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Marquee notice banner */}
      <HeroSection />

      {/* Main content — channel grid + player + WC standings */}
      <HomeClient initialChannels={channels} />

      {/* Footer */}
      <footer className="mt-12 border-white/5 border-t py-6">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 px-4 text-muted-foreground text-xs sm:flex-row sm:px-6 lg:px-8">
          <div className="flex animate-fade-up items-center gap-2">
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
