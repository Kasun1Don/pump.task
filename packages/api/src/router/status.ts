import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { Status } from "@acme/db";

import { publicProcedure } from "../trpc";

export const statusRouter = {
  // Query to get statuses by project ID, ordered by 'order' field
  getStatusesByProjectId: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { projectId } = input;

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
        const { statusIds } = input;
        //find the 'Approved' column
        const statuses = await Status.find({ _id: { $in: statusIds } });
        const approvedColumn = statuses.find(
          (status) => status.name === "Approved" && status.isProtected,
        );
        //remove the 'Approved' column ID from the statusIds array
        const orderedStatusIds = statusIds.filter(
          (id) => id !== approvedColumn?._id.toString(),
        );
        //append 'Approved' column ID to the end
        if (approvedColumn) {
          orderedStatusIds.push(approvedColumn._id.toString());
        }
        //update order for each status column
        const updateOperations = orderedStatusIds.map((statusId, index) =>
          Status.findByIdAndUpdate(statusId, { order: index }),
        );
        await Promise.all(updateOperations);
        return { success: true };
      } catch (error) {
        console.error("Error updating status order:", error);
      }
    }),
} satisfies TRPCRouterRecord;

export default statusRouter;
