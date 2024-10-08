import React from "react";
import { cookies } from "next/headers";
import Image from "next/image";

import type { UserClass } from "@acme/db";

import { api } from "~/trpc/server";
import BadgeSection from "../../_components/_profile/badgeSection";
import CopyButton from "../../_components/_profile/copyButton";
import UpdateBio from "../../_components/_profile/userBio";
import UserOverview from "../../_components/_profile/userOverview";

export default async function UserProfile() {
  const walletId = cookies().get("wallet")?.value;

  if (!walletId) {
    console.error("Wallet ID is undefined or not found in cookies.");
    return <div>Error: Wallet ID not found.</div>;
  }

  const response = await api.user.byWallet({ walletId });

  const userData: UserClass | null = response as UserClass;

  return (
    <div className="relative">
      <section
        className="absolute inset-0 top-[3.7rem] w-full border-t-2"
        style={{
          backgroundColor: "#050505",
          pointerEvents: "none",
          borderColor: "rgba(83, 83, 83, 0.5)",
        }}
      ></section>
      <div className="relative mx-52">
        <Image
          src={userData.image ?? "/labrysGreenSphere.png"}
          alt="User Profile Icon"
          width={120}
          height={120}
          className="mb-4 mt-36"
        />

        <div className="relative mb-4 flex h-auto justify-between">
          <div className="w-7/10 justify-start" style={{ maxWidth: "70%" }}>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <UpdateBio bio={userData.bio} walletId={walletId} />
          </div>
          <div className="absolute bottom-0 right-0 flex h-10 w-full items-center justify-end rounded-lg border bg-gray-800 py-1 pl-7 text-sm sm:w-auto">
            <p>pump.task/{userData.name}</p>
            <CopyButton textToCopy={`pump.task/${userData.name}`} />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-3/5 self-start rounded-lg border border-gray-700 p-5">
            <UserOverview />
          </div>
          <div className="w-4/5 rounded-lg border border-gray-700 p-5">
            <BadgeSection />
          </div>
        </div>
      </div>
    </div>
  );
}
