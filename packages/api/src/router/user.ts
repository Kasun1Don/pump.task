/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { User as DBUser } from "@acme/db"; // Assuming this is your Mongoose model

import { publicProcedure } from "../trpc";

// Define the Zod schemas and types as before
const ProjectSchema = z.object({
  _id: z.string(),
  name: z.string().default(""),
  image: z.string().default(""),
});

const UserSchema = z.object({
  walletId: z.string().default(""),
  name: z.string().default(""),
  email: z.string().default(""),
  image: z.string().default(""),
  emailVerified: z.boolean().default(false),
  projects: z.array(ProjectSchema).default([]),
});

type Project = z.infer<typeof ProjectSchema>;
type User = z.infer<typeof UserSchema>;

export const userRouter = {
  all: publicProcedure.query(async () => {
    try {
      // Fetch users with their associated projects using `lean` to return plain objects
      const users: (User & { _id: string })[] = await DBUser.find()
        .populate("projects")
        .lean(); // Lean returns plain objects instead of Mongoose documents

      console.log("Fetched users:", users);

      // No need to map over projects, as they are already populated correctly
      return users.map((user) => {
        const validatedUser: User = UserSchema.parse({
          walletId: user.walletId,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
          projects: user.projects,
        });

        return validatedUser;
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }),
} satisfies TRPCRouterRecord;
