import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";

export const spotifyRouter = createTRPCRouter({
  getCurrentSong: protectedProcedure.query(async ({ ctx }) => {
    const token = ctx.session.user.accessToken;

    if (!token) return "No Access Token, relogin.";

    const resp = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (resp.status == 204) return "Nothing";

    if (resp.status == 401) {
      return "Access Token Expired!";
    }

    if (resp.status == 403) return await resp.text();

    const trackInfo = (await resp.json()) as SpotifyCurrentlyPlayingTrack;
    return `${trackInfo.item.name} by ${trackInfo.item.artists
      .map((x) => x.name)
      .join(", ")} ${!trackInfo.is_playing ? "[paused]" : ""}`;
  }),

  getStreamLink: protectedProcedure.query(({ ctx }) => {
    // await ctx.prisma.spotifyLink;

    return `${env.NEXTAUTH_URL}/api/`;
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
