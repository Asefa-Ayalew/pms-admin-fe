import handleLogout from "@/src/shared/utitlity/log-out";
import { decodeJwt } from "jose";
import { JWT, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AppError } from "./src/models/app-interfaces";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface Token {
  accessToken: string;
  refreshToken: string;
  error?: string;
}

export async function refreshAccessToken(token: Partial<Token> | JWT) {
  try {
    const headers: HeadersInit = {};

    if (token.refreshToken) {
      headers["x-refresh-token"] = token.refreshToken;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_API}/auth/refresh`,
      {
        method: "POST",
        headers,
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { ...token, error: "RefreshTokenExpired" };
      }
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    const returnData = {
      ...token,
      accessToken: data.token,
      refreshToken: data.refreshToken,
    };
    return returnData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error refreshing access token:", error.message);
    } else {
      console.error("Unknown error refreshing access token:", error);
    }
    await handleLogout();
    return { ...token, error: "RefreshTokenError" };
  }
}

export async function updateTokenWithUserData(session: {
  accessToken: string;
  refreshToken: string;
}) {
  try {
    return {
      ...session,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  } catch (error) {
    return session;
  }
}

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  secret:
    process.env.AUTH_SECRET || "072+s5MdhjIugCd9Z0BEmhBVnkCRVQuxbzymIWASSuo=",
  trustHost: true,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const authUser = user as unknown as AuthResponse;
        return {
          accessToken: authUser.accessToken,
          refreshToken: authUser.refreshToken,
        };
      }

      if (trigger === "update") {
        return updateTokenWithUserData(session);
      }

      if (token.accessToken) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const decodedToken = decodeJwt(token.accessToken as string);

        const tokenExpiry = decodedToken.exp;
        const bufferTime = 30;

        if (tokenExpiry && currentTimestamp >= tokenExpiry - bufferTime) {
           await handleLogout();
          const newToken = await refreshAccessToken(token as Partial<Token>);
         console.log('newToken', newToken);
          if ("error" in newToken && newToken.error) {
            return { ...token };
          }

          return newToken;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.error) {
        throw new Error(token.error as string);
      }

      return {
        ...session,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      };
    },

    authorized: async ({ auth, request }) => {
      const pathname = request.nextUrl?.pathname;
      if (pathname?.startsWith("/auth/")) {
        return true;
      }

      return !!auth;
    },
  },

  redirectProxyUrl: process.env.NEXT_PUBLIC_APP_API,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter your email and password.");
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_API}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );
          const { accessToken, refreshToken, profile } = await response.json();
          if (!accessToken) {
            throw new Error("Login failed");
          }


          return {
            id: profile.id, 
            name: profile.name,
            email: profile.email,
            accessToken,
            refreshToken,
            profile, 
          };
        } catch (error: unknown) {
          console.error(
            "Login error:",
            (error as AppError).error?.data?.message
          );
          return null;
        }
      },
    }),
  ],
};
