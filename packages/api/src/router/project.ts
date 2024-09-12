import type { TRPCRouterRecord } from "@trpc/server"; //ensure that the router object conforms to the expected structure for a TRPC router
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Project, User } from "@acme/db";

import { protectedProcedure } from "../trpc";

// requirements`validation with zod
const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  isPrivate: z.boolean().default(false),
  templateId: z.string().optional(),
});

export const projectRouter: TRPCRouterRecord = {
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a project",
        });
      }
      const newProject = new Project({
        name: input.name,
        isPrivate: input.isPrivate,
        members: [{ user: ctx.session.user.id, role: "owner" }],
        status: [], // start with empty status array
      });

      await newProject.save();

      // update the user document's projects array in MongoDB
      await User.findByIdAndUpdate(ctx.session.user.id, {
        $push: { projects: newProject._id },
      });

      return newProject;
    }),
} satisfies TRPCRouterRecord;
