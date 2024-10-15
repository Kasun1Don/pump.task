"use client";

import React, { useEffect, useState } from "react";
import { defineChain, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { balanceOf, getOwnedNFTs } from "thirdweb/extensions/erc1155";

import { client } from "~/app/thirdwebClient";

const Badges: React.FC<{ walletId: string | undefined }> = ({ walletId }) => {
  const [nfts, setNfts] = useState<
    { imageUrl: string; title: string; count: number }[]
  >([]);

  const chain = defineChain(sepolia);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!walletId) return;

      const contract = getContract({
        client: client,
        chain: chain,
        address: "0x4AAfc2Ca021F95014274499316f8dE834f092b8f",
        abi: [],
      });

      try {
        const ownedNFTs = await getOwnedNFTs({
          contract,
          start: 0,
          count: 10,
          address: walletId,
        });

        const nftDataPromises = ownedNFTs.map(async (nft) => {
          const balance = await balanceOf({
            contract,
            owner: walletId,
            tokenId: nft.id,
          });

          return {
            title: nft.metadata.name ?? "NFT",
            imageUrl: nft.metadata.image ?? "/badge.png",
            count: Number(balance.toString()),
          };
        });

        const nftData = await Promise.all(nftDataPromises);
        setNfts(nftData);
      } catch (error) {
        console.error("Error fetching NFTs: ", error);
      }
    };

    fetchNFTs().catch((error) => console.error("Error fetching NFTs: ", error));
  }, [chain, walletId]);

  if (!walletId) {
    return <div>Error: Wallet ID not found.</div>;
  }

  if (nfts.length === 0) {
    return <div>No NFTs found.</div>;
  }
  return (
    <div className="flex flex-wrap gap-4">
      {nfts.map((nft, index) => (
        <a
          key={index}
          href="https://basescan.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="m-1 block overflow-hidden rounded-lg border border-gray-700 shadow-lg transition-transform hover:border-gray-300"
          style={{
            width: "150px",
            height: "216px",
          }}
        >
          <div
            className="relative"
            style={{
              height: "65%",
              backgroundImage: `url(${nft.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="border-t border-gray-700 bg-black bg-opacity-50 p-2">
            <h3 className="text-lg font-bold">{nft.title}</h3>
            <p className="text-right text-xs">x{nft.count}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default Badges;
