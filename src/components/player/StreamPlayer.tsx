"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Loader2,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlayerState = "loading" | "playing" | "paused" | "error";

export interface StreamPlayerHandle {
  pause: () => void;
  play: () => void;
  stop: () => void;
}

interface StreamPlayerProps {
  src: string;
  channelName: string;
  autoPlay?: boolean;
  /** When true, controls bar is always visible (mini-player mode) */
  alwaysShowControls?: boolean;
  className?: string;
}

// ─── Volume icon helper ───────────────────────────────────────────────────────

function VolumeIcon({ level, muted }: { level: number; muted: boolean }) {
  if (muted || level === 0) return <VolumeX className="w-4 h-4" />;
  if (level < 0.5) return <Volume1 className="w-4 h-4" />;
  return <Volume2 className="w-4 h-4" />;
}

// ─── Component ────────────────────────────────────────────────────────────────

const StreamPlayer = forwardRef<StreamPlayerHandle, StreamPlayerProps>(
  function StreamPlayer(
    { src, channelName, autoPlay = true, alwaysShowControls = false, className },
    ref
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [playerState, setPlayerState] = useState<PlayerState>("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // ── Expose imperative handle ──────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      pause: () => videoRef.current?.pause(),
      play: () => videoRef.current?.play().catch(() => {}),
      stop: () => {
        const v = videoRef.current;
        if (v) { v.pause(); v.src = ""; v.load(); }
      },
    }));

    // ── HLS setup ─────────────────────────────────────────────────────────────
    useEffect(() => {
      const video = videoRef.current;
      if (!video || !src) return;

      setPlayerState("loading");
      setErrorMsg("");

      let hlsInstance: import("hls.js").default | null = null;

      async function setup() {
        try {
          const Hls = (await import("hls.js")).default;
          const isHlsSrc =
            src.includes(".m3u8") ||
            src.includes("m3u") ||
            src.includes(".ts");

          if (Hls.isSupported() && isHlsSrc) {
            hlsInstance = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              maxBufferLength: 30,
            });
            hlsInstance.loadSource(src);
            hlsInstance.attachMedia(video!);

            hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
              setPlayerState("playing");
              if (autoPlay) video!.play().catch(() => {});
            });

            hlsInstance.on(Hls.Events.ERROR, (_e, data) => {
              if (data.fatal) {
                setPlayerState("error");
                setErrorMsg(
                  data.type === "networkError"
                    ? "Network error — stream unavailable."
                    : "Playback error — stream may have ended."
                );
              }
            });
          } else if (video!.canPlayType("application/vnd.apple.mpegurl")) {
            // Native HLS (Safari / iOS)
            video!.src = src;
            video!.load();
          } else {
            video!.src = src;
            video!.load();
          }
        } catch {
          setPlayerState("error");
          setErrorMsg("Failed to initialize player.");
        }
      }

      setup();

      const onPlay = () => setPlayerState("playing");
      const onPause = () => setPlayerState("paused");
      const onWaiting = () => setPlayerState("loading");
      const onCanPlay = () => {
        setPlayerState(video!.paused ? "paused" : "playing");
        if (autoPlay) video!.play().catch(() => {});
      };
      const onError = () => {
        setPlayerState("error");
        setErrorMsg("Stream unavailable or geo-blocked.");
      };

      video!.addEventListener("play", onPlay);
      video!.addEventListener("pause", onPause);
      video!.addEventListener("waiting", onWaiting);
      video!.addEventListener("canplay", onCanPlay);
      video!.addEventListener("error", onError);

      return () => {
        hlsInstance?.destroy();
        video!.removeEventListener("play", onPlay);
        video!.removeEventListener("pause", onPause);
        video!.removeEventListener("waiting", onWaiting);
        video!.removeEventListener("canplay", onCanPlay);
        video!.removeEventListener("error", onError);
        // NOTE: We do NOT reset src here — caller decides when to stop
      };
    }, [src, autoPlay]);

    // ── Fullscreen listener ───────────────────────────────────────────────────
    useEffect(() => {
      const onChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
        // Always show controls when entering fullscreen
        if (document.fullscreenElement) setShowControls(true);
      };
      document.addEventListener("fullscreenchange", onChange);
      return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    // ── Auto-hide controls ────────────────────────────────────────────────────
    const resetHideTimer = useCallback(() => {
      setShowControls(true);
      if (controlsHideTimer.current) clearTimeout(controlsHideTimer.current);
      if (!alwaysShowControls) {
        controlsHideTimer.current = setTimeout(() => {
          if (playerState === "playing") setShowControls(false);
        }, 3000);
      }
    }, [alwaysShowControls, playerState]);

    // Always show when paused / loading / error
    useEffect(() => {
      if (playerState !== "playing") {
        setShowControls(true);
        if (controlsHideTimer.current) clearTimeout(controlsHideTimer.current);
      }
    }, [playerState]);

    // ── Control handlers ──────────────────────────────────────────────────────
    const togglePlay = () => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) v.play().catch(() => {});
      else v.pause();
    };

    const toggleMute = () => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = !muted;
      setMuted(!muted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = videoRef.current;
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (v) {
        v.volume = val;
        v.muted = val === 0;
        setMuted(val === 0);
      }
    };

    const toggleFullscreen = () => {
      const container = containerRef.current;
      if (!container) return;
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    };

    const retry = () => {
      const v = videoRef.current;
      if (!v) return;
      setPlayerState("loading");
      setErrorMsg("");
      v.load();
      v.play().catch(() => {});
    };

    // ── Render ────────────────────────────────────────────────────────────────
    const controlsVisible = alwaysShowControls || showControls;

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full bg-black overflow-hidden select-none group",
          "rounded-xl",
          className
        )}
        style={{ aspectRatio: "16/9" }}
        onMouseMove={resetHideTimer}
        onMouseLeave={() => {
          if (!alwaysShowControls && playerState === "playing") {
            setShowControls(false);
          }
        }}
        onClick={togglePlay}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          muted={muted}
        />

        {/* ── Loading overlay ── */}
        {playerState === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 pointer-events-none">
            <Loader2 className="w-9 h-9 text-primary animate-spin" />
            <p className="text-xs text-white/60 font-medium">Connecting to stream…</p>
          </div>
        )}

        {/* ── Error overlay ── */}
        {playerState === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Stream Unavailable</p>
              <p className="text-xs text-white/50 mt-1 max-w-[220px] leading-relaxed">
                {errorMsg || "This stream is offline or geo-blocked."}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); retry(); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/30 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* ── Play/Pause center icon flash ── */}
        {playerState === "paused" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </div>
        )}

        {/* ── Control bar ── */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 transition-all duration-300",
            controlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-xl pointer-events-none" />

          <div className="relative px-4 pb-4 pt-8 space-y-2">
            {/* Channel name + live badge */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-[9px] font-bold text-red-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
              <span className="text-xs text-white/80 font-medium truncate">{channelName}</span>
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/15 transition-colors shrink-0"
                title={playerState === "playing" ? "Pause" : "Play"}
              >
                {playerState === "playing"
                  ? <Pause className="w-4 h-4 fill-white" />
                  : <Play className="w-4 h-4 fill-white ml-0.5" />
                }
              </button>

              {/* Volume group */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/15 transition-colors shrink-0"
                  title={muted ? "Unmute" : "Mute"}
                >
                  <VolumeIcon level={volume} muted={muted} />
                </button>

                {/* Volume slider — always visible, styled with fill */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider w-20 h-1 cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, oklch(0.65 0.22 274) 0%, oklch(0.65 0.22 274) ${
                        (muted ? 0 : volume) * 100
                      }%, oklch(1 0 0 / 20%) ${
                        (muted ? 0 : volume) * 100
                      }%, oklch(1 0 0 / 20%) 100%)`,
                    }}
                    title="Volume"
                  />
                  <span className="text-[10px] text-white/50 font-mono w-[2ch] text-right tabular-nums">
                    {muted ? 0 : Math.round(volume * 100)}
                  </span>
                </div>
              </div>

              {/* Live indicator (center) */}
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Live</span>
                </div>
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/15 transition-colors shrink-0"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen
                  ? <Minimize2 className="w-4 h-4" />
                  : <Maximize2 className="w-4 h-4" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

StreamPlayer.displayName = "StreamPlayer";
export default StreamPlayer;
