import Badges from "./badges";

const BadgeSection = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Badges Earned</h1>
      <p className="mb-4 text-sm text-gray-400">
        Complete tasks to earn badges. These badges represent your onchain
        resume, they’re minted as NFTs on Base.
      </p>
      <div className="flex flex-wrap gap-4">
        <Badges title="Frontend" count={12} imageUrl="/badge.png" />
        <Badges title="Backend" count={1} imageUrl="/badge.png" />
        <Badges title="Frontend" count={17} imageUrl="/badge.png" />
      </div>
    </div>
  );
};

export default BadgeSection;
