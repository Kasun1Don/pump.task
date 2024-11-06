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
  Misc: 2,
};

export const badgeRouter = {
  getbadge: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const badges = await Badge.find({ taskId: input });
    return badges;
  }),
  create: protectedProcedure
    .input(
      z.object({
        taskId: z.string().optional(),
        walletId: z.string(),
        receivedDate: z.date(),
        tags: z.array(z.string()),
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
          .map((tag) => tagToIndexMap[tag] ?? tagToIndexMap.Misc)
          .filter((index) => index !== undefined);

        for (const index of indices) {
          if (index >= nfts.length) {
            continue;
          }

          const nftMetadata = nfts[index]?.metadata;

          let mintResult;
          try {
            // Attempt to mint NFT to user
            mintResult = await mintNftToUser({
              to: walletId,
              tokenId: index,
            });

            if (mintResult instanceof Error) {
              mintResult = "Failed";
            }
          } catch (error) {
            console.error(`Minting failed for index ${index}`, error);
            mintResult = "Failed";
          }

          /*     Testing for a failure       */

          // if (index === 1 || index === 2) {
          //   console.warn(
          //     "Design tag is not supported. Setting mint result to 'Failed'.",
          //   );
          //   mintResult = "Failed";
          // }

          // Create a badge regardless of mint result
          const badge = new Badge({
            walletId,
            receivedDate,
            index,
            NFTTitle: nftMetadata?.name,
            transactionHash: mintResult,
            taskId: input.taskId,
          });

          await badge.save();

          // Add badge ID to user's badge list
          user.badges?.push(badge._id);
        }

        await user.save();
        return { success: true, badges: user.badges };
      } catch (error) {
        console.error("Error creating badges: ", error);
        throw new Error("Failed to create badges.");
      }
    }),
  retryMint: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        tag: z.string(),
        walletId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { taskId, tag, walletId } = input;

      try {
        // Map the tag to its corresponding tokenId
        const tokenId = tagToIndexMap[tag];
        if (tokenId === undefined) {
          throw new Error("Invalid or unsupported tag specified.");
        }

        // Find the badge associated with taskId, walletId, and tokenId (tag)
        const badge = await Badge.findOne({
          taskId: taskId,
          walletId: walletId,
          index: tokenId, // assuming `index` is the tokenId field in Badge
        });
        if (!badge) {
          throw new Error(
            "Badge not found for specified task, wallet, and tag.",
          );
        }

        // Attempt to mint NFT to user
        let mintResult;
        try {
          mintResult = await mintNftToUser({
            to: walletId,
            tokenId,
          });

          if (mintResult instanceof Error) {
            mintResult = "Failed";
          }
        } catch (error) {
          console.error(`Minting failed for tag ${tag}`, error);
          mintResult = "Failed";
        }

        // Update the badge with the new transaction hash or failed status
        badge.transactionHash = mintResult;
        await badge.save();

        return {
          success: mintResult !== "Failed",
          transactionHash: mintResult,
        };
      } catch (error) {
        console.error("Error retrying badge mint: ", error);
        throw new Error("Failed to retry minting badge.");
      }
    }),
} satisfies TRPCRouterRecord;
