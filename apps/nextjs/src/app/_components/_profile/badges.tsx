import * as React from "react";

interface BadgeProps {
  imageUrl: string;
  name: string;
  count: number;
  link: string;
}

const Badges: React.FC<BadgeProps> = ({ imageUrl, name, count, link }) => {
  return (
    <a
      href={link}
      className="block overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
      style={{ width: "150px" }}
    >
      <div
        className="relative"
        style={{
          height: "216px",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute bottom-0 w-full bg-black bg-opacity-50 p-2">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <p className="text-sm font-semibold text-white">R4</p>
          <p className="text-sm font-semibold text-white">x{count}</p>
        </div>
      </div>
    </a>
  );
};

export default Badges;
