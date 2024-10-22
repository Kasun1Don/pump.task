import type { TRPCRouterRecord } from "@trpc/server";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { z } from "zod";

import { Badge } from "@acme/db";

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
      const { walletId, receivedDate } = input;

      const contract = getContract({
        client: client,
        chain: sepolia,
        address: "0x075f84c0613a0D9C23D5457fA0752fF5C5C0F6d6",
        abi: [],
      });

      try {
        const ownedNFTs = await getOwnedNFTs({
          contract,
          start: 0,
          count: 6,
          address: walletId,
        });

        const nftDataPromises = ownedNFTs.map(async (nft, index) => {
          const badge = new Badge({
            index,
            receivedDate,
          });

          await badge.save();
          return { success: true, badge };
        });

        await Promise.all(nftDataPromises);
        return { success: true };
      } catch (error) {
        console.error("Error fetching NFTs or creating badge: ", error);
        throw new Error("Failed to create badge.");
      }
    }),
} satisfies TRPCRouterRecord;
