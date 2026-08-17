"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChannelLogoProps {
  logo?: string | null;
  name: string;
  category?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  sports: {
    bg: "from-emerald-600/30 to-green-900/40 border-emerald-500/30",
    text: "text-emerald-400",
    icon: "⚽",
  },
  news: {
    bg: "from-blue-600/30 to-indigo-900/40 border-blue-500/30",
    text: "text-blue-400",
    icon: "📰",
  },
  entertainment: {
    bg: "from-purple-600/30 to-fuchsia-900/40 border-purple-500/30",
    text: "text-purple-400",
    icon: "🎬",
  },
  music: {
    bg: "from-pink-600/30 to-rose-900/40 border-pink-500/30",
    text: "text-pink-400",
    icon: "🎵",
  },
  movies: {
    bg: "from-amber-600/30 to-orange-900/40 border-amber-500/30",
    text: "text-amber-400",
    icon: "🎥",
  },
  kids: {
    bg: "from-cyan-600/30 to-teal-900/40 border-cyan-500/30",
    text: "text-cyan-400",
    icon: "🧒",
  },
  general: {
    bg: "from-slate-600/30 to-zinc-900/40 border-slate-500/30",
    text: "text-slate-300",
    icon: "📺",
  },
};

function getInitials(name: string): string {
  if (!name) return "TV";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const SIZE_MAP = {
  sm: { box: "h-9 w-9 text-xs rounded-lg", img: 36 },
  md: { box: "h-12 w-12 text-sm rounded-xl", img: 48 },
  lg: { box: "h-20 w-20 text-xl rounded-2xl", img: 80 },
};

export default function ChannelLogo({
  logo,
  name,
  category = "general",
  size = "md",
  className,
}: ChannelLogoProps) {
  const [imgError, setImgError] = useState(false);
  const sizeConfig = SIZE_MAP[size];
  const catTheme = CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS.general;
  const initials = getInitials(name);

  const showImage = Boolean(logo?.trim()) && !imgError;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border bg-white/5 shadow-md transition-all",
        sizeConfig.box,
        !showImage && `bg-gradient-to-br ${catTheme.bg}`,
        className,
      )}
    >
      {showImage ? (
        <Image
          src={logo!}
          alt={name}
          width={sizeConfig.img}
          height={sizeConfig.img}
          unoptimized
          className="h-full w-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <span className={cn("font-bold tracking-wider", catTheme.text)}>
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
