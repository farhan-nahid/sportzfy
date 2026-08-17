"use client";

import { AlertCircle, ExternalLink, Loader2, Play, Tv } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { StreamedMatch, StreamedStream } from "@/lib/streamed";
import { cn } from "@/lib/utils";

interface Props {
  match: StreamedMatch;
  streams: StreamedStream[];
  loadingStreams: boolean;
}

export default function StreamPlayer({ match, streams, loadingStreams }: Props) {
  const [selectedStream, setSelectedStream] = useState<StreamedStream | null>(null);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  // Auto-select first stream when available
  useEffect(() => {
    if (streams.length > 0 && !selectedStream) {
      setSelectedStream(streams[0]);
    }
  }, [streams, selectedStream]);

  useEffect(() => {
    if (!playing || !selectedStream?.m3u8) return;
    const video = videoRef.current;
    if (!video) return;
    let destroyed = false;

    async function load() {
      const { default: Hls } = await import("hls.js");
      if (destroyed || !video || !selectedStream?.m3u8) return;
      if (Hls.isSupported()) {
        hlsRef.current?.destroy();
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(selectedStream.m3u8);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = selectedStream.m3u8;
        video.play().catch(() => {});
      }
    }

    void load();
    return () => {
      destroyed = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [playing, selectedStream]);

  const handlePlay = (stream?: StreamedStream) => {
    const target = stream ?? selectedStream ?? streams[0];
    if (target) setSelectedStream(target);
    setPlaying(true);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/60">
      {/* Header */}
      <div className="flex items-center gap-3 border-white/[0.08] border-b bg-white/[0.04] px-4 py-3">
        <Tv className="h-5 w-5 text-primary" />
        <div>
          <p className="font-semibold text-foreground text-sm">{match.title}</p>
          <p className="text-muted-foreground text-xs capitalize">
            {match.category?.replace(/-/g, " ")}
          </p>
        </div>
      </div>

      {/* Video */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0">
          {!playing ? (
            /* Pre-play overlay */
            <button
              type="button"
              onClick={() => handlePlay()}
              className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-black/90 to-black/70"
            >
              {loadingStreams ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground text-sm">Loading stream sources…</p>
                </>
              ) : streams.length === 0 ? (
                <>
                  <Tv className="h-14 w-14 text-muted-foreground/30" />
                  <div className="text-center">
                    <p className="font-semibold text-foreground">
                      No streams available yet
                    </p>
                    <p className="mt-1 text-muted-foreground text-xs">
                      Stream sources will appear closer to match time.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary/40 bg-primary/20 transition-all hover:scale-110 hover:bg-primary/30">
                    <Play className="ml-1 h-8 w-8 fill-primary text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-base text-foreground">{match.title}</p>
                    <p className="mt-1 text-muted-foreground text-xs">
                      {streams.length} stream{streams.length !== 1 ? "s" : ""} available ·
                      Click to watch
                    </p>
                  </div>
                </>
              )}
            </button>
          ) : selectedStream?.embedUrl ? (
            /* Embed URL (iframe) */
            <iframe
              src={selectedStream.embedUrl}
              title={match.title}
              className="h-full w-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              style={{ border: "none" }}
            />
          ) : selectedStream?.m3u8 ? (
            /* HLS */
            <video
              ref={videoRef}
              className="h-full w-full bg-black"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black/80">
              <Tv className="h-12 w-12 animate-pulse text-primary" />
              <p className="text-muted-foreground text-sm">Stream loading…</p>
              {selectedStream?.embedUrl && (
                <a
                  href={selectedStream.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-primary-foreground text-sm shadow-lg shadow-primary/30 hover:opacity-90"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Browser
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stream switcher */}
      {streams.length > 1 && (
        <div className="border-white/[0.08] border-t bg-white/[0.04] px-4 py-3">
          <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Servers
          </p>
          <div className="flex flex-wrap gap-2">
            {streams.map((stream, i) => (
              <button
                key={stream.id || `stream-btn-${i}`}
                type="button"
                onClick={() => handlePlay(stream)}
                className={cn(
                  "whitespace-nowrap rounded-lg border px-3 py-1.5 font-medium text-xs transition-all",
                  selectedStream === stream && playing
                    ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground",
                )}
              >
                {stream.language ? `${stream.language} ` : ""}Server {i + 1}
                {stream.hd ? " HD" : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Open externally */}
      {playing && selectedStream?.embedUrl && (
        <div className="flex items-center justify-between gap-4 border-white/[0.08] border-t bg-white/[0.04] px-4 py-3">
          <p className="text-muted-foreground text-xs">Stream not loading?</p>
          <a
            href={selectedStream.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-foreground text-xs hover:bg-white/20"
          >
            Open stream <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 border-white/[0.08] border-t bg-white/[0.02] px-4 py-3">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50" />
        <p className="text-muted-foreground/50 text-xs">
          All streams are publicly available. Sportzfy does not host any video content.
        </p>
      </div>
    </div>
  );
}
