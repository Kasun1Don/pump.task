"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@acme/ui/button"; // button from monorepo packages/ui
import { toast } from "@acme/ui/toast";

export default function WalletError() {
  const searchParams = useSearchParams();
  const walletId = searchParams.get("walletId");
  const [errorMessage, setErrorMessage] = useState("");

  const isValidAddress = (address: string) => {
    return /^0x[a-f0-9]{40}$/.test(address);
  };

  useEffect(() => {
    if (walletId) {
      if (!isValidAddress(walletId)) {
        setErrorMessage("The wallet ID provided is incorrectly formatted");
      } else {
        setErrorMessage("The wallet ID provided could not be found");
      }
    } else {
      setErrorMessage("No wallet ID was provided in the URL");
    }
  }, [walletId]);

  const handleReturnHome = () => {
    toast("Redirecting to your user profile...");
  };

  return (
    <div className="bg-custom-bg flex h-screen items-center justify-center bg-cover bg-center">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold">Profile not found</h1>
        {errorMessage && <p className="text-xl">{errorMessage}</p>}

        <Link href="/profile">
          <Button
            className="mt-4 bg-[#72D524] text-black"
            variant="link"
            size="lg"
            onClick={handleReturnHome}
          >
            Return to your profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
