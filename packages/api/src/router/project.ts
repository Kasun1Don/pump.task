import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Project } from "@acme/db";
import { protectedProcedure } from "../trpc";

// requirements`validation with zod
const createProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    isPrivate: z.boolean().default(false),
    templateId: z.string().optional(),
});

export const projectRouter = {
    create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
        if (!ctx.session?.user?.id) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be logged in to create a project" });
}
    const newProject = new Project({
        name: input.name,
        isPrivate: input.isPrivate,
        members: [{user: ctx.session.user.id, role:"owner"}],

    })

    await newProject.save()

    return newProject;

    }),
}

