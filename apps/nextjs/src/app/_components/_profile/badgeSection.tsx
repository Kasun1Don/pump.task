"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { defineChain, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { balanceOf, getOwnedNFTs } from "thirdweb/extensions/erc1155";

import { toast } from "@acme/ui/toast";

import { client } from "~/app/thirdwebClient";
import LoadingNFTs from "./loadingNFTs";

const Badges: React.FC<{ walletId: string | undefined }> = ({ walletId }) => {
  const [nfts, setNfts] = useState<
    { image: string; title: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [url, setUrl] = useState<string>("");

  const chain = defineChain(sepolia);

  useEffect(() => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const pathname = "/projects";
    setUrl(`${protocol}//${host}${pathname}`);
  }, []);

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

          const imageIndex = ownedNFT.id.toString().split("n")[0] ?? "";
          const image = images[parseInt(imageIndex)] ?? "/nfts/placeholder.png";

          return {
            title: ownedNFT.metadata.name ?? "NFT",
            image,
            count: Number(balance.toString()),
          };
        });

        const nftData = await Promise.all(nftDataPromises);

        setNfts(nftData);
      } catch {
        toast.error("Error fetching Badges:: ");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs().catch(() => toast.error("Error fetching NFTs: "));
  }, [chain, walletId]);

  if (!walletId) {
    return <div>Error: Wallet ID not found.</div>;
  }

  if (loading) {
    return (
      <div
        className="flex w-full items-center justify-center"
        style={{ height: "400px" }}
      >
        <LoadingNFTs />
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <h1 className="text-3xl font-semibold">Badges Earned</h1>
        <p className="mb-4 text-sm text-gray-400">
          Complete tasks to earn badges. These badges represent your onchain
          resume, they’re minted as NFTs on Sepolia Testnet using Thirdweb.
        </p>
        <p className="mb-4 text-sm">
          You currently do not have any earned badges in your wallet.
        </p>
        <div className="mt-auto">
          <p className="mb-4 text-sm">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zesty-green"
            >
              Complete tasks in a project to earn badges.
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold">Badges Earned</h1>
      <p className="mb-4 text-sm text-gray-400">
        Complete tasks to earn badges. These badges represent your onchain
        resume, they’re minted as NFTs on Sepolia Testnet using Thirdweb.
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
              height: "225px",
            }}
          >
            <div className="relative">
              <Image
                src={nft.image}
                alt="NFT Media"
                width={150}
                height={130}
                onError={() => toast.error(`Image not found: ${nft.image}`)}
              />
            </div>
            <div className="relative border-t border-gray-700 bg-black bg-opacity-50 p-2">
              <h3 className="inline-block text-lg font-bold">{nft.title}</h3>
              <p className="absolute right-0 top-0 mr-2 mt-2 text-xs">
                x{nft.count}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Badges;
