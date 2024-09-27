import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { LoginHistory, User } from "@acme/db";

import { publicProcedure } from "../trpc";

export const loginHistoryRouter = {
  loginHistories: publicProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ input }) => {
      try {
        const user = await User.findOne({ walletId: input.walletId }).lean();

        if (!user) {
          throw new Error("User not found");
        }

        const loginHistories = await LoginHistory.find({
          _id: { $in: user.loginHistories },
        })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();

        const serializedUser = {
          ...user,
          _id: user._id.toString(),
          loginHistories: loginHistories.map((history) => ({
            ...history,
            _id: history._id.toString(),
          })),
        };

        return serializedUser;
      } catch (error) {
        console.error("Error fetching login histories:", error);
        throw new Error("Failed to fetch login histories");
      }
    }),
} satisfies TRPCRouterRecord;
