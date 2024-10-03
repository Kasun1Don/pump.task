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

  console.log("Check if the code is updating:");

  return (
    <div className="text-sm text-gray-400">
      {isEditing ? (
        <input
          type="text"
          value={bio}
          onChange={(e) => handleBioChange(e.target.value)}
          className="rounded border p-1 text-sm text-gray-600"
        />
      ) : (
        <p onClick={() => setIsEditing(true)} className="text-sm text-gray-400">
          {bio}
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
