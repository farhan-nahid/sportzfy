import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import StandingsClient from "./StandingsClient";

export const metadata: Metadata = {
  title: "Football Point Tables & League Standings – Sportzfy",
  description:
    "View official football point tables and league standings for Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and MLS.",
};

export default function StandingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageHero
        icon="🏆"
        title="League Standings & Point Tables"
        description="Check official point tables, matches played, goal differences, and live standings for top football leagues around the world."
        badge={
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-semibold text-amber-400 text-xs">
            🏆 Official Standings
          </span>
        }
      />
      <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <StandingsClient />
      </main>
      <Footer />
    </div>
  );
}
