import type { Playlist } from "@/data/get-playlists";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioStore } from "@/hooks/use-audio-store";
import { formatDuration } from "@/lib/format-duration";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";

interface Props {
  currentPlaylistData: Playlist | undefined;
}

export const ControlPanel = ({
  currentPlaylistData,
}: Props): React.JSX.Element => {
  const [isMuted, setIsMuted] = useState(false);

  const currentTime = useAudioStore((state) => state.currentTime);
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const duration = useAudioStore((state) => state.duration);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const volume = useAudioStore((state) => state.volume);
  const togglePlay = useAudioStore((state) => state.togglePlay);
  const changeVolume = useAudioStore((state) => state.changeVolume);
  const seek = useAudioStore((state) => state.seek);
  const skipToNext = useAudioStore((state) => state.skipToNext);
  const skipToPrevious = useAudioStore((state) => state.skipToPrevious);

  const handleVolumeChange = (value: number[]) => {
    changeVolume(value[0] ?? 0);

    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    changeVolume(isMuted ? 80 : 0);
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-background rounded-b-xl border-t p-4">
      <div className="flex items-center gap-4">
        {currentTrack ?
          <div className="flex min-w-0 flex-1 items-center">
            <div className="min-w-0">
              <div className="truncate font-medium">{currentTrack.name}</div>
              <div className="text-muted-foreground truncate text-sm">
                {currentPlaylistData?.artist}
              </div>
            </div>
          </div>
        : null}
        <div className="flex items-center gap-2">
          <Button
            className="h-9 w-9"
            onClick={() => {
              skipToPrevious(currentPlaylistData?.tracks ?? []);
            }}
            size="icon"
            variant="ghost"
          >
            <SkipBack className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            className="h-10 w-10 rounded-full"
            onClick={() => {
              togglePlay();
            }}
            size="icon"
            variant="outline"
          >
            {isPlaying ?
              <Pause className="h-5 w-5" />
            : <Play className="ml-0.5 h-5 w-5" />}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>
          <Button
            className="h-9 w-9"
            onClick={() => {
              skipToNext(currentPlaylistData?.tracks ?? []);
            }}
            size="icon"
            variant="ghost"
          >
            <SkipForward className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            className="h-9 w-9"
            onClick={toggleMute}
            size="icon"
            variant="ghost"
          >
            {isMuted || volume === 0 ?
              <VolumeX className="h-5 w-5" />
            : <Volume2 className="h-5 w-5" />}
            <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
          </Button>
          <div className="w-24">
            <Slider
              aria-label="Volume"
              max={1}
              onValueChange={handleVolumeChange}
              step={0.01}
              value={[isMuted ? 0 : volume]}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Slider
          aria-label="Seek"
          className="[&>span:first-child]:h-1.5"
          max={currentTrack?.duration ?? 100}
          onValueChange={(value) => {
            seek(value[0] ?? 0);
          }}
          step={1}
          value={[currentTime]}
        />
        <div className="text-muted-foreground mt-1 flex justify-between text-xs">
          <span>{formatDuration(currentTime)}</span>
          <span>{duration ? formatDuration(duration) : "0:00"}</span>
        </div>
      </div>
    </div>
  );
};
