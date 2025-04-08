import type { Track } from "@/data/get-playlists";
import type { KeyboardEvent } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAudioStore } from "@/hooks/use-audio-store";
import { formatDuration } from "@/lib/format-duration";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const TrackList = (): React.JSX.Element => {
  const playlists = useAudioStore((state) => state.playlists);
  const currentPlaylist = useAudioStore((state) => state.currentPlaylist);
  const setCurrentPlaylist = useAudioStore((state) => state.setCurrentPlaylist);
  const currentPlaylistData = useAudioStore((state) => state.currentPlaylistData);
  const currentTrack = useAudioStore((state) => state.currentTrack);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const togglePlay = useAudioStore((state) => state.togglePlay);
  const setCurrentTrack = useAudioStore((state) => state.setTrack);

  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const trackRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  const handleTrackSelect = (selectedTrack: Track) => {
    const isNewTrack =
      !currentTrack || selectedTrack.name !== currentTrack.name;

    setCurrentTrack(selectedTrack);

    // If it's a new track or not currently playing, force playback to start
    if (isNewTrack || !isPlaying) {
      togglePlay(true);
    }
  };

  // Reset refs array when tracks change
  useEffect(() => {
    if (currentPlaylistData?.tracks) {
      trackRefs.current = trackRefs.current.slice(
        0,
        currentPlaylistData.tracks.length,
      );
    }
  }, [currentPlaylistData?.tracks]);

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const tracksLength = currentPlaylistData?.tracks.length ?? 0;

    if (tracksLength === 0) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = prev < tracksLength - 1 ? prev + 1 : prev;
          trackRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : prev;
          trackRefs.current[newIndex]?.focus();
          return newIndex;
        });
        break;
      }
      case "End": {
        e.preventDefault();
        setFocusedIndex(tracksLength - 1);
        trackRefs.current[tracksLength - 1]?.focus();
        break;
      }
      case "Home": {
        e.preventDefault();
        setFocusedIndex(0);
        trackRefs.current[0]?.focus();
        break;
      }
    }
  };

  // Handle list focus
  const handleListFocus = () => {
    // If nothing is focused yet and we have tracks, focus the first one or the current track
    if (focusedIndex === -1 && currentPlaylistData?.tracks.length) {
      const currentTrackIndex = currentPlaylistData.tracks.findIndex(
        (track) => track.name === currentTrack?.name,
      );
      const indexToFocus = currentTrackIndex !== -1 ? currentTrackIndex : 0;
      setFocusedIndex(indexToFocus);
      trackRefs.current[indexToFocus]?.focus();
    }
  };

  // Handle list blur
  const handleListBlur = (e: React.FocusEvent) => {
    // Only reset focus if the focus is moving outside the list
    if (!listRef.current?.contains(e.relatedTarget as Node)) {
      setFocusedIndex(-1);
    }
  };

  return (
    <div className="h-[50vh] flex-1 overflow-auto p-4 pb-[200px] sm:pb-4">
      {/* Playlist dropdown for small screens */}
      <div className="mb-4 flex items-center justify-between sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1 text-xl font-bold">
            {currentPlaylistData?.name}
            <ChevronDownIcon className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {playlists.map((playlist) => (
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer",
                  playlist.name === currentPlaylist && "bg-muted"
                )}
                key={playlist.name}
                onClick={() => {
                  setCurrentPlaylist(playlist.name);
                }}
              >
                {playlist.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Playlist title for larger screens */}
      <h2 className="mb-4 hidden text-xl font-bold sm:block">{currentPlaylistData?.name}</h2>
      <ul
        aria-activedescendant={
          focusedIndex >= 0 ? `track-${focusedIndex}` : undefined
        }
        className="space-y-2"
        onBlur={handleListBlur}
        onFocus={handleListFocus}
        onKeyDown={handleKeyDown}
        ref={listRef}
        role="listbox"
        tabIndex={0}
      >
        {currentPlaylistData?.tracks.map((track, index) => (
          <li className="focus-visible:outline-none" key={track.name}>
            <button
              aria-selected={track.name === currentTrack?.name}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                track.name === currentTrack?.name && "bg-muted",
              )}
              id={`track-${index}`}
              onClick={() => {
                handleTrackSelect(track);
              }}
              onFocus={() => {
                setFocusedIndex(index);
              }}
              ref={(el) => {
                trackRefs.current[index] = el;
              }}
              role="option"
              tabIndex={-1} // Remove from tab order, will be focused programmatically
              type="button"
            >
              <div className="flex flex-col items-start gap-1">
                <div className="truncate font-medium">{track.name}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {currentPlaylistData.artist}
                </div>
              </div>
              <div className="ml-2 text-sm text-muted-foreground">
                {formatDuration(track.duration)}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
