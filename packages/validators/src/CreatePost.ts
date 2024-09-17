import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const CreateUserSchema = z.object({
  name: z.string(),
  walletId: z.string(),
});
