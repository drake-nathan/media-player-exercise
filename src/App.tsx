/* eslint-disable unicorn/filename-case */
// I prefer kebab case for filenames, but it's not worth dealing with the git/mac case sensitivity :-)

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";

interface Track {
  album: string;
  artist: string;
  cover: string;
  duration: string;
  id: string;
  title: string;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}

const App = (): React.JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState("favorites");
  const [currentTrackId, setCurrentTrackId] = useState<null | string>(null);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  const playlists: Playlist[] = [
    {
      id: "favorites",
      name: "Favorites",
      tracks: [
        {
          album: "Hurry Up, We're Dreaming",
          artist: "M83",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "4:03",
          id: "track1",
          title: "Midnight City",
        },
        {
          album: "Awaken, My Love!",
          artist: "Childish Gambino",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "5:27",
          id: "track2",
          title: "Redbone",
        },
        {
          album: "After Hours",
          artist: "The Weeknd",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "3:20",
          id: "track3",
          title: "Blinding Lights",
        },
      ],
    },
    {
      id: "recent",
      name: "Recently Played",
      tracks: [
        {
          album: "Harry's House",
          artist: "Harry Styles",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "2:47",
          id: "track4",
          title: "As It Was",
        },
        {
          album: "Gemini Rights",
          artist: "Steve Lacy",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "3:52",
          id: "track5",
          title: "Bad Habit",
        },
        {
          album: "Dreamland",
          artist: "Glass Animals",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "3:59",
          id: "track6",
          title: "Heat Waves",
        },
      ],
    },
    {
      id: "discover",
      name: "Discover Weekly",
      tracks: [
        {
          album: "Smithereens",
          artist: "Joji",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "3:53",
          id: "track7",
          title: "Glimpse of Us",
        },
        {
          album: "Gloria",
          artist: "Sam Smith & Kim Petras",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "2:36",
          id: "track8",
          title: "Unholy",
        },
        {
          album: "Endless Summer Vacation",
          artist: "Miley Cyrus",
          cover: "/placeholder.svg?height=300&width=300",
          duration: "3:21",
          id: "track9",
          title: "Flowers",
        },
      ],
    },
  ];

  const currentPlaylistData = playlists.find(
    (playlist) => playlist.id === currentPlaylist,
  );
  const currentTrack =
    currentPlaylistData?.tracks.find((track) => track.id === currentTrackId) ??
    currentPlaylistData?.tracks[0] ??
    null;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!currentTrackId && currentPlaylistData?.tracks.length) {
      setCurrentTrackId(currentPlaylistData.tracks[0]?.id ?? null);
    }
  };

  const handleTrackSelect = (trackId: string) => {
    setCurrentTrackId(trackId);
    setIsPlaying(true);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] ?? 0);
    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Playlist selection */}
        <div className="w-full md:w-64 p-4 border-r">
          <h2 className="text-xl font-bold mb-4">Playlists</h2>
          <Tabs
            className="w-full"
            onValueChange={setCurrentPlaylist}
            orientation="vertical"
            value={currentPlaylist}
          >
            <TabsList className="flex flex-col h-auto items-start justify-start bg-transparent p-0 space-y-1">
              {playlists.map((playlist) => (
                <TabsTrigger
                  className="w-full justify-start px-3 py-2 data-[state=active]:bg-muted"
                  key={playlist.id}
                  value={playlist.id}
                >
                  {playlist.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Track list */}
        <div className="flex-1 p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4">
            {currentPlaylistData?.name}
          </h2>
          <div className="space-y-2">
            {currentPlaylistData?.tracks.map((track) => (
              <div
                className={cn(
                  "flex items-center p-2 rounded-md cursor-pointer hover:bg-muted",
                  currentTrackId === track.id && "bg-muted",
                )}
                key={track.id}
                onClick={() => {
                  handleTrackSelect(track.id);
                }}
              >
                <div className="relative w-10 h-10 mr-3 flex-shrink-0">
                  <img
                    alt={track.album}
                    className="object-cover rounded-md"
                    src={track.cover || "/placeholder.svg"}
                  />
                  {currentTrackId === track.id && isPlaying ?
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{track.title}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {track.artist}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground ml-2">
                  {track.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player controls */}
      <div className="border-t p-4 bg-background">
        <div className="flex items-center gap-4">
          {currentTrack ?
            <div className="flex items-center flex-1 min-w-0">
              <div className="relative w-14 h-14 mr-3 flex-shrink-0">
                <img
                  alt={currentTrack.album}
                  className="object-cover rounded-md"
                  src={currentTrack.cover || "/placeholder.svg"}
                />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{currentTrack.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {currentTrack.artist}
                </div>
              </div>
            </div>
          : null}

          <div className="flex items-center gap-2">
            <Button className="h-9 w-9" size="icon" variant="ghost">
              <SkipBack className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              className="h-10 w-10 rounded-full"
              onClick={handlePlayPause}
              size="icon"
              variant="outline"
            >
              {isPlaying ?
                <Pause className="h-5 w-5" />
              : <Play className="h-5 w-5 ml-0.5" />}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
            <Button className="h-9 w-9" size="icon" variant="ghost">
              <SkipForward className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
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
                max={100}
                onValueChange={handleVolumeChange}
                step={1}
                value={[isMuted ? 0 : volume]}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Slider
            className="[&>span:first-child]:h-1.5"
            max={100}
            step={1}
            value={[30]}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1:12</span>
            <span>{currentTrack?.duration ?? "0:00"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
