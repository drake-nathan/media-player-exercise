import type { Track } from "@/data/get-playlists";

import { create } from "zustand";

interface AudioState {
  audio: HTMLAudioElement | null;
  changeVolume: (newVolume: number) => void;
  currentTime: number;
  currentTrack: null | Track;
  duration: number;
  isLoading: boolean;
  isPlaying: boolean;
  seek: (time: number) => void;
  setTrack: (track: Track | undefined) => void;
  skipToNext: (tracks: Track[]) => void;
  skipToPrevious: (tracks: Track[]) => void;
  togglePlay: (forceState?: boolean) => void;
  volume: number;
}

export const useAudioStore = create<AudioState>((set, get) => {
  const audio = typeof window !== "undefined" ? new Audio() : null;

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
  }

  /* eslint-disable perfectionist/sort-objects */
  return {
    // State
    audio,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    isPlaying: false,
    volume: 1.0,

    // Actions
    setTrack: (track) => {
      const { audio, isPlaying } = get();
      if (!audio) return;

      set({ currentTrack: track, isLoading: true });

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

    changeVolume: (newVolume) => {
      const { audio } = get();
      if (!audio) return;

      const volumeValue = Math.max(0, Math.min(1, newVolume));
      audio.volume = volumeValue;
      set({ volume: volumeValue });
    },

    seek: (time) => {
      const { audio } = get();
      if (!audio || audio.readyState <= 0) return;

      audio.currentTime = time;
      set({ currentTime: time });
    },

    skipToNext: (tracks) => {
      const { currentTrack } = get();
      if (!currentTrack || !tracks.length) return;

      const currentIndex = tracks.findIndex(
        (track) => track.name === currentTrack.name,
      );

      if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
        const nextTrack = tracks[currentIndex + 1];
        get().setTrack(nextTrack);
      }
    },

    skipToPrevious: (tracks) => {
      const { currentTrack } = get();
      if (!currentTrack || !tracks.length) return;

      const currentIndex = tracks.findIndex(
        (track) => track.name === currentTrack.name,
      );

      if (currentIndex > 0) {
        const prevTrack = tracks[currentIndex - 1];
        get().setTrack(prevTrack);
      }
    },
  };
});
