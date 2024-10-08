"use client";

import React, { useState } from "react";
import Image from "next/image";

import { updateUserSettings } from "~/app/actions/handleUserUpdate";

export default function UpdateBio({
  bio: initialBio,
  walletId,
}: {
  bio: string | undefined;
  walletId: string;
}) {
  const [bio, setBio] = useState(initialBio ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const handleBioChange = (newBio: string) => {
    setBio(newBio);
  };

  const handleSave = async () => {
    try {
      await updateUserSettings({ walletId, bio });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  return (
    <div className="flex justify-between text-sm text-gray-400">
      {isEditing ? (
        <textarea
          value={bio}
          onChange={(e) => handleBioChange(e.target.value)}
          className="h-32 w-96 resize rounded border bg-white p-1 text-black"
        />
      ) : (
        <p className="w-96 flex-1 p-1">{bio}</p>
      )}
      <button
        onClick={async () => {
          if (isEditing) {
            await handleSave();
          } else {
            setIsEditing(true);
          }
        }}
        className="ml-0.5 p-1"
      >
        {isEditing ? (
          <span className="ml-2 rounded border bg-green-600 p-1 text-sm text-white">
            Save
          </span>
        ) : (
          <Image
            src="/profile/edit.png"
            alt="Edit button"
            width={25}
            height={25}
          />
        )}
      </button>
    </div>
  );
}
