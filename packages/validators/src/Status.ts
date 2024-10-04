import { z } from "zod";

import { objectIdStringSchema } from "./ObjectIdString";

export const statusSchema = z.object({
  name: z.string().min(1, "Status name is required"),
  projectId: objectIdStringSchema("projectId"),
  order: z.number().min(0, "Order must be a non-negative number").optional(),
  _id: objectIdStringSchema(), //.optional(),
});
