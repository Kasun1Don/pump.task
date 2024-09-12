import type { TRPCRouterRecord } from "@trpc/server";

import { User } from "@acme/db";

import { publicProcedure } from "../trpc";

export const userRouter: TRPCRouterRecord = {
  all: publicProcedure.query(async () => {
    // Fetch all users and populate the projects field
    const users = await User.find().populate("projects");

    return users.map((user) => ({
      walletId: user.walletId,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      projects: user.projects,
    }));
  }),
} satisfies TRPCRouterRecord;
