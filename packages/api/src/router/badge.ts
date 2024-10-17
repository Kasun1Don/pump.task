// import { z } from "zod";
// import { publicProcedure } from "../trpc";
// import { getContract, defineChain } from "thirdweb";
// import { sepolia } from "thirdweb/chains";
// import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
// import { client } from "../../../../apps/nextjs/src/app/thirdwebClient";

// export const badgeRouter = {
//   getBadges: publicProcedure
//     .input(z.object({
//       walletId: z.string(),
//     }))
//     .query(async ({ input }) => {
//       const chain = defineChain(sepolia);
//       const contract = getContract({
//         client: client,
//         chain: chain,
//         address: "0x4AAfc2Ca021F95014274499316f8dE834f092b8f", // Your contract address
//         abi: [], // Provide ABI if needed
//       });

//       try {
//         const ownedNFTs = await getOwnedNFTs({
//           contract,
//           start: 0,
//           count: 100, // Adjust if needed
//           address: input.walletId,
//         });

//         const badgeDataPromises = ownedNFTs.map(async (nft) => {
//           const events = await contract.getEvents("Transfer", {
//             filter: { tokenId: nft.id },
//           });

//           let mintDate = null;
//           if (events.length > 0) {
//             const mintEvent = events[0];
//             const block = await mintEvent.getBlock();
//             mintDate = new Date(block.timestamp * 1000);
//           }

//           return {
//             id: nft.id,
//             title: nft.metadata.name ?? "NFT",
//             imageUrl: nft.metadata.image ?? "/badge.png",
//             mintDate,
//           };
//         });

//         const badgeData = await Promise.all(badgeDataPromises);
//         return { badges: badgeData };
//       } catch (error) {
//         console.error("Error fetching badges:", error);
//         throw new Error("Failed to fetch badges");
//       }
//     }),
// };
