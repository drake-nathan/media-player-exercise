import type { Playlist, Track } from "@/data/get-playlists";
import type { SetState } from "@/lib/types";

import { formatDuration } from "@/lib/format-duration";
import { cn } from "@/lib/utils";

interface Props {
  currentPlaylistData: Playlist | undefined;
  currentTrack: null | Track;
  isPlaying: boolean;
  setCurrentTrack: SetState<null | Track>;
  togglePlay: (forceState?: boolean) => void;
}

export const TrackList = ({
  currentPlaylistData,
  currentTrack,
  isPlaying,
  setCurrentTrack,
  togglePlay,
}: Props): React.JSX.Element => {
  const handleTrackSelect = (selectedTrack: Track) => {
    const isNewTrack = !currentTrack || selectedTrack.name !== currentTrack.name;
    
    // Set the new track
    setCurrentTrack(selectedTrack);
    
    // If it's a new track or not currently playing, force playback to start
    if (isNewTrack || !isPlaying) {
      togglePlay(true); // Force play to true
    }
  };

  return (
    <div className="min-h-[50vh] flex-1 overflow-auto p-4">
      <h2 className="mb-4 text-xl font-bold">{currentPlaylistData?.name}</h2>
      <div className="space-y-2">
        {currentPlaylistData?.tracks.map((track) => (
          <div
            className={cn(
              "hover:bg-muted flex cursor-pointer items-center rounded-md p-2",
              track.name === currentTrack?.name && "bg-muted",
            )}
            key={track.name}
            onClick={() => {
              handleTrackSelect(track);
            }}
          >
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{track.name}</div>
              <div className="text-muted-foreground truncate text-sm">
                {currentPlaylistData.artist}
              </div>
            </div>
            <div className="text-muted-foreground ml-2 text-sm">
              {formatDuration(track.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
