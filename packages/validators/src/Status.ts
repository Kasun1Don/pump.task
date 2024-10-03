import { z } from "zod";

import { ObjectIdString } from "./ObjectIdString";

export const statusSchema = z.object({
  name: z.string().min(1, "Status name is required"),
  projectId: ObjectIdString("projectId"),
  order: z.number().min(0, "Order must be a non-negative number").optional(),
  _id: ObjectIdString().optional(),
});
