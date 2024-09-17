import type { TRPCRouterRecord } from "@trpc/server";

import { User } from "@acme/db";

import { publicProcedure } from "../trpc";

export const userRouter = {
  all: publicProcedure.query(async (userContext) => {
    console.log(userContext);

    try {
      // Fetch and lean the data
      const users = await User.find()
        .populate({
          path: "projects",
          model: "ProjectClass",
        })
        .lean();

      // Manually convert ObjectId to string because TRPC doesn't like to work with Mongoose ObjectId's :(
      const serializedUsers = users.map((user) => ({
        ...user,
        _id: user._id.toString(),
        projects: user.projects?.map((project) => ({
          ...project,
          _id: project._id.toString(),
        })),
      }));

      return serializedUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }),
} satisfies TRPCRouterRecord;
