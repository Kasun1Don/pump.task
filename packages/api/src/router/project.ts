import type { TRPCRouterRecord } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";

import { Project, Status, Task } from "@acme/db";

import { publicProcedure } from "../trpc";

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
              role: z.enum(["observer", "admin", "owner"]),
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
            role: "owner",
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

        const newStatus = new Status({
          name: "Approved", // The default column
          projectId: savedProject._id,
          order: 0,
          isProtected: true, // This column is protected and cannot be removed
        });

        // Save the new status
        await newStatus.save();

        const projectObject = savedProject.toObject();

        console.log("Project Created Successfully:", projectObject);

        return projectObject;
      } catch (error) {
        console.error("Error creating project:", error);
        throw new Error(
          `Failed to create project: ${(error as Error).message}`,
        );
      }
    }),

  delete: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const projectId = new mongoose.Types.ObjectId(input.projectId);

        // Delete all associated tasks
        await Task.deleteMany({ projectId });

        // Delete all associated status columns
        await Status.deleteMany({ projectId });

        // Delete the project itself
        const deletedProject = await Project.findByIdAndDelete(projectId);

        if (!deletedProject) {
          throw new Error("Project not found");
        }

        console.log(
          "Project and associated task and statuses deleted successfully",
        );

        return { message: "Project deleted successfully" };
      } catch (error) {
        console.error("Error deleting project:", error);
        throw new Error(
          `Failed to delete project: ${(error as Error).message}`,
        );
      }
    }),
} satisfies TRPCRouterRecord;
