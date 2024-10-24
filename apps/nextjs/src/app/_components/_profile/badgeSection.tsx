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
        address: "0x075f84c0613a0D9C23D5457fA0752fF5C5C0F6d6",
        abi: [],
      });

      try {
        const ownedNFTs = await getOwnedNFTs({
          contract,
          start: 0,
          count: 7,
          address: walletId,
        });

        console.log(ownedNFTs);

        const images = [
          "/nfts/Backend.png",
          "/nfts/Design.png",
          "/nfts/Misc.png",
          "/nfts/Frontend.png",
          "/nfts/JSNinja.png",
          "/nfts/SmartContracts.png",
          "/nfts/Integration.png",
          "/nfts/UIUXSpec.png",
        ];

        const nftDataPromises = ownedNFTs.map(async (ownedNFT) => {
          const balance = await balanceOf({
            contract,
            owner: walletId,
            tokenId: ownedNFT.id,
          });

          console.log(balance);

          const imageIndex = ownedNFT.id.toString().split("n")[0] ?? "";
          const image = images[parseInt(imageIndex)] ?? "/nfts/placeholder.png";

          return {
            title: ownedNFT.metadata.name ?? "NFT",
            image,
            count: Number(balance.toString()),
          };
        });

        const nftData = await Promise.all(nftDataPromises);

        console.log(nftData);
        setNfts(nftData);
      } catch (error) {
        console.error("Error fetching NFTs: ", error);
      }
    };

    fetchNFTs().catch((error) => console.error("Error fetching NFTs: ", error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletId]);

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
              height: "270px",
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
