import { z } from "zod";

import { objectIdStringSchema } from "./ObjectIdString"; // Adjust the path accordingly

// Define the ProjectSchema for existing projects
export const ProjectSchema = z.object({
  _id: objectIdStringSchema("projectId"), // Project ID as a string
  name: z.string().min(1, "Project name is required"),
  image: z.string().optional(), // Optional image URL or path
  isPrivate: z.boolean(),
  templateId: z.string().optional(),
  createdAt: z.date().optional(), // Date when the project was created
  updatedAt: z.date().optional(), // Date when the project was last updated
});

// Define the NewProjectSchema for creating new projects
export const NewProjectSchema = ProjectSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

// Infer the TypeScript types from the schemas
export type Project = z.infer<typeof ProjectSchema>;
export type NewProject = z.infer<typeof NewProjectSchema>;
