import React from "react";
import Image from "next/image";

import type { UserClass } from "@acme/db";

import { api } from "~/trpc/server";
import BadgeSection from "../../../_components/_profile/badgeSection";
import CopyButton from "../../../_components/_profile/copyButton";
import UserOverview from "../../../_components/_profile/userOverview";

export default async function UserProfile({
  params,
}: {
  params: { walletId: string };
}) {
  const walletId = params.walletId;

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

        <div className="relative mb-4 flex h-auto justify-between">
          <div className="w-7/10 justify-start" style={{ maxWidth: "70%" }}>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="w-96 flex-1 p-1 text-sm text-gray-400">
              {
                // If the user has a bio, display it. Otherwise, display a message indicating that the user does not have a bio yet.
                userData.bio
                  ? userData.bio
                  : `${userData.name} does not have a bio yet.`
              }
            </p>
          </div>
          <div className="absolute bottom-0 right-0 flex h-10 w-full items-center justify-end rounded-lg border bg-gray-800 py-1 pl-7 text-sm sm:w-auto">
            <p>Copy {userData.name}'s wallet ID.</p>
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
