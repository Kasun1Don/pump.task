import React from "react";
import { cookies } from "next/headers";
import Image from "next/image";

import { api } from "~/trpc/server";
import BadgeSection from "../../_components/_profile/badgeSection";
import CopyButton from "../../_components/_profile/copyButton";
import UserOverview from "../../_components/_profile/userOverview";

interface UserData {
  bio?: string;
  name?: string;
  image?: string;
}

export default async function UserProfile() {
  const walletId: string = cookies().get("wallet")?.value ?? "";

  if (!walletId) {
    console.error("Wallet ID is undefined or not found on cookies.");
    return <div>Error: Wallet ID is required.</div>;
  }
  try {
    const userData: UserData = await api.user.byWallet({
      walletId,
    });

    console.log("User Bio debug", userData);

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
            src="/labrysGreenSphere.png"
            alt="User Profile Icon"
            width={120}
            height={120}
            className="mb-4 mt-36"
          />

          <div className="mb-4 flex justify-between pb-6">
            <div>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-sm text-gray-400">
                {userData.bio ?? "Update your bio"}
              </p>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-gray-800 text-sm">
              <p className="ms-3">pump.task/{userData.name}</p>
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
  } catch (error) {
    console.error("Error fetching user data:", error);
    return <div>Error fetching user data.</div>;
  }
}
