import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import FootballClient from "./FootballClient";

export const metadata: Metadata = {
  title: "Football Live Streams – Sportzfy | Watch Football Online",
  description:
    "Browse live and upcoming football streams, fixtures, and match listings from Premier League, La Liga, Serie A, Bundesliga, UEFA, and more.",
};

export default function FootballPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageHero
        icon="⚽"
        title="Football Live Streams"
        description="Browse live and upcoming football fixtures from leagues and competitions around the world, updated in real time."
        badge={
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 font-semibold text-green-400 text-xs">
            ⚽ Football
          </span>
        }
      />
      <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <FootballClient />
      </main>
      <Footer />
    </div>
  );
}
