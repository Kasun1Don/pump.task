import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";

import type { UserClass } from "@acme/db";
import { Member, User } from "@acme/db";

import { adminProcedure, memberProcedure, publicProcedure } from "../trpc";

interface MemberWithUserData {
  role: string;
  userData: UserClass;
}

export const memberRouter = {
  create: adminProcedure
    .input(
      z.object({
        email: z.string(),
        projectId: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({ email: input.email });

      if (user) {
        if (
          user.projects?.some((project) => {
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            return project.toString() === input.projectId;
          })
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User already on project",
          });
        }
        const newMember = new Member({
          userId: user._id,
          projectId: input.projectId,
          role: input.role,
          walletId: user.walletId,
        });
        await newMember.save();
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No user with that email",
        });
      }

      await User.updateOne(
        { email: input.email },
        { $push: { projects: input.projectId } },
      );

      return {
        email: input.email,
      };
    }),
  byProjectId: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      console.log(input);
      const members = await Member.aggregate<MemberWithUserData>([
        {
          $match: { projectId: new mongoose.Types.ObjectId(input.projectId) },
        },
        {
          $lookup: {
            from: "users", // The collection to join
            localField: "userId", // Field in collection
            foreignField: "_id",
            as: "userData", // Output array with data
          },
        },
        // Unwind the arrays to get single object
        { $unwind: "$userData" },
      ]);
      return members.map((member) => ({
        role: member.role,
        userData: member.userData,
      }));
    }),
  byProjectIdProtected: memberProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      console.log(input);
      const members = await Member.aggregate<MemberWithUserData>([
        {
          $match: { projectId: new mongoose.Types.ObjectId(input.projectId) },
        },
        {
          $lookup: {
            from: "users", // The collection to join
            localField: "userId", // Field in collection
            foreignField: "_id",
            as: "userData", // Output array with data
          },
        },
        // Unwind the arrays to get single object
        { $unwind: "$userData" },
      ]);
      return members.map((member) => ({
        role: member.role,
        userData: member.userData,
      }));
    }),
  byUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const members = await Member.find({ userId: input.userId });
      return members.map((member) => ({
        projectId: member.projectId.toString(),
        role: member.role,
        walletId: member.walletId,
      }));
    }),
  delete: adminProcedure
    .input(z.object({ walletId: z.string(), projectId: z.string() }))
    .mutation(async ({ input }) => {
      await Member.deleteOne({
        walletId: input.walletId,
        projectId: input.projectId,
      });
      await User.updateOne(
        { walletId: input.walletId },
        { $pull: { projects: input.projectId } },
      );
    }),
} satisfies TRPCRouterRecord;
