import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { User } from "@acme/db";

// import { CreateUserSchema } from "@acme/validators";

import { publicProcedure } from "../trpc";

const CreateUserSchema = z.object({
  name: z.string(),
  walletId: z.string(),
});

export const userRouter = {
  all: publicProcedure.query(async (userContext) => {
    console.log(userContext);

    try {
      // Fetch and lean the data
      const users = await User.find()
        .populate({
          path: "projects",
          model: "ProjectClass",
        })
        .lean();

      // Manually convert ObjectId to string because TRPC doesn't like to work with Mongoose ObjectId's :(
      const serializedUsers = users.map((user) => ({
        ...user,
        _id: user._id.toString(),
        projects: user.projects?.map((project) => ({
          ...project,
          _id: project._id.toString(),
        })),
      }));

      return serializedUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
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
