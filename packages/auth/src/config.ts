import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// const adapter = MongoDBAdapter(clientPromise);

export const isSecureContext = process.env.NODE_ENV !== "development";

export const authConfig = {
  // adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: process.env.AUTH_SECRET,
  providers: [Discord],
} satisfies NextAuthConfig;

export const validateToken = async (
  _: string,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<NextAuthSession | null> => {
  // Implement
  return null;
};

export const invalidateSessionToken = async (_: string) => {
  // Implement
};
