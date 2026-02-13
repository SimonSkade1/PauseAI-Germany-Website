import { NextAuthOptions } from "next-auth";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

declare module "next-auth" {
  interface User {
    discordId: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      discordId?: string;
      accessToken?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "discord",
      name: "Discord",
      type: "oauth",
      authorization: {
        url: "https://discord.com/api/oauth2/authorize",
        params: { scope: "identify" },
      },
      token: "https://discord.com/api/oauth2/token",
      userinfo: "https://discord.com/api/users/@me",
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${(parseInt(profile.discriminator) % 5)}.png`,
          discordId: profile.id,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = (profile as any).discordId || (profile as any).id;
        token.accessToken = account.access_token as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.discordId = token.discordId as string;
        session.user.accessToken = token.accessToken as string;

        // Ensure user exists in Convex
        if (token.discordId) {
          fetchMutation(api.users.ensureUser, {
            discordId: token.discordId,
            discordName: token.name || "Unknown",
          }).catch((err) => {
            console.error("Failed to ensure user in Convex:", err);
          });
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/action",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
