"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { defineChain, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { balanceOf, getOwnedNFTs } from "thirdweb/extensions/erc1155";

import { client } from "~/app/thirdwebClient";

const Badges: React.FC<{ walletId: string | undefined }> = ({ walletId }) => {
  const [nfts, setNfts] = useState<
    { image: string; title: string; count: number }[]
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

        const images = [
          "/nfts/Frontend.png",
          "/nfts/Backend.png",
          "/nfts/Design.png",
          "/nfts/SmartContracts.png",
          "/nfts/Integration.png",
          "/nfts/JSNinja.png",
          "/nfts/Misc.png",
        ];

        const nftDataPromises = ownedNFTs.map(async (nft, index) => {
          const balance = await balanceOf({
            contract,
            owner: walletId,
            tokenId: nft.id,
          });

          return {
            title: nft.metadata.name ?? "NFT",
            image: images[index] ?? "",
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
    <div>
      <h1 className="text-3xl font-semibold">Badges Earned</h1>
      <p className="mb-4 text-sm text-gray-400">
        Complete tasks to earn badges. These badges represent your onchain
        resume, they’re minted as NFTs on Base.
      </p>
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
            <div className="relative">
              <Image
                src={nft.image}
                alt="NFT Media"
                width={150}
                height={130}
                onError={() => console.log(`Image not found: ${nft.image}`)}
              />
            </div>
            <div className="border-t border-gray-700 bg-black bg-opacity-50 p-2">
              <h3 className="text-lg font-bold">{nft.title}</h3>
              <p className="text-right text-xs">x{nft.count}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Badges;
