import type { TRPCRouterRecord } from "@trpc/server";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getNFTs } from "thirdweb/extensions/erc1155";
import { z } from "zod";

import { Badge, User } from "@acme/db";

import mintNftToUser from "../../../../apps/nextjs/src/app/helpers/mintNftToUser";
import { client } from "../../../../apps/nextjs/src/app/thirdwebClient";
import { protectedProcedure } from "../trpc";

const tagToIndexMap: Record<string, number> = {
  Frontend: 3,
  Backend: 0,
  Design: 1,
  "Smart Contracts": 5,
  Integration: 6,
  Misc: 2, // User-generated tags will map to Misc
};

export const badgeRouter = {
  create: protectedProcedure
    .input(
      z.object({
        walletId: z.string(),
        receivedDate: z.date(),
        tags: z.array(z.string()), // Accept multiple tags
      }),
    )
    .mutation(async ({ input }) => {
      const { walletId, receivedDate, tags } = input;

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

        const user = await User.findOne({ walletId });
        if (!user) {
          throw new Error("User not found");
        }

        const indices = tags
          .map((tag) => tagToIndexMap[tag] ?? tagToIndexMap.Misc) // Map user-generated tags to Misc
          .filter((index) => index !== undefined);

        for (const index of indices) {
          if (index >= nfts.length) {
            continue; // Skip invalid indices
          }

          const nftMetadata = nfts[index]?.metadata;

          // Mint NFT to user
          const mintResult = await mintNftToUser({
            to: walletId,
            tokenId: index,
          });
          if (mintResult instanceof Error) {
            continue; // Skip if minting fails for this particular index
          }

          const badge = new Badge({
            walletId,
            receivedDate,
            index,
            NFTTitle: nftMetadata?.name,
          });

          await badge.save();

          user.badges?.push(badge._id);
        }

        await user.save();
        return { success: true, badges: user.badges };
      } catch (error) {
        console.error("Error creating badges: ", error);
        throw new Error("Failed to create badges.");
      }
    }),
} satisfies TRPCRouterRecord;
