import type { Playlist } from "@/data/get-playlists";
import type { SetState } from "@/lib/types";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface Props {
  currentPlaylist: string;
  playlists: Playlist[];
  setCurrentPlaylist: SetState<string>;
}

export const Playlists = ({
  currentPlaylist,
  playlists,
  setCurrentPlaylist,
}: Props): React.JSX.Element => {
  return (
    <div className="w-full border-r p-4 md:w-64">
      <h2 className="mb-4 text-xl font-bold">Playlists</h2>
      <Tabs
        className="w-full"
        onValueChange={setCurrentPlaylist}
        orientation="vertical"
        value={currentPlaylist}
      >
        <TabsList className="flex h-auto w-full flex-col items-start justify-start space-y-1 bg-transparent p-0">
          {playlists.map((playlist) => (
            <TabsTrigger
              className="w-full justify-start px-3 py-2 data-[state=active]:bg-muted"
              key={playlist.name}
              value={playlist.name}
            >
              {playlist.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
