"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

export default function UserLoginClient({
  wallet,
  locationData,
  userHas2FAEnabled,
}: {
  userHas2FAEnabled: boolean | undefined;
  wallet: string;
  locationData: string;
}) {
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const mutation = api.user.login.useMutation();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userAgentArray = navigator.userAgent.split(" ");
      await mutation.mutateAsync({
        walletId: wallet,
        browser: userAgentArray[userAgentArray.length - 2],
        operatingSystem: navigator.platform,
        location: locationData,
      });

      router.push("/profile");
    } catch (error) {
      console.error("Login failed:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    if (!userHas2FAEnabled || userAuthenticated) {
      handleLogin().catch((error) => {
        console.error("Error handling login:", error);
      });
    }

    setIs2FAOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuthenticated]);

  return (
    <>
      {is2FAOpen ? (
        <>
          <h1>Get 2FA code</h1>{" "}
          <button onClick={() => setUserAuthenticated(true)}>
            CLICK HERE to skip the auth and login "just for demo purposes will
            be updated in next sprint"
          </button>
        </>
      ) : null}
    </>
  );
}
