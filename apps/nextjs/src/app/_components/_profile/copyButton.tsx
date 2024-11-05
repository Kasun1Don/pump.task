"use client";

import React, { useState } from "react";
import Image from "next/image";

import { toast } from "@acme/ui/toast";

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [imageSrc, setImageSrc] = useState("/profile/copy.svg");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setImageSrc("/profile/check.png");
        setIsCopied(true);
        toast.message("Url copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy text");
      });
  };

  return (
    <button
      className="mx-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm hover:bg-gray-700"
      onClick={handleCopyClick}
    >
      <Image
        src={imageSrc}
        alt="Copy text button"
        width={isCopied ? 40 : 24}
        height={isCopied ? 40 : 24}
      />
    </button>
  );
};

export default CopyButton;
