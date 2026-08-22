"use client";

import { AlertCircle, ExternalLink, Eye, Loader2, Play, Tv } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StreamedMatch, StreamedStream } from "@/lib/streamed";
import { cn } from "@/lib/utils";

interface Props {
  match: StreamedMatch;
  streams: StreamedStream[];
  loadingStreams: boolean;
}

export default function StreamPlayer({ match, streams, loadingStreams }: Props) {
  const [selectedStream, setSelectedStream] = useState<StreamedStream | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  // Auto-select highest-viewed stream when available
  useEffect(() => {
    if (streams.length > 0) {
      setSelectedStream((prev) => prev || streams[0]);
    }
  }, [streams]);

  // HLS playback for m3u8 streams if kind === 'hls' or m3u8 is set
  useEffect(() => {
    if (!selectedStream?.m3u8) return;
    const video = videoRef.current;
    if (!video) return;
    let destroyed = false;

    async function loadHls() {
      const { default: Hls } = await import("hls.js");
      if (destroyed || !video || !selectedStream?.m3u8) return;
      hlsRef.current?.destroy();
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(selectedStream.m3u8);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video?.play().catch(() => {});
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = selectedStream.m3u8;
        video.play().catch(() => {});
      }
    }

    void loadHls();
    return () => {
      destroyed = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [selectedStream]);

  const handleSelectStream = useCallback((stream: StreamedStream) => {
    setSelectedStream(stream);
    setIframeKey((k) => k + 1);
  }, []);

  const renderPlayer = () => {
    if (loadingStreams) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black/90">
          <Loader2 className="h-10 w-10 animate-spin text-green-400" />
          <p className="text-slate-400 text-sm font-semibold">Loading stream options…</p>
        </div>
      );
    }

    if (!streams.length || !selectedStream) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black/90 p-6 text-center">
          <Tv className="h-14 w-14 text-slate-600" />
          <div>
            <p className="font-bold text-white text-base">
              No streams available right now
            </p>
            <p className="mt-1 text-slate-400 text-xs">
              Stream options usually appear closer to match kickoff time.
            </p>
          </div>
        </div>
      );
    }

    // Direct embed iframe via local ad-free /embed/ route
    if (selectedStream.embedUrl) {
      const embedPath = selectedStream.embedUrl.replace(/^https?:\/\/[^\/]+/, "");
      const iframeSrc = embedPath.startsWith("/embed")
        ? embedPath
        : `/embed/${selectedStream.source}/${selectedStream.id}`;
      return (
        <iframe
          key={`${selectedStream.id}:${iframeKey}`}
          src={iframeSrc}
          title={`${match.title} ${selectedStream.language || selectedStream.source}`}
          className="absolute inset-0 h-full w-full bg-black"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: "none" }}
        />
      );
    }

    // HLS video player fallback
    if (selectedStream.m3u8) {
      return (
        <video
          ref={videoRef}
          className="h-full w-full bg-black object-contain"
          controls
          autoPlay
          playsInline
        />
      );
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black/90">
        <Tv className="h-12 w-12 animate-pulse text-green-400" />
        <p className="text-slate-400 text-sm font-medium">
          Select a stream below to start playback
        </p>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070a0d] shadow-2xl shadow-black/80">
      {/* Player Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-2.5 w-2.5 shrink-0 items-center justify-center">
            <span className="h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-red-500" />
          </span>
          <p className="truncate font-bold text-white text-sm sm:text-base">
            {match.title}
          </p>
        </div>
        {streams.length > 0 && (
          <span className="shrink-0 rounded-full bg-green-500/20 px-3 py-1 font-black text-green-300 text-xs border border-green-500/30">
            {streams.length} stream{streams.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Player viewport */}
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        <div className="absolute inset-0">{renderPlayer()}</div>
      </div>

      {/* Stream Options buttons */}
      {streams.length > 0 && (
        <div className="border-t border-white/10 bg-[#0d1217] p-4">
          <p className="mb-3 font-black text-slate-400 text-xs uppercase tracking-wider">
            Available Stream Options
          </p>
          <div className="flex flex-wrap gap-2">
            {streams.map((stream) => {
              const isActive = selectedStream?.id === stream.id;
              const viewers = (stream as any).viewers as number | undefined;
              return (
                <button
                  key={stream.id}
                  type="button"
                  onClick={() => handleSelectStream(stream)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3.5 py-2 font-bold text-xs transition-all",
                    isActive
                      ? "border-green-500 bg-green-500/20 text-green-300 shadow-lg shadow-green-500/10"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                  )}
                >
                  <span>{stream.language || `Server ${stream.streamNo}`}</span>
                  {stream.hd && (
                    <span className="rounded-md bg-indigo-500/80 px-1.5 py-0.5 font-black text-[10px] text-white">
                      HD
                    </span>
                  )}
                  {viewers !== undefined && viewers > 0 && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Eye className="h-3 w-3" />
                      {viewers > 999 ? `${(viewers / 1000).toFixed(1)}k` : viewers}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Secondary external tab button if stream has embedUrl */}
      {selectedStream?.embedUrl && (
        <div className="flex items-center justify-between border-t border-white/10 bg-[#070a0d] px-4 py-2.5">
          <span className="text-slate-400 text-xs font-medium">
            Having trouble with playback inside the player?
          </span>
          <a
            href={selectedStream.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            Open in new tab <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-center gap-2 border-t border-white/10 bg-[#050709] px-4 py-2 text-slate-500 text-[11px]">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>
          Sportzfy does not host any video content. All streams are embedded from
          third-party providers.
        </span>
      </div>
    </div>
  );
}
