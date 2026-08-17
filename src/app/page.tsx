import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/shared/Footer";
import HeroSection from "@/components/home/HeroSection";
import HomeClient from "@/components/home/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sportzfy – Free Live IPTV | Watch Live TV & Sports Channels",
  description:
    "Watch free live IPTV channels in HD, including sports, football, news, movies, and entertainment from around the world.",
  keywords: [
    "free live IPTV",
    "live TV channels",
    "sports streaming",
    "football live",
    "cricket live",
    "IPTV channels",
  ],
  openGraph: {
    title: "Sportzfy – Free Live IPTV",
    description: "Watch free live IPTV channels in HD from around the world.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection />
      <HomeClient />
      <Footer />
    </div>
  );
}
