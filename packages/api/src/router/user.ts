import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { LoginHistory, User } from "@acme/db";

import { protectedProcedure } from "../trpc";

export const userRouter = {
  login: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
        location: z.string().optional(),
        browser: z.string().optional(),
        operatingSystem: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Find user by wallet ID
        let user = await User.findOne({ walletId: input.walletId })
          .populate({
            path: "projects",
            model: "ProjectClass",
          })
          .lean();

        // If user does not exist, throw an error
        if (!user) {
          throw new Error("User not found");
        }

        // Create a new login history Instance
        const newLogin = await LoginHistory.create({
          location: input.location ?? "unknown",
          browser: input.browser ?? "unknown",
          operatingSystem: input.operatingSystem ?? "unknown",
        });

        // Update the user's login history Array and add the new login
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $push: { loginHistories: newLogin._id },
          },
          { new: true },
        )
          .populate({
            path: "projects",
            model: "ProjectClass",
          })
          .lean();

        // Convert ObjectIds to strings
        const serializedUser = {
          ...user,
          _id: user?._id.toString(),
          projects: user?.projects?.map((project) => ({
            ...project,
            _id: project._id.toString(),
          })),
        };

        return serializedUser;
      } catch (error) {
        console.error("Error during user login process:", error);
        throw new Error("Failed to log in user");
      }
    }),
  create: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
        name: z.string(),
        email: z.string().email(),
        image: z.string().optional(),
        bio: z.string().optional(),
        location: z.string().optional(),
        browser: z.string().optional(),
        operatingSystem: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const newLogin = await LoginHistory.create({
          location: input.location ?? "unknown",
          browser: input.browser ?? "unknown",
          operatingSystem: input.operatingSystem ?? "unknown",
        });

        const newUser = await User.create({
          walletId: input.walletId,
          name: input.name,
          email: input.email,
          image: input.image,
          userSettings: {},
          loginHistories: [newLogin._id],
        });

        // Convert ObjectIds to strings
        const serializedUser = {
          ...newUser,
          _id: newUser._id.toString(),
          projects: newUser.projects?.map((project) => ({
            ...project,
            _id: project._id.toString(),
          })),
        };

        return serializedUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    }),
  byWallet: protectedProcedure
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
  update: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().optional(),
        userSettings: z
          .object({
            language: z.string().optional(),
            isThemeDark: z.boolean().optional(),
            twoFactorAuth: z.boolean().optional(),
            dueDate: z.boolean().optional(),
            comments: z.boolean().optional(),
            assignedToCard: z.boolean().optional(),
            removedFromCard: z.boolean().optional(),
            changeCardStatus: z.boolean().optional(),
            newBadge: z.boolean().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const user = await User.findOne({ walletId: input.walletId }).lean();

        if (!user) {
          throw new Error("User not found");
        }

        const updatedData = {
          name: input.name ?? user.name,
          email: input.email ?? user.email,
          image: input.image ?? user.image,
          userSettings: {
            language:
              input.userSettings?.language ?? user.userSettings?.language,
            isThemeDark:
              input.userSettings?.isThemeDark ?? user.userSettings?.isThemeDark,
            twoFactorAuth:
              input.userSettings?.twoFactorAuth ??
              user.userSettings?.twoFactorAuth,
            dueDate: input.userSettings?.dueDate ?? user.userSettings?.dueDate,
            comments:
              input.userSettings?.comments ?? user.userSettings?.comments,
            assignedToCard:
              input.userSettings?.assignedToCard ??
              user.userSettings?.assignedToCard,
            removedFromCard:
              input.userSettings?.removedFromCard ??
              user.userSettings?.removedFromCard,
            changeCardStatus:
              input.userSettings?.changeCardStatus ??
              user.userSettings?.changeCardStatus,
            newBadge:
              input.userSettings?.newBadge ?? user.userSettings?.newBadge,
          },
        };

        // Update the user with the merged data
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          updatedData,
          { new: true },
        );

        if (!updatedUser) {
          throw new Error("Failed to update user details");
        }

        return updatedUser;
      } catch (error) {
        console.error("Error updating user details:", error);
        throw new Error("Failed to update user details");
      }
    }),
  delete: protectedProcedure
    .input(z.object({ walletId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const user = await User.findOneAndDelete({ walletId: input.walletId });

        if (!user) {
          throw new Error("User not found");
        }

        return { message: "User deleted successfully" };
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
      }
    }),
} satisfies TRPCRouterRecord;
