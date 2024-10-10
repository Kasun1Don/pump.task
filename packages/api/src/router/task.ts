import type { TRPCRouterRecord } from "@trpc/server";
import mongoose from "mongoose";
import { z } from "zod";

import type { NewTaskCard, ObjectIdString, TaskCard } from "@acme/validators";
import { Status, Task } from "@acme/db";
import {
  NewTaskCardSchema,
  objectIdStringSchema,
  validateObjectIdString,
} from "@acme/validators";

import { publicProcedure } from "../trpc";

export const taskRouter = {
  addTask: publicProcedure
    .input(NewTaskCardSchema)
    .mutation(async ({ input }: { input: NewTaskCard }): Promise<TaskCard> => {
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

        // Save the task, remove versionKey and convert it to type TaskCard
        const savedTask = (await newTask.save()).toObject({
          versionKey: false,
        }) as TaskCard;

        console.log("Saved task:", savedTask);

        return savedTask;
      } catch (error) {
        console.error("Error adding task:", error);
        throw new Error("Failed to add task");
      }
    }),

  deleteTask: publicProcedure
    .input(
      z.object({
        taskId: objectIdStringSchema("taskId"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const taskId: ObjectIdString = input.taskId;

        console.log("Attempting to delete task:", taskId);

        const deletedTask = await Task.findOneAndDelete({
          _id: new mongoose.Types.ObjectId(taskId),
        });

        if (!deletedTask) {
          throw new Error("Task not found");
        }

        console.log("Successfully deleted task:", deletedTask._id);
        return { msg: "Successfully deleted task", task: deletedTask };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete task");
      }
    }),

  getTaskByStatusId: publicProcedure
    .input(
      z.object({
        statusId: objectIdStringSchema("statusId"),
      }),
    )
    .query(async ({ input }) => {
      try {
        console.log(
          "Attempting to retrieve tasks by statusId:",
          String(input.statusId),
        );

        // Query the database for all the task objects related to the given statusId
        const tasks = await Task.find({ statusId: String(input.statusId) })
          .lean()
          .exec();

        // Return empty array if no task found
        if (tasks.length === 0) {
          console.log("No tasks found");
          return [];
        }

        // Convert ObjectID fields to strings and apply ObjectIdStrings branding
        const tasksWithObjectIdStrings = tasks.map((task) => ({
          ...task,
          _id: validateObjectIdString(task._id.toString(), "taskId"),
          assigneeId: task.assigneeId
            ? validateObjectIdString(String(task.assigneeId), "assigneeId")
            : undefined,
          projectId: validateObjectIdString(
            String(task.projectId),
            "projectId",
          ),
          statusId: validateObjectIdString(String(task.statusId), "statusId"),
        }));

        // Return an array of all tasks with matching statusId
        return tasksWithObjectIdStrings;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw new Error("Failed to fetch tasks");
      }
    }),

  getStatusesByProjectId: publicProcedure
    .input(
      z.object({
        projectId: objectIdStringSchema("projectId"),
      }),
    )
    .query(async ({ input }) => {
      try {
        console.log(
          "Attempting to find status columns with projectId:",
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

        // Convert ObjectID fields to strings and apply ObjectIdString branding
        const statusesWithObjectIdStrings = statuses.map((status) => ({
          ...status,
          _id: validateObjectIdString(status._id.toString(), "statusId"),
          projectId: validateObjectIdString(
            String(status.projectId),
            "projectId",
          ),
        }));

        // Return an array of all statuses with matching projectId
        return statusesWithObjectIdStrings;
      } catch (error) {
        console.error("Error fetching statuses: ", error);
        throw new Error("Failed to fetch statuses");
      }
    }),

  createStatus: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Status name is required"),
        projectId: objectIdStringSchema("Project ID"),
        order: z.number().default(0),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        // Log the incoming input to see if it's correctly passed
        console.log("Received input:", input);

        // Validate the projectId is a valid ObjectIdString
        const validatedProjectId = validateObjectIdString(
          input.projectId,
          "Project ID",
        );

        // Convert projectId from a string to a mongoose object id
        const projectId = new mongoose.Types.ObjectId(validatedProjectId);

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
          _id: validateObjectIdString(statusObject._id.toString(), "statusId"),
          projectId: validateObjectIdString(
            String(statusObject.projectId),
            "projectId",
          ),
        };
      } catch (error) {
        console.error("Error creating status:", error);
        throw new Error("Failed to create status");
      }
    }),

  deleteStatusColumn: publicProcedure
    .input(
      z.object({
        statusId: objectIdStringSchema("statusId"),
      }),
    )
    .mutation(
      async ({ input }): Promise<{ msg: string; statusId: ObjectIdString }> => {
        try {
          const statusId: ObjectIdString = input.statusId;

          console.log("Attempting to delete status column:", statusId);

          // Delete all tasks related to this status column
          const deletedTasks = await Task.deleteMany({
            statusId: new mongoose.Types.ObjectId(statusId),
          });

          // Now delete the status column
          const deletedStatus = await Status.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(statusId),
          });

          if (!deletedStatus) {
            throw new Error("Status column not found");
          }

          console.log(
            `Successfully deleted status column: ${input.statusId} and ${deletedTasks.deletedCount} tasks.`,
          );
          return {
            msg: "Successfully deleted status column",
            statusId: validateObjectIdString(deletedStatus._id.toString()),
          };
        } catch (error) {
          console.error(error);
          throw new Error("Failed to delete status column");
        }
      },
    ),
} satisfies TRPCRouterRecord;
