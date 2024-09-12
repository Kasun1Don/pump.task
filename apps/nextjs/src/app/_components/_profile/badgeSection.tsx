import Badges from "./badges";

const BadgeSection = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-white">Badges Earned</h1>
      <p className="mb-4 text-white">
        Complete tasks to earn badges. These badges represent your onchain
        resume, they’re minted as NFTs on Base.
      </p>
      <div className="flex flex-wrap gap-4">
        <Badges
          name="Frontend"
          count={12}
          imageUrl="/badge.png"
          link="https://basescan.org/"
        />
        <Badges
          name="Backend"
          count={1}
          imageUrl="/badge.png"
          link="https://basescan.org/"
        />
        <Badges
          name="Frontend"
          count={17}
          imageUrl="/badge.png"
          link="https://basescan.org/"
        />
      </div>
    </div>
  );
};

export default BadgeSection;
