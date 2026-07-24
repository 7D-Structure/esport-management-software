import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isSiteAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    isSiteAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    isSiteAdmin?: boolean;
  }
}
