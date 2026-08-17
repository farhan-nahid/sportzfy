import { getSportColor, getSportIcon } from "@/lib/streamed";
import { cn } from "@/lib/utils";

interface SportBadgeProps {
  category: string;
  color?: string;
  icon?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function SportBadge({
  category,
  color,
  icon,
  size = "sm",
  className,
}: SportBadgeProps) {
  const resolvedColor = color ?? getSportColor(category);
  const resolvedIcon = icon ?? getSportIcon(category);
  const label = category.replace(/-/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold capitalize",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        className,
      )}
      style={{
        background: `${resolvedColor}18`,
        color: resolvedColor,
        border: `1px solid ${resolvedColor}30`,
      }}
    >
      <span>{resolvedIcon}</span>
      {label}
    </span>
  );
}
