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
          <button className="justify-content h-7 stroke-gray-400 p-1 hover:stroke-amber-300">
            <EditIcon />
          </button>
        </DialogTrigger>

        <DialogContent className="flex max-h-[90vh] max-w-[800px] flex-col overflow-auto rounded-lg bg-black p-6 text-white">
          <DialogHeader className="flex w-full items-start justify-center">
            <DialogTitle className="text-2xl font-semibold">
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <h3 className="text-xs font-semibold text-slate-400">Update Name</h3>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your updated name..."
          />
          <h3 className="text-xs font-semibold text-slate-400">
            Update Your Bio
          </h3>
          <textarea
            value={tempBio}
            onChange={(e) => setTempBio(e.target.value)}
            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter your updated bio..."
          />
          <h3 className="flex flex-wrap justify-center pt-10 text-xs font-semibold text-slate-400">
            Update Profile Image
          </h3>
          <div className="mb-4 flex flex-wrap justify-center gap-2 pt-4">
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
                className={`h-16 w-16 cursor-pointer rounded-full ${tempImage === icon ? "ring-zesty-green ring-4" : ""} max-w-full`}
                onClick={() => setTempImage(icon)}
              />
            ))}
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <DialogClose asChild></DialogClose>
            <button
              onClick={handleSave}
              className="bg-zesty-green rounded px-4 py-2 text-black"
            >
              Update Profile
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
