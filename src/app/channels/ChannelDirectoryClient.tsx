"use client";

import { Loader2, RefreshCw, Search, Tv, WifiOff, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ChannelLogo from "@/components/shared/ChannelLogo";
import { cn } from "@/lib/utils";

interface IptvStream {
  url: string;
  quality: string | null;
  label: string | null;
}

interface IptvChannel {
  id: string;
  name: string;
  logo: string;
  country: string;
  categories: string[];
  website: string | null;
  streams: IptvStream[];
}

const CATEGORY_TABS = [
  { value: "all", label: "All", icon: "📺" },
  { value: "sports", label: "Sports", icon: "⚽" },
  { value: "news", label: "News", icon: "📰" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "music", label: "Music", icon: "🎵" },
  { value: "movies", label: "Movies", icon: "🎥" },
  { value: "kids", label: "Kids", icon: "🧒" },
];

const FLAG_CDN = (code: string) => `https://flagcdn.com/32x24/${code.toLowerCase()}.png`;

export default function ChannelDirectoryClient() {
  const [channels, setChannels] = useState<IptvChannel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  async function load(cat = category) {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/channels?category=${encodeURIComponent(cat)}&limit=300`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setChannels(data.channels ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError("Could not load channels. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(category);
  }, [category]);

  const filtered = useMemo(() => {
    if (!search.trim()) return channels;
    const q = search.toLowerCase();
    return channels.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.categories.some((cat) => cat.toLowerCase().includes(q)),
    );
  }, [channels, search]);

  return (
    <div className="space-y-5">
      {/* Search + filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="channel-search"
            type="text"
            placeholder="Search channels, countries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pr-8 pl-9 text-foreground text-sm placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full bg-white/10 p-0.5 hover:bg-white/20"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => load(category)}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-muted-foreground text-sm transition-colors hover:bg-white/[0.08] hover:text-foreground disabled:opacity-40"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>

      {/* Category tabs */}
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            id={`cat-${tab.value}`}
            onClick={() => setCategory(tab.value)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-xl border px-4 py-2 font-medium text-sm transition-all",
              category === tab.value
                ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "border-white/[0.06] bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground",
            )}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Count */}
      {!loading && !error && (
        <p className="text-muted-foreground text-xs">
          {filtered.length.toLocaleString()} channel{filtered.length !== 1 ? "s" : ""}
          {total > channels.length &&
            ` (showing ${channels.length.toLocaleString()} of ${total.toLocaleString()})`}
        </p>
      )}

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading channels from iptv-org…</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 py-16 text-center">
          <WifiOff className="h-12 w-12 text-red-400/60" />
          <div>
            <h3 className="font-semibold text-foreground">Connection Error</h3>
            <p className="mt-1 text-muted-foreground text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => load(category)}
            className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Tv className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <h3 className="font-semibold text-foreground">No channels found</h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Try a different search or category.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((ch) => (
            <Link
              key={ch.id}
              href={`/channels/${encodeURIComponent(ch.id)}`}
              className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.06] hover:shadow-primary/5 hover:shadow-xl"
            >
              {/* Logo */}
              <ChannelLogo
                logo={ch.logo}
                name={ch.name}
                category={ch.categories[0]}
                size="md"
              />

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground text-sm transition-colors group-hover:text-primary">
                  {ch.name}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  {ch.country && (
                    <Image
                      src={FLAG_CDN(ch.country)}
                      alt={ch.country}
                      width={16}
                      height={12}
                      style={{ width: "auto", height: "auto" }}
                      unoptimized
                      className="rounded-sm"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                  )}
                  {ch.categories[0] && (
                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary capitalize">
                      {ch.categories[0]}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {ch.streams.length} stream{ch.streams.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <span className="text-muted-foreground/40 text-xs transition-colors group-hover:text-primary/60">
                →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
