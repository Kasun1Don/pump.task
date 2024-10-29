"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";

import { updateUserSettings } from "~/app/actions/handleUserUpdate";
import EditIcon from "../_task/icons/EditIcon";

export default function UpdateProfile({
  name: initialName,
  bio: initialBio,
  walletId,
  image: initialImage,
}: {
  name: string | undefined;
  bio: string | undefined;
  walletId: string;
  image: string | undefined;
}) {
  const [bio, setBio] = useState(initialBio ?? "");
  const [name, setName] = useState(initialName ?? "");

  // Temporary states
  const [tempName, setTempName] = useState(initialName ?? "");
  const [tempBio, setTempBio] = useState(initialBio ?? "");
  const [tempImage, setTempImage] = useState(initialImage ?? "blue.svg");

  useEffect(() => {
    setBio(initialBio ?? "");
    setName(initialName ?? "");
    setTempBio(initialBio ?? "");
    setTempName(initialName ?? "");
    setTempImage(initialImage ?? "blue.svg");
  }, [initialBio, initialName, initialImage]);

  // Handle Save function to update main states with temporary states
  const handleSave = async () => {
    try {
      await updateUserSettings({
        walletId,
        bio: tempBio,
        name: tempName,
        image: tempImage,
      });
      setName(tempName);
      setBio(tempBio);
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  return (
    <div className="flex gap-1 text-sm text-gray-400">
      <div>
        <div className="w-7/10 justify-start" style={{ maxWidth: "70%" }}></div>

        <h1 className="text-2xl font-bold text-white">{name}</h1>
        <p className="w-96 flex-1 p-1">{bio}</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="justify-content h-7 stroke-amber-300 p-1 hover:stroke-green-400">
            <EditIcon />
          </button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-2xl rounded-lg bg-black p-8 text-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="mb-4 text-xl font-bold">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="mb-4 w-full rounded border border-gray-400 bg-gray-200 p-2 text-black"
            placeholder="Name"
          />
          <textarea
            value={tempBio}
            onChange={(e) => setTempBio(e.target.value)}
            className="h-24 w-full rounded border border-gray-400 bg-gray-200 p-2 text-black"
            placeholder="Bio"
          />
          <div className="mb-4 flex flex-wrap justify-center gap-2 pt-10">
            {[
              "/userIcons/blue.svg",
              "/userIcons/green.svg",
              "/userIcons/orange.svg",
              "/userIcons/purple.svg",
              "/userIcons/red.svg",
              "/userIcons/teal.svg",
            ].map((icon) => (
              <Image
                key={icon}
                src={icon}
                alt="User Icon"
                width={56}
                height={56}
                className={`h-16 w-16 cursor-pointer rounded-full ${tempImage === icon ? "ring-4 ring-blue-500" : ""} max-w-full`}
                onClick={() => setTempImage(icon)}
              />
            ))}
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <DialogClose asChild></DialogClose>
            <button
              onClick={handleSave}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
