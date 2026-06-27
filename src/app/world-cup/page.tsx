import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import WorldCupClient from "@/components/worldcup/WorldCupClient";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 – Standings, Scores & Rankings | Sportzfy",
  description:
    "Follow the FIFA World Cup 2026 live. View real-time match scores, recent group-stage results, the upcoming Round of 32 schedule, and official FIFA World Rankings.",
  keywords: [
    "FIFA World Cup 2026",
    "World Cup live scores",
    "World Cup group standings",
    "FIFA Men's World Rankings",
    "football match results",
  ],
};

export default function WorldCupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Main Content */}
      <WorldCupClient />

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
