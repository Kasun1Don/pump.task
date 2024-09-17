import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { User } from "@acme/db";
import { CreateUserSchema } from "@acme/validators";

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
      projects: user.projects,
    }));
  }),
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      await User.create(input);
    }),
  byWallet: publicProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ input }) => {
      const user = await User.findOne({ walletId: input.walletId });
      if (user === null) {
        return { error: "User not found" };
      }

      return {
        walletId: user.walletId,
        name: user.name,
      };
    }),
} satisfies TRPCRouterRecord;
