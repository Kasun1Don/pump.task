import type { TRPCRouterRecord } from "@trpc/server";

import { User } from "@acme/db";

import { publicProcedure } from "../trpc";

export const userRouter = {
  all: publicProcedure.query(async () => {
    const users = await User.find();

    return users.map((user) => ({
      walletId: user.walletId,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
    }));
  }),
} satisfies TRPCRouterRecord;
