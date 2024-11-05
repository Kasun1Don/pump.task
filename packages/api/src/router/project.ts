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

        // if a template was selected, add template columns first
        if (input.templateId) {
          const template = await Template.findById(input.templateId);
          if (template) {
            // sort template columns by order first
            const sortedColumns = [...template.statusColumns].sort(
              (a, b) => a.order - b.order,
            );

            sortedColumns.forEach((column, index) => {
              statusColumns.push({
                name: column.name,
                projectId: savedProject._id,
                order: index, // ordering sequentially starting from 0
                isProtected: column.isProtected,
              });
            });
          }
        }

        // Add Approved column at the end with the last order number
        statusColumns.push({
          name: "Approved",
          projectId: savedProject._id,
          order: statusColumns.length, // puts at the end of the order sequence
          isProtected: true,
        });

        // create all status columns at once
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

        // Remove the project reference from the user
        await User.updateMany(
          { projects: projectId },
          { $pull: { projects: projectId, activeProjects: projectId } },
        );

        console.log(
          "Project, associated tasks, statuses, and user references deleted successfully",
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
