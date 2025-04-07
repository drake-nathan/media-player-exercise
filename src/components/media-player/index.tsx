import { getPlaylists } from "@/data/get-playlists";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { useState } from "react";

import { Card, CardContent } from "../ui/card";
import { ControlPanel } from "./control-panel";
import { Playlists } from "./playlists";
import { TrackList } from "./track-list";

const { playlists } = getPlaylists();

export const MediaPlayer = () => {
  const [currentPlaylist, setCurrentPlaylist] = useState(
    playlists[0]?.name ?? "",
  );

  const currentPlaylistData = playlists.find(
    (playlist) => playlist.name === currentPlaylist,
  );

  const {
    changeVolume,
    currentTime,
    currentTrack,
    duration,
    isPlaying,
    seek,
    setCurrentTrack,
    skipToNext,
    skipToPrevious,
    togglePlay,
    volume,
  } = useAudioPlayer(currentPlaylistData?.tracks[0] ?? null);

  return (
    <Card className="w-full max-w-4xl p-0 shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <Playlists
            currentPlaylist={currentPlaylist}
            playlists={playlists}
            setCurrentPlaylist={setCurrentPlaylist}
          />
          <TrackList
            currentPlaylistData={currentPlaylistData}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            setCurrentTrack={setCurrentTrack}
            togglePlay={togglePlay}
          />
        </div>
        <ControlPanel
          changeVolume={changeVolume}
          currentPlaylistData={currentPlaylistData}
          currentTime={currentTime}
          currentTrack={currentTrack}
          duration={duration}
          isPlaying={isPlaying}
          seek={seek}
          skipToNext={skipToNext}
          skipToPrevious={skipToPrevious}
          togglePlay={togglePlay}
          volume={volume}
        />
      </CardContent>
    </Card>
  );
};
