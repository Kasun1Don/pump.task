// import React from "react";
// import { cookies } from "next/headers";
// import { defineChain, getContract } from "thirdweb";
// import { sepolia } from "thirdweb/chains";
// import { getContractMetadata } from "thirdweb/extensions/common";
// import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
// import { useReadContract } from "thirdweb/react";

// import { client } from "~/app/thirdwebClient";
// import { api } from "~/trpc/server";

// export default async function Badges() {
//   const walletId = cookies().get("wallet")?.value;

//   if (!walletId) {
//     console.error("Wallet ID is undefined or not found in cookies.");
//     return <div>Error: Wallet ID not found.</div>;
//   }

//   const response = await api.user.byWallet({ walletId });

//   const chain = defineChain(sepolia);

//   const contract = getContract({
//     client: client,
//     chain: chain,
//     address: "0x4AAfc2Ca021F95014274499316f8dE834f092b8f",
//     abi: [],
//   });

//   const { data: contractMetadata } = useReadContract(getContractMetadata, {
//     contract: contract,
//   });

//   const nfts = await getOwnedNFTs({
//     contract: contract,
//     start: 0,
//     count: 10,
//     address: "0xD30c5f23Fe92e39EeF42F6FFBB971C8B061976cf",
//   });
//   return null;
// }
