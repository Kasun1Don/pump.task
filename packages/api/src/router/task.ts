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

import { memberProcedure, publicProcedure } from "../trpc";

export const taskRouter = {
  addTask: publicProcedure
    .input(NewTaskCardSchema)
    .mutation(async ({ input }: { input: NewTaskCard }): Promise<TaskCard> => {
      try {
        // Convert string IDs to ObjectId instances
        const statusObjectId = new mongoose.Types.ObjectId(input.statusId);
        const projectObjectId = new mongoose.Types.ObjectId(input.projectId);
        const assigneeWalletId = input.assigneeId;

        const newTask = new Task({
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          assigneeId: assigneeWalletId,
          statusId: statusObjectId,
          projectId: projectObjectId,
          order: input.order,
          tags: input.tags,
          customFields: input.customFields,
          isMinted: false,
          transactionHash: "",
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

  updateTask: publicProcedure
    .input(
      z.object({
        _id: objectIdStringSchema("taskId"), // Identify the task to update
        title: z.string().optional(), // Fields to update (all are optional)
        description: z.string().optional(),
        dueDate: z.date().optional(),
        assigneeId: z.string().optional(),
        statusId: objectIdStringSchema("statusId").optional(),
        isMinted: z.boolean().optional(),
        transactionHash: z.string().optional(),
        tags: z
          .object({
            defaultTags: z.array(z.string()).optional(),
            userGeneratedTags: z.array(z.string()).optional(),
          })
          .optional(),
        customFields: z
          .array(
            z.object({
              fieldName: z.string(),
              fieldValue: z.string(),
            }),
          )
          .optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const taskId = input._id;

        const updatedTask = await Task.findByIdAndUpdate(
          new mongoose.Types.ObjectId(taskId),
          { $set: input }, // Update only the fields provided in the input
          { new: true, runValidators: true }, // Return the updated document and validate fields
        )
          .lean()
          .exec();

        if (!updatedTask) {
          throw new Error("Task not found");
        }

        // Return the updated task
        return updatedTask;
      } catch (error) {
        console.error("Error updating task:", error);
        throw new Error("Failed to update task");
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
          assigneeId: task.assigneeId,
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

  getStatusesByProjectId: memberProcedure
    .input(
      z.object({
        projectId: objectIdStringSchema("projectId"),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        console.log(
          "Attempting to find status columns with projectId:",
          input.projectId,
        );

        if (ctx.projectId !== input.projectId) {
          throw new Error("url and active project do not match");
        }
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

  renameStatusColumn: publicProcedure
    .input(
      z.object({
        statusId: objectIdStringSchema("statusId"),
        newName: z.string().min(1, "New name is required"),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { statusId, newName } = input;

        console.log("Attempting to rename status column:", statusId);

        // Find and update the status column
        const updatedStatus = await Status.findByIdAndUpdate(
          new mongoose.Types.ObjectId(statusId),
          { $set: { name: newName } },
          { new: true, runValidators: true }, // Return the updated document and validate fields
        )
          .lean()
          .exec();

        if (!updatedStatus) {
          throw new Error("Status column not found");
        }

        console.log("Status column renamed successfully:", updatedStatus);

        // Return the updated status column
        return {
          msg: "Status column renamed successfully",
          status: {
            ...updatedStatus,
            _id: validateObjectIdString(
              updatedStatus._id.toString(),
              "statusId",
            ),
          },
        };
      } catch (error) {
        console.error("Error renaming status column:", error);
        throw new Error("Failed to rename status column");
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

          const statusColumn = await Status.findById(statusId);

          if (!statusColumn) {
            throw new Error("Status column not found");
          }

          // Prevent deletion of the "Approved" column
          if (statusColumn.name === "Approved" || statusColumn.isProtected) {
            throw new Error("The 'Approved' column cannot be deleted.");
          }

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

  // get all the tags (NFTs) associated with a project
  getProjectTags: publicProcedure
    .input(z.array(objectIdStringSchema("projectId")))
    .query(async ({ input: projectIds }) => {
      try {
        const projectTagsMap: Record<string, string[]> = {};

        // Get tags for each project
        await Promise.all(
          projectIds.map(async (projectId) => {
            const tasks = await Task.find(
              { projectId: new mongoose.Types.ObjectId(projectId) },
              { "tags.defaultTags": 1 },
            ).lean();

            const uniqueTags = [
              ...new Set(tasks.map((task) => task.tags.defaultTags).flat()),
            ];

            projectTagsMap[projectId] = uniqueTags;
          }),
        );

        return projectTagsMap;
      } catch (error) {
        console.error("Error fetching project tags:", error);
        throw new Error("Failed to fetch project tags");
      }
    }),
} satisfies TRPCRouterRecord;
