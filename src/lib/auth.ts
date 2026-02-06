import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    discordId: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "discord",
      name: "Discord",
      type: "oauth",
      authorization: {
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
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
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
