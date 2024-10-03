import { z } from "zod";

import { ObjectIdString } from "./ObjectIdString";

// Zod schema for CustomField
const customFieldSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  fieldValue: z.string().min(1, "Field value is required"),
});

// Zod schema for TagClass
const TagClassSchema = z.object({
  defaultTags: z.array(z.string()).min(1, "At least one default"),
  userGeneratedTags: z.array(z.string()).optional(),
});

// Zod schema for Task input
export const TaskCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date(),
  assigneeId: ObjectIdString("assigneeId").optional(),
  statusId: ObjectIdString("statusId"),
  projectId: ObjectIdString("projectId"),
  order: z.number().int().nonnegative("Order must be a non-negative integer"),
  tags: TagClassSchema,
  customFields: z.array(customFieldSchema).optional(),
});
