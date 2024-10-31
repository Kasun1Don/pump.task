import type { TRPCRouterRecord } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";

import type { BadgeClass } from "@acme/db";
import { Badge, LoginHistory, User } from "@acme/db";

import { protectedProcedure, publicProcedure } from "../trpc";

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
        location: z.string().optional(),
        browser: z.string().optional(),
        operatingSystem: z.string().optional(),
        bio: z.string().optional(),
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
          bio: input.bio,
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
        bio: z.string().optional(),
        emailVerified: z.boolean().optional(),
        userSettings: z
          .object({
            language: z.string().optional(),
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
          bio: input.bio ?? user.bio,
          emailVerified: input.emailVerified ?? user.emailVerified,
          userSettings: {
            language:
              input.userSettings?.language ?? user.userSettings?.language,
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
  overview: publicProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ input }) => {
      const user = await User.findOne({ walletId: input.walletId })
        .populate("projects")
        .populate("badges")
        .lean();

      if (!user) {
        throw new Error("User not found");
      }

      const serializedUser = {
        ...user,
        _id: user._id.toString(),
        activeProjects: user.activeProjects?.slice(0, 3).map((project) => ({
          ...project,
          _id: project._id.toString(),
        })),
        badges: user.badges?.map((badge) => ({
          ...badge,
          _id: badge._id.toString(),
        })) as BadgeClass[],
      };

      const activeProjects = serializedUser.activeProjects?.length ?? 0;
      const totalBadges = serializedUser.badges.length;

      // Helper function to check if an object is a BadgeClass
      const isBadgeClass = (badge: unknown): badge is BadgeClass => {
        if (typeof badge !== "object" || badge === null) {
          return false;
        }

        const badgeObj = badge as Record<string, unknown>;

        return (
          "receivedDate" in badgeObj &&
          "index" in badgeObj &&
          "NFTTitle" in badgeObj &&
          (badgeObj.receivedDate instanceof Date ||
            !isNaN(Date.parse(badgeObj.receivedDate as string)))
        );
      };

      // Count badges received in the last 30 days
      const badgesInLast30Days = serializedUser.badges.filter(
        (badge) =>
          isBadgeClass(badge) &&
          new Date(badge.receivedDate) >=
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      ).length;

      // Calculate days since the last badge
      const daysSinceLastBadge = isBadgeClass(serializedUser.badges[0])
        ? Math.floor(
            (Date.now() -
              new Date(serializedUser.badges[0].receivedDate).getTime()) /
              (1000 * 3600 * 24),
          )
        : "N/A"; // Default if no badges found

      interface TopSkill {
        _id: string;
        count: number;
      }

      const topSkillAggregation: TopSkill[] = await Badge.aggregate([
        { $match: { walletId: input.walletId } }, // Filter badges by walletId
        { $group: { _id: "$NFTTitle", count: { $sum: 1 } } }, // Group by NFTTitle and count
        { $sort: { count: -1 } }, // Sort by count in descending order
        { $limit: 1 }, // Limit to the top result
      ]);

      const topSkill: string = topSkillAggregation[0]?._id ?? "N/A";

      // Return the summary data
      return {
        activeProjects,
        totalBadges,
        badgesInLast30Days,
        daysSinceLastBadge,
        topSkill,
      };
    }),
  updateActiveProjects: protectedProcedure
    .input(z.object({ walletId: z.string(), projectId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        console.log("Updating active projects");

        // Fetch the user by walletId
        const user = await User.findOne({ walletId: String(input.walletId) })
          .lean()
          .exec();

        if (!user) {
          throw new Error("User not found");
        }

        // Get the activeProjects array or initialize it if empty
        const activeProjects = (user.activeProjects ?? []).map((id) =>
          String(id),
        );

        // Remove the project if it already exists in active projects
        const projectIdStr = input.projectId.toString();
        const projectIndex = activeProjects.indexOf(projectIdStr);
        if (projectIndex !== -1) {
          activeProjects.splice(projectIndex, 1);
        }

        // Add the project to the end (making it the most recent)
        activeProjects.push(projectIdStr);

        // Ensure the array contains a maximum of 3 projects
        if (activeProjects.length > 3) {
          activeProjects.shift(); // Remove the oldest project (first item)
        }

        // Update the user using findByIdAndUpdate
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              activeProjects: activeProjects.map(
                (id) => new mongoose.Types.ObjectId(id),
              ),
            },
          },
          { new: true },
        );

        if (!updatedUser) {
          throw new Error("Failed to update active projects");
        }

        // Return the updated activeProjects
        return {
          message: "Active projects updated successfully",
          activeProjects: updatedUser.activeProjects,
        };
      } catch (error) {
        console.error("Error updating activeProjects:", error);
        throw new Error("Failed to update active projects");
      }
    }),
} satisfies TRPCRouterRecord;
