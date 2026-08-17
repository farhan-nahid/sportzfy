import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import PageHero from "@/components/shared/PageHero";
import ChannelDirectoryClient from "./ChannelDirectoryClient";

export const metadata: Metadata = {
  title: "Live IPTV Channel Explorer – Sportzfy | Free Live TV",
  description:
    "Browse thousands of free live IPTV channels from iptv-org. Filter by country, category, or search by name. Watch sports, news, entertainment, and more.",
};

export default function ChannelsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <PageHero
        icon="📺"
        title="Live IPTV Channel Explorer"
        description="Browse thousands of free live TV channels powered by the open iptv-org database. Filter by sports, news, entertainment, and more."
        badge={
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
            iptv-org powered
          </span>
        }
      />
      <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <ChannelDirectoryClient />
      </main>
      <Footer />
    </div>
  );
}
