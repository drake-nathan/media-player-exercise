import type { Playlist } from "@/data/get-playlists";

import { Button } from "@/components/ui/button";
import { useAudioStore } from "@/hooks/use-audio-store";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

import { PlaybackSlider } from "./playback-slider";
import { VolumeControls } from "./volume-controls";

interface Props {
  currentPlaylistData: Playlist | undefined;
}

export const ControlPanel = ({
  currentPlaylistData,
}: Props): React.JSX.Element => {
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const togglePlay = useAudioStore((state) => state.togglePlay);
  const skipToNext = useAudioStore((state) => state.skipToNext);
  const skipToPrevious = useAudioStore((state) => state.skipToPrevious);

  return (
    <div className="rounded-b-xl border-t bg-background p-4">
      <div className="flex items-center gap-4">
        {currentTrack ?
          <div className="flex min-w-0 flex-1 items-center">
            <div className="min-w-0">
              <div className="truncate font-medium">{currentTrack.name}</div>
              <div className="truncate text-sm text-muted-foreground">
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
        <VolumeControls />
      </div>
      <PlaybackSlider />
    </div>
  );
};
