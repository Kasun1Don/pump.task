import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/server";

// Define the interface for the user overview data
interface UserOverviewData {
  activeProjects: number;
  totalBadges: number;
  badgesInLast30Days: number;
  daysSinceLastBadge: number | string;
  topSkill: string;
}

interface userOverviewProps {
  walletId: string;
}

export default async function UserOverview({ walletId }: userOverviewProps) {
  if (!walletId) {
    toast.error("Wallet ID is undefined or not found on cookies.");
    return null;
  }

  try {
    const userData: UserOverviewData = await api.user.overview({
      walletId,
    });

    return (
      <>
        <div className="flex flex-col p-0 text-sm">
          <h1 className="mb-0">Overview</h1>
          <p className="mb-4 text-gray-400">History of performance.</p>

          <div className="flex justify-between py-2">
            <p>Active Projects</p>
            <p>{userData.activeProjects}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Total Badges</p>
            <p>{userData.totalBadges}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Badges in last 30d</p>
            <p>{userData.badgesInLast30Days}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Days since last badge</p>
            <p>{userData.daysSinceLastBadge}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Top skill</p>
            <p>{userData.topSkill}</p>
          </div>
        </div>
      </>
    );
  } catch {
    toast.error("Error fetching user data.");
    return null;
  }
}
