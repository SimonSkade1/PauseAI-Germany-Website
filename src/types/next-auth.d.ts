import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      discordId: string;
      accessToken: string;
    } & DefaultSession["user"];
  }

  interface User {
    discordId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId: string;
    accessToken: string;
  }
}
