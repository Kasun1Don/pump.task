import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";

import { Project, User } from "@acme/db";

import { adminProcedure, publicProcedure } from "../trpc";

export const projectRouter = {
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        isPrivate: z.boolean().default(false),
        templateId: z.string().optional(),
        members: z
          .array(
            z.object({
              user: z.string(),
              role: z.enum(["Observer", "Admin", "Owner"]),
              walletId: z.string(),
            }),
          )
          .optional(),
        status: z.array(z.string()).default([]),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const members = input.members
          ? input.members.map((member) => ({
              ...member,
              user: new mongoose.Types.ObjectId(member.user),
            }))
          : [];

        // assign a default owner if no members are provided
        if (members.length === 0) {
          members.push({
            user: new mongoose.Types.ObjectId(), // assign a default or anonymous user ID
            role: "Owner",
            walletId: "0x8De7B458D1e666006c8b993a70Df214E9C32015E",
          });
        }

        const newProject = new Project({
          name: input.name,
          isPrivate: input.isPrivate,
          templateId: input.templateId
            ? new mongoose.Types.ObjectId(input.templateId)
            : undefined,
          members: members,
          status: input.status,
        });

        const savedProject = await newProject.save();

        console.log("Project Created Successfully:", savedProject);
        return {
          id: savedProject._id.toString(),
        };
      } catch (error) {
        console.error("Error creating project:", error);
        throw new Error(
          `Failed to create project: ${(error as Error).message}`,
        );
      }
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const project = await Project.findById(input.id);
      if (project === null) {
        return { error: " not found" };
      }

      return project;
    }),
  editMembers: adminProcedure
    .input(
      z.object({
        walletId: z.string(),
        projectId: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({ walletId: input.walletId });
      if (user === null) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      await User.updateOne(
        { walletId: input.walletId },
        { $push: { projects: input.projectId } },
      );

      const newMember = {
        // user: new mongoose.Types.ObjectId(),
        role: input.role,
        walletId: user.walletId,
        name: user.name,
      };

      const project = await Project.findById(input.projectId);
      const member = project?.members.find(
        (obj) => obj.walletId === input.walletId,
      );
      if (member) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "test" });
      }

      await Project.updateOne(
        { _id: input.projectId },
        { $push: { members: newMember } },
      );
    }),
  removeMember: adminProcedure
    .input(z.object({ walletId: z.string(), projectId: z.string() }))
    .mutation(async ({ input }) => {
      await Project.updateOne(
        { _id: input.projectId },
        { $pull: { members: { walletId: input.walletId } } },
      );
      await User.updateOne(
        { walletId: input.walletId },
        { $pull: { projects: input.projectId } },
      );
    }),
} satisfies TRPCRouterRecord;