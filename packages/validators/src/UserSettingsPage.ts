import { z } from "zod";

export const languageFormSchema = z.object({
  language: z.string(),
});

export const themeFormSchema = z.object({
  theme: z.boolean().optional(),
});

export const deleteAccountFormSchema = z.object({
  deleteAccount: z.boolean().default(false).optional(),
});

export const emailFormSchema = z.object({
  changeEmail: z.string().email({ message: "Invalid email address" }),
  dueDates: z.boolean().optional(),
  comments: z.boolean().optional(),
  assignToCard: z.boolean().optional(),
  removedFromCard: z.boolean().optional(),
  changeCardStatus: z.boolean().optional(),
  newBadge: z.boolean().optional(),
});

export const securityFormSchema = z.object({
  authentication: z.boolean().default(false).optional(),
  viewLoginHistory: z.boolean().default(false).optional(),
});
