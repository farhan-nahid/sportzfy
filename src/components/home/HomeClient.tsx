"use client";

import { useState, useMemo, useEffect } from "react";
import { filterChannels, type Sport, type Channel } from "@/data/channels";
import Filters from "@/components/filters/Filters";
import ChannelGrid from "@/components/channels/ChannelGrid";
import { Menu, X, SlidersHorizontal, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeClientProps {
  initialChannels: Channel[];
  initialFetchedAt: string | null;
}

// Loading skeleton card
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/8 bg-card overflow-hidden animate-pulse">
      <div className="h-40 bg-muted/40" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted/50 rounded-full w-3/4" />
        <div className="h-2.5 bg-muted/30 rounded-full w-full" />
        <div className="h-2.5 bg-muted/30 rounded-full w-4/5" />
        <div className="flex gap-1.5 mt-2">
          <div className="h-4 bg-muted/30 rounded-full w-16" />
          <div className="h-4 bg-muted/30 rounded-full w-20" />
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="h-9 bg-muted/30 rounded-xl" />
      </div>
    </div>
  );
}

export default function HomeClient({ initialChannels, initialFetchedAt }: HomeClientProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [loading, setLoading] = useState(initialChannels.length === 0);
  const [fetchedAt, setFetchedAt] = useState<string | null>(initialFetchedAt);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [selectedSport, setSelectedSport] = useState<Sport>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch channels from API
  const fetchChannels = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/channels");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setChannels(data.channels ?? []);
      setFetchedAt(data.fetchedAt ?? null);
    } catch (err) {
      console.error("Failed to fetch channels:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load on mount if no SSR data
  useEffect(() => {
    if (initialChannels.length === 0) {
      fetchChannels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => filterChannels(channels, selectedCountry, selectedSport),
    [channels, selectedCountry, selectedSport]
  );

  const liveCount = filtered.filter((c) => c.isLive).length;
  const isFiltered = selectedCountry !== "ALL" || selectedSport !== "All";

  const formattedFetchedAt = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6 relative">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div
            className="sticky top-20 rounded-2xl border border-white/8 bg-card p-5 overflow-y-auto"
            style={{ height: "calc(100vh - 15rem)" }}
          >
            <Filters
              selectedCountry={selectedCountry}
              selectedSport={selectedSport}
              onCountryChange={setSelectedCountry}
              onSportChange={setSelectedSport}
              liveCount={liveCount}
              totalCount={filtered.length}
            />
          </div>
        </aside>

        {/* Mobile filter button */}
        <div className="lg:hidden fixed bottom-5 right-5 z-50">
          <button
            id="mobile-filter-btn"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl gradient-brand text-white font-semibold shadow-2xl shadow-primary/40 text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-white/80" />
            )}
          </button>
        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative ml-auto w-72 h-full bg-card border-l border-white/8 p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-sm">Filters</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center hover:bg-muted/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Filters
                selectedCountry={selectedCountry}
                selectedSport={selectedSport}
                onCountryChange={(c) => { setSelectedCountry(c); setSidebarOpen(false); }}
                onSportChange={(s) => { setSelectedSport(s); setSidebarOpen(false); }}
                liveCount={liveCount}
                totalCount={filtered.length}
              />
            </div>
          </div>
        )}

        {/* Main channel grid */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Toolbar row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {/* Active filter pills */}
            {isFiltered && (
              <>
                <span className="text-xs text-muted-foreground">Showing:</span>
                {selectedCountry !== "ALL" && (
                  <button
                    onClick={() => setSelectedCountry("ALL")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {selectedCountry} ×
                  </button>
                )}
                {selectedSport !== "All" && (
                  <button
                    onClick={() => setSelectedSport("All")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {selectedSport} ×
                  </button>
                )}
                <button
                  onClick={() => { setSelectedCountry("ALL"); setSelectedSport("All"); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </>
            )}

            {/* Spacer */}
            <span className="flex-1" />

            {/* Refresh + last fetched */}
            <div className="flex items-center gap-2">
              {formattedFetchedAt && (
                <span className="text-[10px] text-muted-foreground/60 hidden sm:block">
                  Updated {formattedFetchedAt}
                </span>
              )}
              <button
                id="refresh-channels-btn"
                onClick={() => fetchChannels(true)}
                disabled={refreshing || loading}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-white/8 bg-muted/20 hover:bg-muted/40 transition-colors",
                  (refreshing || loading) && "opacity-50 cursor-not-allowed"
                )}
              >
                <RefreshCw className={cn("w-3 h-3", refreshing && "animate-spin")} />
                Refresh
              </button>
            </div>
          </div>

          {/* Scrollable channel area — fixed height */}
          <div className="flex-1 overflow-y-auto pr-1 rounded-xl" style={{ height: "calc(100vh - 15rem)" }}>
            {loading ? (
              <div className="space-y-8">
                <div>
                  <div className="h-7 bg-muted/30 rounded-full w-32 mb-4 animate-pulse" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ChannelGrid channels={filtered} isFiltered={isFiltered} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
