import { z } from "zod";

import { objectIdStringSchema } from "./ObjectIdString";

// Zod schema for CustomField
const customFieldSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  fieldValue: z.string().min(1, "Field value is required"),
});

// Zod schema for TagClass
const TagClassSchema = z
  .object({
    defaultTags: z.array(z.string()),
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

// Tags: Contains two arrays, one for default tags and another for user-generated tags
// tags: z
// .object({
//   defaultTags: z.array(z.string()),
//   userGeneratedTags: z.array(z.string()),
// })
// // Ensure at least one tag is selected, either from default or user-generated tags
// .refine(
//   (tags) =>
//     tags.defaultTags.length > 0 || tags.userGeneratedTags.length > 0,
//   {
//     message: "At least one tag must be selected.", // Error message if no tags are selected
//     path: ["defaultTags"], // Targeting defaultTags to highlight error location
//   },
// ),

// Zod schema for Task input
export const TaskCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.date(),
  assigneeId: objectIdStringSchema("assigneeId").optional(),
  statusId: objectIdStringSchema("statusId"),
  projectId: objectIdStringSchema("projectId"),
  order: z.number().int().nonnegative("Order must be a non-negative integer"),
  tags: TagClassSchema,
  customFields: z.array(customFieldSchema).optional(),
});
