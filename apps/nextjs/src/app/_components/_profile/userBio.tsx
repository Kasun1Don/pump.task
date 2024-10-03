/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import React, { useState } from "react";
import Image from "next/image";

import { api } from "~/trpc/react";

export default function UpdateBio({
  bio,
  walletId,
}: {
  bio: string | undefined;
  walletId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState(bio);

  console.log("Check if the code is updating:");

  const { mutate, isLoading } = (api.user as any).updateBio.useMutation();

  const handleSave = async () => {
    if (isLoading) return;
    try {
      await mutate({
        walletId: walletId,
        bio: newBio,
      });
    } catch (error) {
      console.error("Error updating bio:", error);
    }
    setIsEditing(false);
  };

  return (
    <div className="text-sm text-gray-400">
      {isEditing ? (
        <input
          type="text"
          value={newBio}
          onChange={(e) => setNewBio(e.target.value)}
          className="rounded border p-1 text-sm text-gray-600"
        />
      ) : (
        <p onClick={() => setIsEditing(true)} className="text-sm text-gray-400">
          {newBio ?? "Add your bio"}
        </p>
      )}

      <button onClick={() => setIsEditing(!isEditing)} className="p-1">
        <Image src="/edit.png" alt="Copy text button" width={40} height={40} />
      </button>

      {isEditing && (
        <button onClick={handleSave} className="text-sm text-blue-500">
          Save
        </button>
      )}
    </div>
  );
}
