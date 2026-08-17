import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  description?: string;
  icon?: string;
  badge?: ReactNode;
  className?: string;
}

export default function PageHero({
  title,
  description,
  icon,
  badge,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-white/[0.06] border-b bg-gradient-to-b from-white/[0.03] to-transparent py-10 sm:py-12",
        className,
      )}
    >
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-1 absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
        <div className="orb-2 absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex animate-fade-up flex-col gap-3">
          {badge}
          <div className="flex items-center gap-3">
            {icon && <span className="text-3xl">{icon}</span>}
            <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">{title}</h1>
          </div>
          {description && (
            <p className="max-w-xl text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
