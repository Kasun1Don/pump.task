import { z } from "zod";

import { objectIdStringSchema } from "./ObjectIdString";

// Zod schema for CustomField
const customFieldSchema = z.object({
  fieldName: z.string(),
  fieldValue: z
    .string()
    .min(1, "Field value is required")
    .max(30, "Field value must not exceed 30 characters"),
});

// Zod schema for TagClass
const TagClassSchema = z
  .object({
    defaultTags: z.array(z.string().min(1, "Tag name is required")),
    userGeneratedTags: z.array(z.string()),
  })
  // Ensure at least one tag is selected, either from default or user-generated tags
  .refine(
    (tags) => tags.defaultTags.length > 0 || tags.userGeneratedTags.length > 0,
    {
      message: "At least one tag must be selected.", // Error message if no tags are selected
      path: ["defaultTags"], // Targeting defaultTags to highlight error location
    },
  );

// Zod schema for Task
export const TaskCardSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(30, "Title cannot exceed 30 characters"),
  description: z
    .string()
    .min(10, "Description must be longer then 10 characters")
    .max(200, "Description cannot exceed 200 characters"),
  dueDate: z.date(),
  assigneeId: z
    .string()
    .max(50, "Assignee ID cannot exceed 20 characters")
    .default("unassigned")
    .optional(),
  statusId: objectIdStringSchema("statusId"),
  projectId: objectIdStringSchema("projectId"),
  order: z.number().int().nonnegative("Order must be a non-negative integer"),
  tags: TagClassSchema,
  customFields: z.array(customFieldSchema).optional(),
  _id: objectIdStringSchema("taskId"),
  isMinted: z.boolean().default(false).optional(),
});

export const NewTaskCardSchema = TaskCardSchema.omit({
  _id: true,
});

export type TaskCard = z.infer<typeof TaskCardSchema>;
export type NewTaskCard = z.infer<typeof NewTaskCardSchema>;

export const createTaskCard = (input: z.infer<typeof TaskCardSchema>) => {
  return TaskCardSchema.parse(input);
};
