import type { TRPCRouterRecord } from "@trpc/server";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getNFTs } from "thirdweb/extensions/erc1155";
import { z } from "zod";

import { Badge, User } from "@acme/db";

import { client } from "../../../../apps/nextjs/src/app/thirdwebClient";
import { protectedProcedure } from "../trpc";

export const badgeRouter = {
  create: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
        receivedDate: z.date(),
        index: z.number().min(0).max(6),
      }),
    )
    .mutation(async ({ input }) => {
      const { walletId, receivedDate, index } = input;
      try {
        const contract = getContract({
          client: client,
          chain: sepolia,
          address: "0x075f84c0613a0D9C23D5457fA0752fF5C5C0F6d6",
        });

        const nfts = await getNFTs({
          contract,
          start: 0,
          count: 8,
        });

        if (index >= nfts.length) {
          throw new Error("Index out of range");
        }
        console.log(`-----NFT metadata found for index ${index}`);
        const nftMetadata = nfts[index]?.metadata;

        console.log(`----Finding user with wallet ID: ${walletId}`);
        const user = await User.findOne({ walletId });
        if (!user) {
          throw new Error("User not found");
        }

        console.log(`-----Creating badge...`);
        const badge = new Badge({
          walletId,
          receivedDate,
          index,
          NFTTitle: nftMetadata?.name,
        });

        await badge.save();
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`-----Badge saved successfully: ${badge._id}`);

        user.badges?.push(badge._id);
        await user.save();

        return { success: true, badge: {} };
      } catch (error) {
        console.error("Error fetching NFTs or creating badge: ", error);
        throw new Error("Failed to create badge.");
      }
    }),
} satisfies TRPCRouterRecord;
