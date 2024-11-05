"use client";

import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

// Function to create a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createBadge = async ({
  taskId,
  walletID,
  tags,
}: {
  taskId: string;
  walletID: string | undefined;
  tags: string[];
}) => {
  const { mutateAsync: createBadge } = api.badge.create.useMutation();

  try {
    if (!walletID) {
      console.error("Wallet ID is required");
      toast.error("Wallet ID is required");
      return;
    }

    if (tags.length === 0) {
      console.error("At least one tag is required");
      toast.error("At least one tag is required");
      return;
    }

    // Iterate through tags and create each badge one by one, waiting for each to complete
    for (const tag of tags) {
      const result = await createBadge({
        taskId: taskId,
        walletId: walletID,
        receivedDate: new Date(),
        tags: [tag],
      });

      if (result.success) {
        toast.success(`Badge created successfully for tag: ${tag}`);
      } else {
        console.error(`Failed to create badge for tag: ${tag}`);
        toast.error(`Failed to create badge for tag: ${tag}`);
        return; // Stop further processing if one badge creation fails
      }

      // Add a delay between badge creations to avoid transaction collisions
      await delay(10000); // 10-second delay
    }
  } catch (error) {
    console.error("Error creating badges:", error);
    toast.error("Error creating badges");
  }
};
