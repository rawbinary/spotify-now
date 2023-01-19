import NextAuth, { type NextAuthOptions } from "next-auth";
import type { SpotifyProfile } from "next-auth/providers/spotify";
import SpotifyProvider from "next-auth/providers/spotify";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      const [spotify] = await prisma.account.findMany({
        where: { userId: user.id, provider: "spotify" },
      });

      if (
        spotify &&
        spotify.expires_at &&
        spotify.expires_at <= Math.ceil(Date.now() / 1000)
      ) {
        // token expired; trying to refresh it
        try {
          const resp = await fetch("https://accounts.spotify.com/api/token", {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: env.SPOTIFY_CLIENT_ID,
              client_secret: env.SPOTIFY_CLIENT_SECRET,
              grant_type: "refresh_token",
              refresh_token: spotify.refresh_token,
            } as Record<string, string>),
            method: "POST",
          });

          const tokens = (await resp.json()) as {
            access_token: string;
            expires_in: number;
            refresh_token: string;
          };

          if (!resp.ok) throw tokens;

          await prisma.account.update({
            where: {
              provider_providerAccountId: {
                provider: "spotify",
                providerAccountId: spotify.providerAccountId,
              },
            },
            data: {
              access_token: tokens.access_token,
              expires_at: Math.ceil(Date.now() / 1000) + tokens.expires_in,
              refresh_token: tokens.refresh_token,
            },
          });
        } catch (error) {
          console.error("Error refreshing token", error);
          session.error = "RefreshAccessTokenError";
        }
      }

      if (session.user) {
        session.user.id = user.id;
        session.user.accessToken = spotify?.access_token;
      }

      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: { scope: "user-read-email,user-read-currently-playing" },
      },
      profile(profile: SpotifyProfile) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url,
        };
      },
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

// function CustomSpotifyProvider(options: OAuthUserConfig<SpotifyProfile>) {
//   return Object.assign(SpotifyProvider(options), options);
// }

export default NextAuth(authOptions);
