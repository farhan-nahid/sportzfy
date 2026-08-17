import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import MatchDetailClient from "./MatchDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // Decode match title from ID slug (best-effort for SEO)
  const title = id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace(/ \d+$/, "");

  return {
    title: `${title} Live Stream – Sportzfy`,
    description: `Watch ${title} live stream online. Free live sports streaming. No registration needed.`,
  };
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <MatchDetailClient matchId={id} />
      <Footer />
    </div>
  );
}
