"use client";

import { useState } from "react";
import { COUNTRIES, SPORTS, type Sport } from "@/data/channels";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersProps {
  selectedCountry: string;
  selectedSport: Sport;
  onCountryChange: (code: string) => void;
  onSportChange: (sport: Sport) => void;
  liveCount: number;
  totalCount: number;
}

export default function Filters({
  selectedCountry,
  selectedSport,
  onCountryChange,
  onSportChange,
  liveCount,
  totalCount,
}: FiltersProps) {
  const [countryOpen, setCountryOpen] = useState(false);
  const activeCountry =
    COUNTRIES.find((c) => c.code === selectedCountry) ?? COUNTRIES[0];

  return (
    <div className="w-full space-y-5">
      {/* Stats row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs font-semibold text-red-400">
            {liveCount} Live
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {totalCount} channels
        </span>
      </div>

      {/* Country Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Globe className="w-3.5 h-3.5" />
          Country
        </label>

        <div className="relative">
          <button
            id="country-filter-btn"
            onClick={() => setCountryOpen((o) => !o)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-muted/30 border border-white/8 hover:border-primary/40 hover:bg-muted/50 transition-all text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{activeCountry.flag}</span>
              <span>{activeCountry.name}</span>
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                countryOpen && "rotate-180"
              )}
            />
          </button>

          {countryOpen && (
            <div className="absolute z-50 top-full mt-1 w-full rounded-xl border border-white/8 bg-popover shadow-2xl shadow-black/40 overflow-hidden">
              <div className="py-1 max-h-64 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    id={`country-${country.code.toLowerCase()}`}
                    onClick={() => {
                      onCountryChange(country.code);
                      setCountryOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-accent",
                      selectedCountry === country.code &&
                        "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    <span className="text-base w-6 text-center">
                      {country.flag}
                    </span>
                    <span>{country.name}</span>
                    {selectedCountry === country.code && (
                      <span className="ml-auto text-xs text-primary">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sport Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          🏆 Sport
        </label>

        <div className="flex flex-col gap-1">
          {SPORTS.map((sport) => (
            <button
              key={sport.value}
              id={`sport-${sport.value.toLowerCase()}`}
              onClick={() => onSportChange(sport.value)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 text-left",
                selectedSport === sport.value
                  ? "bg-primary/15 text-primary border border-primary/30 glow-brand"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              )}
            >
              <span className="w-5 text-base text-center">{sport.emoji}</span>
              <span>{sport.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
