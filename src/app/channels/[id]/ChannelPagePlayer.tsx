"use client";

import { AlertCircle, ExternalLink, Play, Server, Tv, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

interface Props {
  channel: IptvChannel;
}

export default function ChannelPagePlayer({ channel }: Props) {
  const [playing, setPlaying] = useState(false);
  const [streamIdx, setStreamIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  const stream = channel.streams[streamIdx];

  useEffect(() => {
    if (!playing || !stream?.url) return;
    const video = videoRef.current;
    if (!video) return;
    let destroyed = false;

    async function load() {
      const { default: Hls } = await import("hls.js");
      if (destroyed || !video || !stream?.url) return;
      if (Hls.isSupported()) {
        hlsRef.current?.destroy();
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hlsRef.current = hls;
        hls.loadSource(stream.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream.url;
        video.play().catch(() => {});
      }
    }

    void load();
    return () => {
      destroyed = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [playing, stream]);

  if (channel.streams.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-black/60">
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <Tv className="h-12 w-12 text-muted-foreground/30" />
          <div>
            <p className="font-semibold text-foreground">No streams available</p>
            <p className="mt-1 text-muted-foreground text-sm">
              This channel doesn't have any available streams at the moment.
            </p>
          </div>
          {channel.website && (
            <a
              href={channel.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground text-sm hover:opacity-90"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Website
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/60">
      {/* Header */}
      <div className="flex items-center justify-between border-white/[0.08] border-b bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-3">
          <Tv className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold text-foreground text-sm">{channel.name}</p>
            <p className="text-muted-foreground text-xs capitalize">
              {channel.categories[0]}
            </p>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-bold text-[10px] text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            LIVE
          </span>
        </div>
        {playing && (
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Video */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">
          {playing ? (
            <video
              ref={videoRef}
              className="h-full w-full bg-black"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-black/90 to-black/70 transition-all hover:from-black/80"
            >
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary/20 transition-all hover:scale-110 hover:bg-primary/30">
                <Play className="ml-1 h-8 w-8 fill-primary text-primary" />
              </div>
              <div className="text-center">
                <p className="font-bold text-base text-foreground">{channel.name}</p>
                <p className="mt-1 text-muted-foreground text-xs">
                  {channel.streams.length} stream{channel.streams.length !== 1 ? "s" : ""}{" "}
                  · Click to watch live
                </p>
                {stream?.quality && (
                  <p className="mt-0.5 font-medium text-primary text-xs">
                    {stream.quality}
                  </p>
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Server switcher */}
      {channel.streams.length > 1 && (
        <div className="border-white/[0.08] border-t bg-white/[0.04] px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            <Server className="h-3 w-3" />
            Servers
          </p>
          <div className="flex flex-wrap gap-2">
            {channel.streams.map((s, i) => (
              <button
                type="button"
                key={`${s.url}-${i}`}
                onClick={() => {
                  setStreamIdx(i);
                  setPlaying(true);
                }}
                className={cn(
                  "whitespace-nowrap rounded-lg border px-3 py-1.5 font-medium text-xs transition-all",
                  i === streamIdx && playing
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
                )}
              >
                Server {i + 1}
                {s.quality ? ` · ${s.quality}` : ""}
                {s.label ? ` · ${s.label}` : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Open externally */}
      {playing && stream?.url && (
        <div className="flex items-center justify-between gap-4 border-white/[0.08] border-t bg-white/[0.04] px-4 py-3">
          <p className="text-muted-foreground text-xs">Stream not loading?</p>
          <a
            href={stream.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-foreground text-xs hover:bg-white/20"
          >
            Open M3U8 <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 border-white/[0.08] border-t bg-white/[0.02] px-4 py-3">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50" />
        <p className="text-muted-foreground/50 text-xs">
          All streams are from the public iptv-org database. Sportzfy does not host any
          content.
        </p>
      </div>
    </div>
  );
}
