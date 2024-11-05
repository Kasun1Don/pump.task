import type { TRPCRouterRecord } from "@trpc/server";
import mongoose, { Types } from "mongoose";
import { z } from "zod";

import { Member, Project, Status, Task, Template, User } from "@acme/db";

import { publicProcedure } from "../trpc";

export const projectRouter = {
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        isPrivate: z.boolean().default(false),
        templateId: z.string().optional(),
        description: z.string().optional(),
        members: z.object({
          user: z.string(),
          role: z.enum(["Observer", "Admin", "Owner"]),
        }),
        status: z.array(z.string()).default([]),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const newProject = new Project({
          name: input.name,
          isPrivate: input.isPrivate,
          description: input.description,
          templateId: input.templateId
            ? new Types.ObjectId(input.templateId)
            : undefined,
          status: input.status,
        });

        const savedProject = await newProject.save();

        // Create all status columns in order
        const statusColumns = [];

        // Always add Approved as the first column
        statusColumns.push({
          name: "Approved",
          projectId: savedProject._id,
          order: 0,
          isProtected: true, // This column is protected and cannot be removed
        });

        // if a template was selected, create additional status columns
        if (input.templateId) {
          const template = await Template.findById(input.templateId);
          if (template) {
            template.statusColumns.forEach((column, index) => {
              // loop through each column, adding 1 to the order
              statusColumns.push({
                name: column.name,
                projectId: savedProject._id,
                order: index + 1, // ordering starting after Approved
                isProtected: column.isProtected,
              });
            });
          }
        }

        // create all status columns at once to maintain order
        await Status.insertMany(statusColumns);

        const user = await User.findOne({ walletId: input.members.user });
        if (user) {
          const newMember = new Member({
            userId: user._id,
            projectId: savedProject._id,
            role: input.members.role,
            walletId: user.walletId,
          });
          await newMember.save();
          await User.updateOne(
            { email: user.email },
            { $push: { projects: savedProject._id } },
          );
        } else {
          throw new Error(`No user found`);
        }

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
      const project = await Project.findById(input.id).lean().exec();

      if (project === null) {
        return { error: " not found" };
      }

      return project;
    }),
  getAll: publicProcedure
    .input(
      z.object({
        showOwnedOnly: z.boolean().optional(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        let query = {};
        if (input.showOwnedOnly && input.userId) {
          query = {
            members: { $elemMatch: { user: input.userId, role: "owner" } },
          };
        }
        const projects = await Project.find(query).lean();
        return projects;
      } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error(
          `Failed to fetch projects: ${(error as Error).message}`,
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

  updateName: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const updatedProject = await Project.findByIdAndUpdate(
        input.projectId,
        {
          name: input.name,
          ...(input.description !== undefined && {
            description: input.description,
          }),
        },
        { new: true },
      );

      if (!updatedProject) {
        throw new Error("Project not found");
      }

      return updatedProject;
    }),
} satisfies TRPCRouterRecord;
