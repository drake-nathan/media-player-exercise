import type { Playlist, Track } from "@/data/get-playlists";

import { getPlaylists } from "@/data/get-playlists";
import { create } from "zustand";

interface AudioState {
  audio: HTMLAudioElement | null;
  changeVolume: (newVolume: number) => void;
  currentArtist: string;
  currentPlaylist: string;
  currentPlaylistData: Playlist | undefined;
  currentTime: number;
  currentTrack: null | Track;
  duration: number;
  isLoading: boolean;
  isPlaying: boolean;
  playlists: Playlist[];
  seek: (time: number) => void;
  setCurrentPlaylist: (playlistName: string) => void;
  setTrack: (track: Track | undefined, artist?: string) => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
  togglePlay: (forceState?: boolean) => void;
  volume: number;
}

const { playlists } = getPlaylists();

export const useAudioStore = create<AudioState>((set, get) => {
  const audio = typeof window !== "undefined" ? new Audio() : null;

  const initialTrack = playlists[0]?.tracks[0];

  if (audio) {
    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration, isLoading: false });
    });

    audio.addEventListener("timeupdate", () => {
      set({ currentTime: audio.currentTime });
    });

    audio.addEventListener("ended", () => {
      set({ isPlaying: false });
    });

    audio.addEventListener("pause", () => {
      set({ isPlaying: false });
    });

    audio.addEventListener("play", () => {
      set({ isPlaying: true });
    });

    if (initialTrack?.url) {
      audio.src = initialTrack.url;
      audio.load();
    }
  }

  return {
    audio,
    changeVolume: (newVolume) => {
      const { audio } = get();
      if (!audio) return;

      const volumeValue = Math.max(0, Math.min(1, newVolume));
      audio.volume = volumeValue;
      set({ volume: volumeValue });
    },
    currentArtist: playlists[0]?.artist ?? "",
    currentPlaylist: playlists[0]?.name ?? "",
    currentPlaylistData: playlists[0],
    currentTime: 0,
    currentTrack: initialTrack ?? null,
    duration: 0,
    isLoading: true,
    isPlaying: false,
    playlists,
    seek: (time) => {
      const { audio } = get();
      if (!audio || audio.readyState <= 0) return;

      audio.currentTime = time;
      set({ currentTime: time });
    },
    setCurrentPlaylist: (playlistName) => {
      const { playlists } = get();
      const newPlaylistData = playlists.find(
        (playlist) => playlist.name === playlistName,
      );

      // Only update the playlist information, but don't change the track
      set({
        currentPlaylist: playlistName,
        currentPlaylistData: newPlaylistData,
      });

      // Only set the initial track if there is no current track playing
      // This will only happen on first load or if all tracks are cleared
      const { currentTrack } = get();
      if (!currentTrack && newPlaylistData?.tracks.length) {
        get().setTrack(newPlaylistData.tracks[0]);
      }
    },
    setTrack: (track, artist) => {
      const { audio, currentPlaylistData, isPlaying, playlists } = get();
      if (!audio) return;

      // Find the artist for this track if not provided
      let trackArtist = artist;
      if (!trackArtist && track) {
        // First check if the track is in the current playlist
        if (currentPlaylistData?.tracks.some((t) => t.name === track.name)) {
          trackArtist = currentPlaylistData.artist;
        } else {
          // Search all playlists for this track to find its artist
          for (const playlist of playlists) {
            if (playlist.tracks.some((t) => t.name === track.name)) {
              trackArtist = playlist.artist;
              break;
            }
          }
        }
      }

      set({
        currentArtist: trackArtist ?? "",
        currentTrack: track,
        isLoading: true,
      });

      if (track?.url) {
        audio.src = track.url;
        audio.load();

        if (isPlaying) {
          audio.play().catch((error: unknown) => {
            console.error("Playback failed:", error);
          });
        }
      }
    },
    skipToNext: () => {
      const { currentPlaylistData, currentTrack } = get();
      if (!currentTrack || !currentPlaylistData?.tracks.length) return;

      const tracks = currentPlaylistData.tracks;
      const currentIndex = tracks.findIndex(
        (track) => track.name === currentTrack.name,
      );

      if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
        const nextTrack = tracks[currentIndex + 1];
        get().setTrack(nextTrack, currentPlaylistData.artist);
      }
    },
    skipToPrevious: () => {
      const { currentPlaylistData, currentTrack } = get();
      if (!currentTrack || !currentPlaylistData?.tracks.length) return;

      const tracks = currentPlaylistData.tracks;
      const currentIndex = tracks.findIndex(
        (track) => track.name === currentTrack.name,
      );

      if (currentIndex > 0) {
        const prevTrack = tracks[currentIndex - 1];
        get().setTrack(prevTrack, currentPlaylistData.artist);
      }
    },
    togglePlay: (forceState) => {
      const { audio, isPlaying } = get();
      if (!audio) return;

      const newPlayState = forceState ?? !isPlaying;

      if (newPlayState) {
        audio.play().catch((error: unknown) => {
          console.error("Playback failed:", error);
        });
      } else {
        audio.pause();
      }

      set({ isPlaying: newPlayState });
    },
    volume: 1.0,
  };
});
