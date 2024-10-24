import { z } from "zod";

import { objectIdStringSchema } from "./ObjectIdString"; // Assuming you have this schema already

// Zod schema for MemberSchema
const MemberSchema = z.object({
  user: z.string().min(1, "user is required"),
  wallet: z.string().min(1, "Invalid wallet ID").optional(),
  email: z.string().min(1, "Invalid email").optional(),
  memberId: z.string().min(1, "member id is required"), //objectIdStringSchema("memberId"), // Adjust field names as needed
  name: z.string().min(1, "Member name is required"),
  role: z.string().min(1, "Role is required"),
});

// Zod schema for ProjectClass
export const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  image: z.string().optional(), // image is optional
  isPrivate: z.boolean(),
  members: z.array(MemberSchema).default([]), // Array of MemberSchema
  templateId: z.string().optional(), // templateId is optional
  _id: objectIdStringSchema("projectId"), // Project ID schema
});

// Define the schema for creating a new project, omitting the _id since it is generated automatically
export const NewProjectSchema = ProjectSchema.omit({
  _id: true,
});

// Infer the TypeScript types from the Zod schemas
export type Project = z.infer<typeof ProjectSchema>;
export type NewProject = z.infer<typeof NewProjectSchema>;

// Function to create a new project using the schema
export const createProject = (input: z.infer<typeof ProjectSchema>) => {
  return ProjectSchema.parse(input);
};
