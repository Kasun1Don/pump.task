"use client";

import React, { useState } from "react";
import Image from "next/image";

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [imageSrc, setImageSrc] = useState("/copy.png");

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setImageSrc("/check.png");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div
      className="mx-2 cursor-pointer rounded-sm border hover:bg-gray-700"
      onClick={handleCopyClick}
      style={{ width: "40px", height: "40px" }}
    >
      <Image src={imageSrc} alt="Copy text button" width={40} height={40} />
    </div>
  );
};

export default CopyButton;
