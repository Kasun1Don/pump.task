"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@acme/ui/button";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="bg-custom-bg flex h-screen flex-col items-center justify-center gap-8 bg-cover bg-center text-center">
      <h1 className="mb-2 text-4xl font-bold">Sorry something went wrong!</h1>

      <Button onClick={handleClick}>Try Again</Button>
    </div>
  );
}
