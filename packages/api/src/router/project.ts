import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import mongoose from "mongoose";

import { Project } from "@acme/db";

import { publicProcedure } from "../trpc";

export const projectRouter = {
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        isPrivate: z.boolean().default(false),
        templateId: z.string().optional(),
        members: z.array(
          z.object({
            user: z.string(),
            role: z.enum(["observer", "admin", "owner"]),
          })
        ).default([]),
        status: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const currentUserId = ctx.session?.user.id;
        if (!currentUserId) {
          throw new Error("User not authenticated");
        }

        const members = input.members.map(member => ({
          ...member,
          user: member.user === "currentUser" ? new mongoose.Types.ObjectId(currentUserId) : new mongoose.Types.ObjectId(member.user),
        }));

        if (members.length === 0) {
          members.push({
            user: new mongoose.Types.ObjectId(currentUserId),
            role: "owner",
          });
        }

        const newProject = new Project({
          name: input.name,
          isPrivate: input.isPrivate,
          members: members,
          status: input.status, // use input status array
        });

        const savedProject = await newProject.save();

        return savedProject;
      } catch (error) {
        console.error("Error creating project:", error);
        throw new Error(`Failed to create project`);
      }
    }),
} satisfies TRPCRouterRecord;
