import { useAudioStore } from "@/hooks/use-audio-store";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export const Playlists = (): React.JSX.Element => {
  const playlists = useAudioStore((state) => state.playlists);
  const currentPlaylist = useAudioStore((state) => state.currentPlaylist);
  const setCurrentPlaylist = useAudioStore((state) => state.setCurrentPlaylist);

  return (
    <div className="w-full p-4 sm:border-r md:w-64">
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
