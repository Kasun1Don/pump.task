import { cache } from "react";
import { cookies, headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "@acme/api";
import { createCaller, createTRPCContext } from "@acme/api";
import { auth } from "@acme/auth";

import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const token: string = cookies().get("jwt")?.value ?? "";
  const projectId: string = cookies().get("projectId")?.value ?? "";

  const heads = new Headers(headers());
  heads.set("x-trpc-source", "react server component");
  heads.set("Authorization", `Bearer ${token}`);
  heads.set("projectId", projectId);

  return createTRPCContext({
    session: await auth(),
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
