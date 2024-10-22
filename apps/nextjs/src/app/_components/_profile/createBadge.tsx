"use client";

import React from "react";

import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

const CreateBadge: React.FC<{ walletID: string | undefined }> = ({
  walletID,
}) => {
  const { mutateAsync: createBadge } = api.badge.create.useMutation();

  const handleCreateBadge = async () => {
    try {
      if (!walletID) {
        console.error("Wallet ID is required");
        return;
      }

      // Call the mutation to create the badge
      const result = await createBadge({
        walletId: walletID,
        receivedDate: new Date(),
        index: 2,
      });

      if (result.success) {
        console.log("Badge created successfully!");
        toast.success("DB updated");
      } else {
        console.error("Failed to create badge");
      }
    } catch (error) {
      console.error("Error creating badge:", error);
    }
  };
  return (
    <>
      <button onClick={handleCreateBadge}>Create badge</button>
    </>
  );
};

export default CreateBadge;
