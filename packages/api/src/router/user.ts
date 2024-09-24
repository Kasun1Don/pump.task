import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { User } from "@acme/db";

import { publicProcedure } from "../trpc";

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
  // Get a user by wallet ID
  byWallet: publicProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await User.findOne({ walletId: input.walletId })
          .populate({
            path: "projects",
            model: "ProjectClass",
          })
          .lean();

        if (!user) {
          throw new Error("User not found");
        }

        console.log("User:", user);

        // Convert ObjectIds to strings and return
        const serializedUser = {
          ...user,
          _id: user._id.toString(),
          projects: user.projects?.map((project) => ({
            ...project,
            _id: project._id.toString(),
          })),
          // loginHistories: user.loginHistories?.map((history) => ({
          //   _id: history._id.toString(),
          // })),
        };

        return serializedUser;
      } catch (error) {
        console.error("Error fetching user by wallet:", error);
        throw new Error("Failed to fetch user");
      }
    }),
} satisfies TRPCRouterRecord;
