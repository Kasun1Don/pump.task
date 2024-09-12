import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { Task } from "@acme/db";

import { publicProcedure } from "../trpc";

export const taskRouter = {
  addTask: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        dueDate: z.string(),
        status: z.enum(["To Do", "In Progress", "In QA", "Done", "Approved"]),
        assignee: z.string().min(1, "Assignee is required"),
        tags: z.object({
          defaultTags: z.array(z.string()).optional(),
          userGeneratedTags: z.array(z.string()).optional(),
        }),
        customFields: z
          .array(
            z.object({
              fieldName: z.string(),
              fieldValue: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const newTask = new Task({
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          status: input.status,
          assignee: input.assignee,
          tags: input.tags,
          customFields: input.customFields,
        });

        const savedTask = await newTask.save();

        return savedTask;
      } catch (error) {
        console.error("Error adding task:", error);
        throw new Error("Failed to add task");
      }
    }),
} satisfies TRPCRouterRecord;
