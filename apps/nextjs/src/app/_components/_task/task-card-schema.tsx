import { z } from "zod";

export const taskCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z
    .string({ required_error: "Due date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Due date is required",
    }),
  status: z.enum(["To Do", "In Progress", "In QA", "Done", "Approved"]),
  assignee: z.string().min(1, "Assignee is required"),
  tags: z
    .object({
      defaultTags: z.array(z.string()),
      userGeneratedTags: z.array(z.string()),
    })
    .refine(
      (tags) =>
        tags.defaultTags.length > 0 || tags.userGeneratedTags.length > 0,
      {
        message: "At least one tag must be selected.",
        path: ["defaultTags"], // This targets the defaultTags array for the error message
      },
    ),
  customFields: z.array(
    z.object({
      fieldName: z.string().min(1, "Field name is required"),
      fieldValue: z.string().min(1, "Field value is required"),
    }),
  ),
});
