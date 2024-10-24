"use client";

import React from "react";

import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

const CreateBadge: React.FC<{ walletID: string | undefined }> = ({
  walletID,
}) => {
  const { mutateAsync: createBadge } = api.badge.create.useMutation();

  const nfts = [
    "Backend",
    "Design",
    "Misc",
    "Frontend",
    "JSNinja",
    "SmartContracts",
    "Integration",
    "UIUXSpec",
  ];

  const getIndex = (nft: string) => {
    return nfts.indexOf(nft);
  };

  const handleCreateBadge = async (nft: string) => {
    try {
      if (!walletID) {
        console.error("Wallet ID is required");
        return;
      }

      const index = getIndex(nft);

      if (index === -1) {
        console.error("NFT not found");
        return;
      }

      // mutation call to create the badge
      const result = await createBadge({
        walletId: walletID,
        receivedDate: new Date(),
        index: index,
      });

      if (result.success) {
        console.log("Badge created successfully!");
        toast.success("Badge created successfully!");
      } else {
        console.error("Failed to create badge");
        toast.error("Failed to create badge");
      }
    } catch (error) {
      console.error("Error creating badge:", error);
      toast.error("Error creating badge");
    }
  };

  const handleButtonClick = (nft: string) => {
    return () => {
      void handleCreateBadge(nft);
    };
  };

  return (
    <>
      <button onClick={handleButtonClick("Backend")}>
        Create backend badge
      </button>
    </>
  );
};

export default CreateBadge;
