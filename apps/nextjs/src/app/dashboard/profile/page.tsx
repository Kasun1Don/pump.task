import Badges from "../../_components/_profile/badges";

export default function userProfile() {
  return (
    <>
      <div>
        <h1>Users name</h1>
        <p>Users Bio</p>
        <div>pump.task/usersname</div>
      </div>
      <div>
        <h1>Overview</h1>
        <h3>History of performance</h3>
        <p>Active Projects: X</p>
        <p>Total Badges: X</p>
        <p>badges in last 30d: X</p>
        <p>Days since last badge: X</p>
        <p>Top skill: Frontend</p>
      </div>
      <div className="rounded-lg bg-green-500 p-4">
        <h1>Badges Earned</h1>
        <p>
          Complete tasks to earn badges. These badges represent your onchain
          resume, they’re minted as NFTs on Base.
        </p>
        <div>
          <Badges />
        </div>
      </div>
    </>
  );
}
