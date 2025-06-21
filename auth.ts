// auth.ts
import NextAuth, { NextAuthConfig } from "next-auth";
import { authConfig } from "./auth.config";

const options: NextAuthConfig = {
  ...authConfig,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(options);
