"use client";

import React, { useState } from "react";
import Image from "next/image";

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [imageSrc, setImageSrc] = useState("/profile/copy.svg");

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setImageSrc("/profile/check.png");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div
      className="mx-2 cursor-pointer rounded-sm border hover:bg-gray-700"
      onClick={handleCopyClick}
      style={{ width: "30px", height: "30px" }}
    >
      <Image src={imageSrc} alt="Copy text button" width={30} height={30} />
    </div>
  );
};

export default CopyButton;
