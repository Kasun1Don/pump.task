import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { LoginHistory, User } from "@acme/db";

import { protectedProcedure, publicProcedure } from "../trpc";

const CreateUserSchema = z.object({
  name: z.string(),
  walletId: z.string(),
});

export const userRouter = {
  // Get all users
  all: publicProcedure.query(async () => {
    try {
      // Fetch data with lean
      const users = await User.find()
        .populate({
          path: "projects",
          model: "ProjectClass",
        })
        .lean();

      // Convert ObjectIds to strings and return
      const serializedUsers = users.map((user) => ({
        ...user,
        _id: user._id.toString(),
        projects: user.projects?.map((project) => ({
          ...project,
          _id: project._id.toString(),
        })),
        loginHistories: user.loginHistories?.map((history) => ({
          ...history,
          _id: history._id.toString(),
        })),
      }));

      return serializedUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }),

  // Create a new user with default settings and login history
  create: protectedProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      try {
        const newLogin = await LoginHistory.create({});

        const newUser = await User.create({
          ...input,
          userSettings: {},
          loginHistories: [newLogin._id],
        });

        return { success: true, user: newUser };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
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
          loginHistories: user.loginHistories?.map((history) => ({
            _id: history._id.toString(),
          })),
        };

        return serializedUser;
      } catch (error) {
        console.error("Error fetching user by wallet:", error);
        throw new Error("Failed to fetch user");
      }
    }),
} satisfies TRPCRouterRecord;
