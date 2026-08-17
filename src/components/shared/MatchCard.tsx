import Image from "next/image";
import Link from "next/link";
import type { StreamedMatch } from "@/lib/streamed";
import {
  formatMatchDate,
  formatMatchTime,
  getSportColor,
  getSportIcon,
  isMatchLive,
} from "@/lib/streamed";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: StreamedMatch;
  showDate?: boolean;
  className?: string;
}

export default function MatchCard({
  match,
  showDate = false,
  className,
}: MatchCardProps) {
  const live = isMatchLive(match);
  const color = getSportColor(match.category);
  const icon = getSportIcon(match.category);

  const home = match.teams?.home;
  const away = match.teams?.away;

  return (
    <Link
      href={`/match/${match.id}`}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 transition-all",
        "hover:border-primary/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-primary/5",
        live && "border-red-500/20 bg-red-500/5 hover:border-red-500/30",
        className,
      )}
    >
      {/* Sport icon */}
      <span
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-base"
        style={{
          background: `${color}18`,
          borderColor: `${color}30`,
        }}
      >
        {icon}
      </span>

      {/* Team badges if available */}
      {home?.badge || away?.badge ? (
        <div className="flex flex-shrink-0 items-center gap-1.5">
          {home?.badge && (
            <Image
              src={home.badge}
              alt={home.name}
              width={24}
              height={24}
              unoptimized
              className="h-6 w-6 object-contain"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          )}
          <span className="font-semibold text-muted-foreground text-xs">vs</span>
          {away?.badge && (
            <Image
              src={away.badge}
              alt={away.name}
              width={24}
              height={24}
              unoptimized
              className="h-6 w-6 object-contain"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
          )}
        </div>
      ) : null}

      {/* Match info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate font-semibold text-foreground text-sm transition-colors group-hover:text-primary">
            {match.title}
          </span>
          {match.popular && (
            <span className="flex-shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-semibold text-[9px] text-amber-400 uppercase tracking-wide">
              Popular
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="font-medium text-[10px] capitalize" style={{ color }}>
            {match.category?.replace(/-/g, " ")}
          </span>
          {showDate && (
            <span className="text-[10px] text-muted-foreground">
              {formatMatchDate(match.date)}
            </span>
          )}
        </div>
      </div>

      {/* Scores / Time / Live badge */}
      <div className="flex flex-shrink-0 items-center gap-3">
        {(home?.score !== undefined || away?.score !== undefined) && (
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-bold text-foreground text-sm tabular-nums">
            {home?.score ?? "0"} - {away?.score ?? "0"}
          </span>
        )}
        {live ? (
          <span className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-1 font-bold text-[11px] text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            Live
          </span>
        ) : (
          <span className="text-muted-foreground text-xs tabular-nums">
            {formatMatchTime(match.date)}
          </span>
        )}
        <span className="text-muted-foreground/40 text-xs transition-colors group-hover:text-primary/60">
          →
        </span>
      </div>
    </Link>
  );
}
