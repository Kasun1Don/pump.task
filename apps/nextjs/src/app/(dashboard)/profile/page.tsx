import React from "react";
import { cookies } from "next/headers";
import Image from "next/image";

import type { UserClass } from "@acme/db";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/server";
import BadgeSection from "../../_components/_profile/badgeSection";
import CopyButton from "../../_components/_profile/copyButton";
import UpdateProfile from "../../_components/_profile/updateProfile";
import UserOverview from "../../_components/_profile/userOverview";

export default async function UserProfile() {
  const walletId = cookies().get("wallet")?.value;

  if (!walletId) {
    toast.error("Wallet ID is undefined or not found.");
    return;
  }

  const response = await api.user.byWallet({ walletId });

  const userData: UserClass | null = response as UserClass;

  return (
    <div className="relative">
      <section
        className="absolute inset-0 top-[3.9rem] min-h-screen w-full border-t-2"
        style={{
          backgroundColor: "#050505",
          pointerEvents: "none",
          borderColor: "rgba(83, 83, 83, 0.5)",
        }}
      ></section>

      <div className="relative mx-52 mt-[10rem]">
        <Image
          src={userData.image ?? "/labrysGreenSphere.png"}
          alt="User Profile Icon"
          width={120}
          height={120}
          className="mb-4"
        />

        <div className="relative mb-4 flex h-auto justify-between gap-2">
          <UpdateProfile
            bio={userData.bio}
            walletId={walletId}
            name={userData.name}
            image={userData.image}
          />
          <div className="absolute bottom-0 right-0 flex h-10 w-full items-center justify-end rounded-lg border bg-gray-800 py-1 pl-4 text-sm sm:w-auto">
            <p>Copy your wallet ID to share.</p>
            <CopyButton textToCopy={`${userData.walletId}`} />
          </div>
        </div>

        <div className="mb-10 flex gap-4">
          <div className="w-3/5 self-start rounded-lg border border-gray-700 p-5">
            <UserOverview walletId={walletId} />
          </div>
          <div className="w-4/5 rounded-lg border border-gray-700 p-5">
            <BadgeSection walletId={walletId} />
          </div>
        </div>
      </div>
    </div>
  );
}
