import Navbar from "@/components/layout/Navbar";
import WorldCupClient from "@/components/worldcup/WorldCupClient";
import type { Metadata } from "next";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <WorldCupClient />

      {/* Footer */}
      <footer className="mt-12 border-t border-white/5 py-6">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 animate-fade-up">
            <span className="text-lg">📺</span>
            <span className="font-semibold text-foreground">Sportzfy</span>
            <span>– Live Sports Streaming</span>
          </div>
          <p>
            For personal use only.
          </p>
        </div>
      </footer>
    </div>
  );
}
