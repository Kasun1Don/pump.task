import * as React from "react";

interface BadgeProps {
  imageUrl: string;
  title: string;
  count: number;
}

const Badges: React.FC<BadgeProps> = ({ imageUrl, title, count }) => {
  return (
    <a
      href="https://basescan.org/"
      target="_blank"
      rel="noopener noreferrer"
      className="m-1 block overflow-hidden rounded-lg border border-gray-700 shadow-lg transition-transform hover:border-gray-300"
      style={{
        width: "150px",
        height: "216px",
      }}
    >
      <div
        className="relative"
        style={{
          height: "65%",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="border-t border-gray-700 bg-black bg-opacity-50 p-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-xs">R4</p>
        <p className="text-right text-xs">x{count}</p>
      </div>
    </a>
  );
};

export default Badges;
