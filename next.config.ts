import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "assets.football-logos.cc" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "cdn.plus.fifa.com" },
      { protocol: "https", hostname: "media-stg.assettype.com" },
      { protocol: "https", hostname: "akashgo-mediaready.videoready.tv" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "itcnbd.live" },
      { protocol: "https", hostname: "images.seeklogo.com" },
      { protocol: "https", hostname: "i.postimg.cc" },
    ],
  },
};

export default nextConfig;
