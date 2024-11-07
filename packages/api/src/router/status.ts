import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { Status } from "@acme/db";

import { memberProcedure, publicProcedure } from "../trpc";

export const statusRouter = {
  // Query to get statuses by project ID, ordered by 'order' field
  getStatusesByProjectId: memberProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { projectId } = input;

      // Check nessessary to handle errors when sending links
      if (input.projectId !== ctx.projectId) {
        throw new Error("Unauthorized");
      }

      // Fetch statuses ordered by the 'order' field in ascending order
      const statuses = await Status.find({ projectId }).sort({ order: 1 });
      return statuses;
    }),
  updateOrder: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        statusIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const updateOperations = input.statusIds.map((statusId, index) =>
          Status.findByIdAndUpdate(statusId, { order: index }),
        );

        await Promise.all(updateOperations);

        return { success: true };
      } catch (error) {
        console.error("Error updating status order:", error);
        throw new Error(
          `Failed to update status order: ${(error as Error).message}`,
        );
      }
    }),
} satisfies TRPCRouterRecord;

export default statusRouter;
