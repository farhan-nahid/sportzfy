import { cn } from "@/lib/utils";

interface LiveBadgeProps {
  viewers?: string;
  className?: string;
}

export default function LiveBadge({ viewers, className }: LiveBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="relative flex items-center justify-center w-5 h-5">
        <span className="live-pulse absolute inline-flex h-4 w-4 rounded-full bg-red-500/40" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
      <span className="text-xs font-bold tracking-wide text-red-400 uppercase">
        Live
      </span>
      {viewers && (
        <>
          <span className="text-muted-foreground/60 text-xs">·</span>
          <span className="text-xs text-muted-foreground">{viewers}</span>
        </>
      )}
    </div>
  );
}
