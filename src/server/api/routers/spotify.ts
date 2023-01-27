import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";

export const spotifyRouter = createTRPCRouter({
  getCurrentSong: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user.accessToken) return "No Access Token, relogin.";
    return await getFromSpotify(ctx.session.user.accessToken);
  }),

  getStreamLink: protectedProcedure.query(async ({ ctx }) => {
    let [link] = await ctx.prisma.spotifyLink.findMany({
      where: { userId: ctx.session.user.id },
    });

    if (!link) {
      link = await ctx.prisma.spotifyLink.create({
        data: { userId: ctx.session.user.id },
      });
    }

    return `${env.NEXTAUTH_URL}/source/${link.id}`;
  }),

  getSongByID: publicProcedure
    .input(z.object({ lid: z.string() }))
    .query(async ({ ctx, input }) => {
      const spotifyAccs = await ctx.prisma.spotifyLink
        .findFirst({
          where: { id: input.lid },
        })
        .user()
        .accounts({ where: { provider: "spotify" } });

      if (!spotifyAccs) {
        throw "Invalid Link";
      }

      const acc = spotifyAccs.pop();

      if (!acc) {
        throw "Invalid Link";
      }

      if (!acc.access_token) return "No Access Token, relogin.";
      return getFromSpotify(acc.access_token);
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

async function getFromSpotify(token: string) {
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
}
