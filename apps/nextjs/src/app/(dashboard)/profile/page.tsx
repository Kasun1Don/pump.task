import React from "react";
import { cookies, headers } from "next/headers";
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

  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");
  const pathname = "/profile";
  const url = `${protocol}://${host}${pathname}/${walletId}`;

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

      <div className="relative mx-4 mt-16 lg:mx-32 xl:mx-52">
        <Image
          src={userData.image ?? "/labrysGreenSphere.png"}
          alt="User Profile Icon"
          width={120}
          height={120}
          className="mx-auto mb-4 lg:mx-0"
        />

        <div className="relative mb-4 flex flex-col gap-2 lg:flex-row lg:justify-between">
          <UpdateProfile
            bio={userData.bio}
            walletId={walletId}
            name={userData.name}
            image={userData.image}
          />
          <div className="flex h-10 w-full items-center justify-center rounded-lg border bg-gray-800 py-1 pl-6 text-sm lg:w-auto lg:justify-end">
            <p>Copy profile link</p>
            <CopyButton textToCopy={url} />
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-4 lg:flex-row">
          <div className="w-full self-start rounded-lg border border-gray-700 p-5 lg:w-3/5">
            <UserOverview walletId={walletId} />
          </div>
          <div className="w-full rounded-lg border border-gray-700 p-5 lg:w-4/5">
            <BadgeSection walletId={walletId} />
          </div>
        </div>
      </div>
    </div>
  );
}
