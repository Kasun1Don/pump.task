import { TRPCError } from "@trpc/server";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { Template } from "@acme/db";
import { z } from "zod";

export const templateRouter = createTRPCRouter({
  getAll: publicProcedure.query(async () => {
    try {
      return await Template.find({});
    } catch (error) {
      console.error("Template fetch error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch templates",
        cause: error,
      });
    }
  }),

  // get a template by id
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        const template = await Template.findById(input);
        if (!template) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Template not found",
          });
        }
        return template;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch template",
          cause: error,
        });
      }
    }),
});