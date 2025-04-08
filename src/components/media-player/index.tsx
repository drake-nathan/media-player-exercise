import { getPlaylists } from "@/data/get-playlists";
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

  return (
    <Card className="w-full max-w-4xl p-0 shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <Playlists
            currentPlaylist={currentPlaylist}
            playlists={playlists}
            setCurrentPlaylist={setCurrentPlaylist}
          />
          <TrackList currentPlaylistData={currentPlaylistData} />
        </div>
        <ControlPanel currentPlaylistData={currentPlaylistData} />
      </CardContent>
    </Card>
  );
};
