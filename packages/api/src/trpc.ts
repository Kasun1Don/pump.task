/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { createThirdwebClient } from "thirdweb";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { ZodError } from "zod";

import type { Session } from "@acme/auth";
import { auth, validateToken } from "@acme/auth";
import { Member, User } from "@acme/db";
import dbConnect from "@acme/db/dbConnect";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID!;

export const client = createThirdwebClient({
  clientId: client_id,
});

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN ?? "",
  adminAccount: privateKeyToAccount({ client, privateKey }),
});

/**
 * Isomorphic Session getter for API requests
 * - Expo requests will have a session token in the Authorization header
 * - Next.js requests will have a session token in cookies
 */
const isomorphicGetSession = async (headers: Headers) => {
  const authToken = headers.get("Authorization") ?? null;
  if (authToken) return validateToken(authToken);
  return auth();
};

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  session: Session | null;
}) => {
  const authToken = opts.headers.get("Authorization") ?? null;
  const session = await isomorphicGetSession(opts.headers);

  await dbConnect();

  return {
    session,
    token: authToken,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  } else {
    try {
      const token = ctx.token.split(" ")[1] ?? "";
      const verified = await thirdwebAuth.verifyJWT({ jwt: token });
      if (!verified.valid) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    } catch (error) {
      console.log("Error in protectedProcedure", error);
    }
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session },
    },
  });
});

export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  let walletId = "";
  if (!ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = ctx.token.split(" ")[1]!;
    const verified = await thirdwebAuth.verifyJWT({ jwt: token });
    if (!verified.valid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    walletId = verified.parsedJWT.sub;
  }
  const user = await User.findOne({ walletId });
  if (!user?.activeProjects) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const projectId = user.activeProjects.at(-1)?.toString();
  const members = await Member.find({ projectId: projectId });
  const member = members.find((member) => member.walletId === walletId);
  if (member) {
    if (
      member.role.toLowerCase() !== "admin" &&
      member.role.toLowerCase() !== "owner"
    ) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  } else {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session },
    },
  });
});

export const memberProcedure = t.procedure.use(async ({ ctx, next }) => {
  let walletId = "";
  if (!ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = ctx.token.split(" ")[1]!;
    const verified = await thirdwebAuth.verifyJWT({ jwt: token });
    if (!verified.valid) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    walletId = verified.parsedJWT.sub;
  }
  const user = await User.findOne({ walletId });
  if (!user?.activeProjects) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const projectId = user.activeProjects.at(-1)?.toString();
  const members = await Member.find({ projectId: projectId });
  const member = members.find((member) => member.walletId === walletId);
  if (!member) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session },
    },
  });
});
