import Image from "next/image";

import BadgeSection from "../../_components/_profile/badgeSection";
import UserOverview from "../../_components/_profile/userOverview";

export default function userProfile() {
  return (
    <div className="p-4">
      <Image
        src="/labrysGreenSphere.png"
        alt="User Profile Icon"
        width={120}
        height={120}
        className="mb-4"
      />
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Users name</h1>
        <p className="text-gray-600">Users Bio</p>
        <div className="text-blue-500">pump.task/usersname</div>
      </div>
      <div className="flex">
        <div className="flex-1 pr-4">
          <UserOverview />
        </div>
      </div>
      <div className="flex">
        <div className="flex-2 pl-4">
          <BadgeSection />
        </div>
      </div>
    </div>
  );
}
