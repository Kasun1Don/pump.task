import React from "react";
import Image from "next/image";

import BadgeSection from "../../_components/_profile/badgeSection";
import CopyButton from "../../_components/_profile/copyButton";
import UserOverview from "../../_components/_profile/userOverview";

export default function UserProfile() {
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
            <h1 className="text-2xl font-bold">User's name</h1>
            <p className="text-sm text-gray-400">User's Bio</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-gray-800 text-sm">
            <p className="ms-3">pump.task/usersname</p>
            <CopyButton textToCopy="pump.task/username" />
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
