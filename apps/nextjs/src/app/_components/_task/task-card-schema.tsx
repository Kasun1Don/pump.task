// import { z } from "zod";

// // Define the schema for task card validation using Zod
// export const taskCardSchema = z.object({
//   // Title: Must be a non-empty string
//   title: z.string().min(1, "Title is required"),

//   // Description: Must be a non-empty string
//   description: z.string().min(1, "Description is required"),

//   // Due Date: Must be a valid Date object
//   dueDate: z.date({ required_error: "Due date is required" }),

//   // Status: Must be one of the predefined values from the enum
//   // (NEEDS TO BE CHANGE TO RETRIEVE CURRENT STATUS COLUMNS)
//   status: z.enum(["To Do", "In Progress", "In QA", "Done", "Approved"]),

//   // Assignee: Must be a non-empty string
//   assignee: z.string().min(1, "Assignee is required"),

//   // Tags: Contains two arrays, one for default tags and another for user-generated tags
//   tags: z
//     .object({
//       defaultTags: z.array(z.string()),
//       userGeneratedTags: z.array(z.string()),
//     })
//     // Ensure at least one tag is selected, either from default or user-generated tags
//     .refine(
//       (tags) =>
//         tags.defaultTags.length > 0 || tags.userGeneratedTags.length > 0,
//       {
//         message: "At least one tag must be selected.", // Error message if no tags are selected
//         path: ["defaultTags"], // Targeting defaultTags to highlight error location
//       },
//     ),

//   // Custom Fields: An array of objects, each having a field name and field value (both required)
//   customFields: z.array(
//     z.object({
//       fieldName: z.string().min(1, "Field name is required"),
//       fieldValue: z.string().min(1, "Field value is required"),
//     }),
//   ),
// });
