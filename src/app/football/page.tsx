import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
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
      <main className="relative mx-auto w-full max-w-[1380px] flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <FootballClient />
      </main>
      <Footer />
    </div>
  );
}
