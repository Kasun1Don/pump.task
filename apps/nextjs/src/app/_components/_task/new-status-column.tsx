"use client";

import type { z } from "zod";
import React, { useState } from "react";

import { Button } from "@acme/ui/button"; // Assuming this is part of the ChadCN UI lib

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input"; // Assuming Input is part of ChadCN UI

import { statusSchema } from "@acme/validators";

import { api } from "~/trpc/react";

type StatusType = z.infer<typeof statusSchema>;

interface NewStatusColumnProps {
  projectId: string;
  onStatusCreated: (newStatus: StatusType) => void;
}

export default function NewStatusColumn({
  projectId,
  onStatusCreated,
}: NewStatusColumnProps) {
  const [newStatusName, setNewStatusName] = useState("");
  const [order, setOrder] = useState(0); // Optional: You can handle order differently based on project
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle creating a new status
  const createStatus = api.task.createStatus.useMutation({
    onSuccess: (newStatus) => {
      onStatusCreated(newStatus); // Call the callback with the new status created
      setNewStatusName("");
      setOrder(0);
      setIsDialogOpen(false); // Close the dialog after creation
    },
    onError: (error) => {
      console.error("Error creating new status: ", error.message);
    },
  });

  const handleCreateStatus = () => {
    const validationResult = statusSchema.safeParse({
      name: newStatusName,
      projectId,
      order,
    });
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message;
      if (firstError) {
        setValidationError(firstError);
      }
      return;
    }

    setValidationError(null);

    createStatus.mutate({
      name: newStatusName,
      projectId,
      order,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-transparent-[16] flex-start flex h-auto items-start bg-[#00000029] px-2 py-2 font-bold text-white hover:bg-[#27272a]"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            alignItems: "flex-start",
          }}
        >
          + New Status
        </Button>
      </DialogTrigger>

      {/* Dialog content for entering the new status */}
      <DialogContent className="rounded-lg bg-gray-900 p-6 text-white">
        <DialogHeader>
          <DialogTitle>Create New Status</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Input
            type="text"
            value={newStatusName}
            onChange={(e) => setNewStatusName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateStatus();
              }
            }}
            placeholder="Enter Status Name"
            className="mb-4 w-full rounded-md bg-[#27272A] p-2 text-white"
          />
        </div>

        {validationError && (
          <div className="mb-4 text-red-500">{validationError}</div>
        )}

        <DialogFooter>
          <Button
            onClick={handleCreateStatus}
            className="bg-zesty-green rounded px-4 py-2 text-black"
          >
            Create Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
