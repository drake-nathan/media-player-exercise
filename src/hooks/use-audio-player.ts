// useAudioPlayer.js
import type { Track } from "@/data/get-playlists";

import { useEffect, useRef, useState } from "react";

export const useAudioPlayer = (initialTrack: null | Track) => {
  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setIsLoading(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Handle track changes
  useEffect(() => {
    if (currentTrack?.url) {
      const audio = audioRef.current;

      // If we're just toggling play/pause on the same track, don't reload
      if (audio.src !== currentTrack.url) {
        setIsLoading(true);
        audio.src = currentTrack.url;
        audio.load();

        if (isPlaying) {
          audio.play().catch((error: unknown) => {
            console.error("Playback failed:", error);
          });
        }
      }
    }
  }, [currentTrack, isPlaying]);

  const togglePlay = (forceState?: boolean) => {
    const audio = audioRef.current;
    const newPlayState = forceState ?? !isPlaying;

    if (newPlayState) {
      audio.play().catch((error: unknown) => {
        console.error("Playback failed:", error);
      });
    } else {
      audio.pause();
    }

    setIsPlaying(newPlayState);
  };

  // Volume control
  const changeVolume = (newVolume: number) => {
    const audio = audioRef.current;
    const volumeValue = Math.max(0, Math.min(1, newVolume));

    audio.volume = volumeValue;
    setVolume(volumeValue);
  };

  // Seek to position
  const seek = (time: number) => {
    const audio = audioRef.current;

    if (audio.readyState > 0) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipToNext = (tracks: Track[]) => {
    if (!currentTrack || !tracks.length) return;

    const currentIndex = tracks.findIndex(
      (track) => track.name === currentTrack.name,
    );

    // If found and not the last track
    if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
      const nextTrack = tracks[currentIndex + 1];
      setCurrentTrack(nextTrack ?? null);
      if (isPlaying) {
        // Maintain playing state when skipping
        togglePlay(true);
      }
    }
  };

  const skipToPrevious = (tracks: Track[]) => {
    if (!currentTrack || !tracks.length) return;

    const currentIndex = tracks.findIndex(
      (track) => track.name === currentTrack.name,
    );

    // If found and not the first track
    if (currentIndex > 0) {
      const prevTrack = tracks[currentIndex - 1];
      setCurrentTrack(prevTrack ?? null);
      if (isPlaying) {
        // Maintain playing state when skipping
        togglePlay(true);
      }
    }
  };

  return {
    changeVolume,
    currentTime,
    currentTrack,
    duration,
    isLoading,
    isPlaying,
    seek,
    setCurrentTrack,
    skipToNext,
    skipToPrevious,
    togglePlay,
    volume,
  };
};
