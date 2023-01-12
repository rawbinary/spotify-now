import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const spotifyRouter = createTRPCRouter({
  getCurrentSong: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await ctx.prisma.user
      .findUnique({
        where: { id: ctx.session.user.id },
      })
      .accounts();
    const token = accounts?.pop()?.access_token;

    if (!token) return "Token Expired re-login.";

    const resp = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const trackInfo = (await resp.json()) as SpotifyCurrentlyPlayingTrack;
    console.log(trackInfo);
    return `${trackInfo.item.name} by ${
      trackInfo.item.artists[0]
        ? trackInfo.item.artists[0].name
        : "Not artist available."
    }`;
  }),
});

const SpotifyCurrentlyPlayingTrack = z.object({
  is_playing: z.boolean(),
  item: z.object({
    artists: z.array(z.object({ name: z.string() })).length(1),
    name: z.string(),
  }),
});

type SpotifyCurrentlyPlayingTrack = z.infer<
  typeof SpotifyCurrentlyPlayingTrack
>;
