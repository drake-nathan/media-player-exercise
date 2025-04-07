import { z } from "zod";

import playlistsData from "./playlists.json";

const trackSchema = z.object({
  duration: z.number(),
  name: z.string(),
  url: z.string().url(),
});

const playlistSchema = z.object({
  artist: z.string(),
  name: z.string(),
  tracks: z.array(trackSchema),
  year: z.number().int().positive(),
});

const playlistsSchema = z.object({
  playlists: z.array(playlistSchema),
});

export type Track = z.infer<typeof trackSchema>;
export type Playlist = z.infer<typeof playlistSchema>;
export type PlaylistsData = z.infer<typeof playlistsSchema>;

/**
 * Get validated playlists data
 *
 * @returns Validated playlists data with type safety
 */
export const getPlaylists = (): PlaylistsData => {
  const result = playlistsSchema.safeParse(playlistsData);

  if (!result.success) {
    console.error("Playlist data validation failed:", result.error.format());
    throw new Error("Invalid playlist data structure");
  }

  return result.data;
};

/**
 * Get a specific playlist by name
 *
 * @param name The name of the playlist to find
 * @returns The playlist or undefined if not found
 */
export const getPlaylistByName = (name: string): Playlist | undefined => {
  const { playlists } = getPlaylists();
  return playlists.find((playlist) => playlist.name === name);
};
