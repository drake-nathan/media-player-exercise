import { useAudioStore } from "@/hooks/use-audio-store";

import { PlayControls } from "./play-controls";
import { PlaybackSlider } from "./playback-slider";
import { VolumeControls } from "./volume-controls";

export const ControlPanel = (): React.JSX.Element => {
  const currentPlaylistData = useAudioStore((state) => state.currentPlaylistData);
  const currentTrack = useAudioStore((state) => state.currentTrack);

  return (
    <div className="fixed right-0 bottom-0 left-0 z-10 border-t bg-background p-4 sm:relative sm:rounded-b-xl">
      {/* Mobile layout */}
      <div className="sm:hidden">
        {currentTrack ?
          <div className="mb-3 text-center">
            <div className="truncate font-medium">{currentTrack.name}</div>
            <div className="truncate text-sm text-muted-foreground">
              {currentPlaylistData?.artist}
            </div>
          </div>
        : null}

        <div className="flex items-center justify-between border-t border-muted pt-3 pr-2">
          <PlayControls />
          <VolumeControls />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex sm:items-center sm:gap-4">
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
        <PlayControls />
        <VolumeControls />
      </div>

      <PlaybackSlider />
    </div>
  );
};
