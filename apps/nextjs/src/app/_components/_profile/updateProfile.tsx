"use client";

import React, { useState } from "react";
import Image from "next/image";

import { updateUserSettings } from "~/app/actions/handleUserUpdate";

export default function UpdateProfile({
  name: initialName,
  bio: initialBio,
  walletId,
}: {
  name: string | undefined;
  bio: string | undefined;
  walletId: string;
}) {
  const [bio, setBio] = useState(initialBio ?? "");
  const [name, setName] = useState(initialName ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  const handleBioChange = (newBio: string) => {
    setBio(newBio);
  };

  const handleSave = async () => {
    try {
      await updateUserSettings({ walletId, bio, name });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  return (
    <div className="flex gap-1 text-sm text-gray-400">
      {isEditing ? (
        <div className="w-7/10 justify-start gap-2" style={{ maxWidth: "70%" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-32 rounded border bg-white p-1 text-black"
          />
          <textarea
            value={bio}
            onChange={(e) => handleBioChange(e.target.value)}
            className="h-32 w-96 rounded border bg-white p-1 text-black"
          />
        </div>
      ) : (
        <div>
          <div
            className="w-7/10 justify-start"
            style={{ maxWidth: "70%" }}
          ></div>
          <h1 className="text-2xl font-bold text-white">{name}</h1>
          <p className="w-96 flex-1 p-1">{bio}</p>
        </div>
      )}
      <button
        onClick={async () => {
          if (isEditing) {
            await handleSave();
          } else {
            setIsEditing(true);
          }
        }}
        className="justify-content h-7 p-1"
      >
        {isEditing ? (
          <span className="inline-block justify-center rounded border bg-green-600 p-1 text-sm text-white">
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
