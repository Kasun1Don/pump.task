import type { TRPCRouterRecord } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";

import { Status, Task } from "@acme/db";
import { ObjectIdString, TaskCardSchema } from "@acme/validators";

import { publicProcedure } from "../trpc";

export const taskRouter = {
  addTask: publicProcedure
    .input(TaskCardSchema)
    .mutation(async ({ input }: { input: z.infer<typeof TaskCardSchema> }) => {
      try {
        // Convert string IDs to ObjectId instances
        const statusObjectId = new mongoose.Types.ObjectId(input.statusId);
        const projectObjectId = new mongoose.Types.ObjectId(input.projectId);
        const assigneeObjectId = input.assigneeId
          ? new mongoose.Types.ObjectId(input.assigneeId)
          : undefined;

        const newTask = new Task({
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          assigneeId: assigneeObjectId,
          statusId: statusObjectId,
          projectId: projectObjectId,
          order: input.order,
          tags: input.tags,
          customFields: input.customFields,
        });

        const savedTask = await newTask.save();

        console.log("Saved task:", savedTask);

        return savedTask;
      } catch (error) {
        console.error("Error adding task:", error);
        throw new Error("Failed to add task");
      }
    }),

  getStatusesByProjectId: publicProcedure
    .input(
      z.object({
        projectId: ObjectIdString("projectId"),
      }),
    )
    .query(async ({ input }) => {
      try {
        console.log(
          "Attempting to find status columns with projectID:",
          input.projectId,
        );
        // Query the database for all the status objects related to the given projectId
        const statuses = await Status.find({ projectId: input.projectId })
          .lean()
          .exec();

        // Return empty array if no status found
        if (statuses.length === 0) {
          console.log("No statuses found");
          return [];
        }

        // Convert ObjectID fields to strings
        const statusesWithStringId = statuses.map((status) => ({
          ...status,
          _id: status._id.toString(),
          projectId: String(status.projectId),
        }));

        // Return an array of all statuses with matching projectId
        return statusesWithStringId;
      } catch (error) {
        console.error("Error fetching statuses: ", error);
        throw new Error("Failed to fetch statuses");
      }
    }),

  createStatus: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Status name is required"),
        projectId: z.string().min(1, "Project ID is required"),
        order: z.number().default(0),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Log the incoming input to see if it's correctly passed
        console.log("Received input:", input);

        // Check if the projectId is a valid objectId
        if (!mongoose.Types.ObjectId.isValid(input.projectId)) {
          throw new Error("Invalid projectId");
        }

        // Convert projectId from a string to a mongoose object id
        const projectId = new mongoose.Types.ObjectId(input.projectId);

        const newStatus = new Status({
          name: input.name,
          projectId: projectId,
          order: input.order,
        });

        // Log the status object before saving
        console.log("New status object:", newStatus);

        // Save the status
        const statusObject = (await newStatus.save()).toObject();

        // log the saved status
        console.log("Saved Status:", statusObject);

        return {
          ...statusObject,
          _id: statusObject._id.toString(),
          projectId: String(statusObject.projectId),
        };
      } catch (error) {
        console.error("Error creating status:", error);
        throw new Error("Failed to create status");
      }
    }),
} satisfies TRPCRouterRecord;
