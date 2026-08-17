import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import ChannelDetailClient from "./ChannelDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const channelName = decodeURIComponent(id)
    .replace(/\./g, " ")
    .split(" ")
    .slice(0, -1)
    .join(" ");
  return {
    title: `${channelName || id} Live Stream – Sportzfy | Free IPTV`,
    description: `Watch ${channelName || id} live online. Free IPTV channel stream. No registration needed.`,
  };
}

export default async function ChannelPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <ChannelDetailClient channelId={decodeURIComponent(id)} />
      <Footer />
    </div>
  );
}
