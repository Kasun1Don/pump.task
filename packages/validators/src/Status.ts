import { z } from "zod";

import { objectIdStringSchema } from "./ObjectIdString";

// Zod schema for
export const StatusSchema = z.object({
  name: z.string().min(1, "Status name is required"),
  projectId: objectIdStringSchema("projectId"),
  order: z.number().min(0, "Order must be a non-negative number").optional(),
  _id: objectIdStringSchema(),
});

export const NewStatusSchema = StatusSchema.omit({
  _id: true,
});

export type StatusColumn = z.infer<typeof StatusSchema>;
export type NewStatusColumn = z.infer<typeof NewStatusSchema>;
