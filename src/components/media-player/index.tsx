import { Card, CardContent } from "../ui/card";
import { ControlPanel } from "./control-panel";
import { Playlists } from "./playlists";
import { TrackList } from "./track-list";

export const MediaPlayer = () => {
  return (
    <Card className="w-full max-w-4xl rounded-none border-0 p-0 shadow-lg sm:rounded-xl sm:border">
      <CardContent className="p-0">
        <div className="flex flex-col overflow-hidden md:flex-row">
          <Playlists />
          <TrackList />
        </div>
        <ControlPanel />
      </CardContent>
    </Card>
  );
};
