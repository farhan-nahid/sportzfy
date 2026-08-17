"use client";

import { ChevronLeft, Globe, Loader2, WifiOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ChannelLogo from "@/components/shared/ChannelLogo";
import ChannelPagePlayer from "./ChannelPagePlayer";

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

interface Props {
  channelId: string;
}

const FLAG_CDN = (code: string) => `https://flagcdn.com/32x24/${code.toLowerCase()}.png`;

export default function ChannelDetailClient({ channelId }: Props) {
  const [channel, setChannel] = useState<IptvChannel | null>(null);
  const [related, setRelated] = useState<IptvChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Fetch channels from API to find this specific channel
        const res = await fetch(`/api/channels?limit=500`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const all: IptvChannel[] = data.channels ?? [];
        const found = all.find((c) => c.id === channelId);
        setChannel(found ?? null);

        if (found) {
          // Related: same category, not this channel, max 6
          const rel = all
            .filter(
              (c) =>
                c.id !== channelId &&
                c.categories.some((cat) => found.categories.includes(cat)),
            )
            .slice(0, 6);
          setRelated(rel);
        }
      } catch {
        setError("Could not load channel data. Check your connection.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [channelId]);

  if (loading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center py-32">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground text-sm">Loading channel…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
        <WifiOff className="h-14 w-14 text-red-400/60" />
        <div>
          <h2 className="font-bold text-foreground text-xl">Connection Error</h2>
          <p className="mt-1 text-muted-foreground text-sm">{error}</p>
        </div>
        <Link
          href="/channels"
          className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
        >
          ← Channel Guide
        </Link>
      </main>
    );
  }

  if (!channel) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
        <span className="text-5xl">📺</span>
        <div>
          <h2 className="font-bold text-foreground text-xl">Channel Not Found</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            This channel may not be available in the current database.
          </p>
        </div>
        <Link
          href="/channels"
          className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm hover:opacity-90"
        >
          ← Channel Guide
        </Link>
      </main>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-white/[0.06] border-b bg-gradient-to-b from-white/[0.04] to-transparent py-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="orb-1 absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/channels"
            className="mb-5 inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Channel guide
          </Link>

          <div className="flex flex-wrap items-center gap-5">
            <ChannelLogo
              logo={channel.logo}
              name={channel.name}
              category={channel.categories[0]}
              size="lg"
            />
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {channel.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-semibold text-primary text-xs capitalize"
                  >
                    {cat}
                  </span>
                ))}
                {channel.country && (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-muted-foreground text-xs">
                    <Image
                      src={FLAG_CDN(channel.country)}
                      alt={channel.country}
                      width={16}
                      height={12}
                      style={{ width: "auto", height: "auto" }}
                      unoptimized
                      className="rounded-sm"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                    {channel.country.toUpperCase()}
                  </span>
                )}
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-muted-foreground text-xs">
                  {channel.streams.length} stream{channel.streams.length !== 1 ? "s" : ""}
                </span>
              </div>
              <h1 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
                {channel.name}
              </h1>
              {channel.website && (
                <a
                  href={channel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {channel.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-screen-xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Player */}
          <div>
            <ChannelPagePlayer channel={channel} />

            {/* Info table */}
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <h2 className="mb-3 font-bold text-foreground text-sm">
                Channel Information
              </h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Name", value: channel.name },
                  { label: "Country", value: channel.country || "—" },
                  { label: "Categories", value: channel.categories.join(", ") || "—" },
                  {
                    label: "Stream Sources",
                    value: `${channel.streams.length} available`,
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className="text-muted-foreground text-xs">{label}</dt>
                    <dd className="mt-0.5 font-semibold text-foreground text-sm capitalize">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* FAQ */}
            <div className="mt-6 space-y-3">
              <h2 className="font-bold text-foreground text-lg">FAQ</h2>
              {[
                {
                  q: `Can I watch ${channel.name} live online?`,
                  a: `${channel.name} is listed in the Sportzfy free IPTV directory. Use the player above to watch when streams are available.`,
                },
                {
                  q: "What quality is the stream?",
                  a:
                    channel.streams
                      .map((s) => s.quality)
                      .filter(Boolean)
                      .join(", ") || "Stream quality varies by source.",
                },
                {
                  q: "Is it free?",
                  a: "Yes, all channels on Sportzfy are from the public iptv-org database. No subscription required.",
                },
                {
                  q: "Does it work on mobile?",
                  a: "Sportzfy channel pages are responsive and designed for all screen sizes.",
                },
              ].map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold text-foreground text-sm">
                    {q}
                    <span className="flex-shrink-0 text-muted-foreground text-xs transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {related.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <h3 className="mb-4 font-bold text-foreground text-sm">
                  Related Channels
                </h3>
                <div className="space-y-3">
                  {related.map((ch) => (
                    <Link
                      key={ch.id}
                      href={`/channels/${encodeURIComponent(ch.id)}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-all hover:border-primary/30 hover:bg-white/[0.06]"
                    >
                      <ChannelLogo
                        logo={ch.logo}
                        name={ch.name}
                        category={ch.categories[0]}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground text-xs transition-colors group-hover:text-primary">
                          {ch.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground capitalize">
                          {ch.categories[0]}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/channels"
                  className="mt-4 block w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 text-center font-semibold text-muted-foreground text-sm transition-all hover:border-primary/30 hover:text-foreground"
                >
                  Browse all channels →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
