import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string(),
  walletId: z.string(),
});
