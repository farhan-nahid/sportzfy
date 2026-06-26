"use client";

import PersistentPlayer, { type PlayerMode } from "@/components/player/PersistentPlayer";
import { type Channel } from "@/data/channels";
import { SearchX, Tv } from "lucide-react";
import { useState } from "react";
import ChannelCard from "./ChannelCard";

interface ChannelGridProps {
  channels: Channel[];
  isFiltered: boolean;
}

export default function ChannelGrid({ channels, isFiltered }: ChannelGridProps) {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [playerMode, setPlayerMode] = useState<PlayerMode>("modal");

  const handleWatch = (channel: Channel) => {
    setActiveChannel(channel);
    setPlayerMode("modal");
  };

  const handleMinimize = () => setPlayerMode("mini");
  const handleExpand = () => setPlayerMode("modal");
  const handleStop = () => {
    setActiveChannel(null);
  };

  if (channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-white/8 flex items-center justify-center">
          <SearchX className="w-7 h-7 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">No channels found</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {isFiltered
              ? "No channels match your current filters. Try selecting a different country or sport."
              : "No channels available right now."}
          </p>
        </div>
      </div>
    );
  }

  const liveChannels = channels.filter((c) => c.isLive);
  const offlineChannels = channels.filter((c) => !c.isLive);

  return (
    <>
      {/* Persistent player — stays mounted in both modal and mini modes */}
      {activeChannel && (
        <PersistentPlayer
          channel={activeChannel}
          mode={playerMode}
          onMinimize={handleMinimize}
          onExpand={handleExpand}
          onStop={handleStop}
        />
      )}

      <div className="space-y-8">
        {/* Live channels */}
        {liveChannels.length > 0 && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {liveChannels.map((channel, i) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onWatch={handleWatch}
                  isActive={activeChannel?.id === channel.id}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}

        {/* Offline channels */}
        {offlineChannels.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/40 border border-white/8">
                <Tv className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Scheduled / Offline
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {offlineChannels.length} {offlineChannels.length === 1 ? "channel" : "channels"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 opacity-70">
              {offlineChannels.map((channel, i) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onWatch={handleWatch}
                  isActive={activeChannel?.id === channel.id}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
