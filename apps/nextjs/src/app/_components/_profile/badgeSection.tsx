import { cookies } from "next/headers";

import Badges from "./badges";

const BadgeSection = () => {
  const walletId = cookies().get("wallet")?.value;
  return (
    <div>
      <h1 className="text-3xl font-semibold">Badges Earned</h1>
      <p className="mb-4 text-sm text-gray-400">
        Complete tasks to earn badges. These badges represent your onchain
        resume, they’re minted as NFTs on Base.
      </p>
      <div className="flex flex-wrap gap-4">
        <Badges walletId={walletId} />
      </div>
    </div>
  );
};

export default BadgeSection;
