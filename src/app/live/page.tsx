import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import LiveClient from "./LiveClient";

export const metadata: Metadata = {
  title: "Live Sports Streams Now – Sportzfy",
  description:
    "Watch currently live sports streams and live match listings across football, cricket, tennis, rugby, motorsports, and more.",
};

export default function LivePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageHero
        icon="🔴"
        title="Live Sports Streams"
        description="Watch currently live sports streams and match listings, updated in real time."
        badge={
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 font-semibold text-red-400 text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            Real-time
          </span>
        }
      />
      <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <LiveClient />
      </main>
      <Footer />
    </div>
  );
}
