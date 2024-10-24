"use client";

// Next.js Router Hook
import { useRouter } from "next/navigation";
// Thirdweb React Components
import { ConnectButton, darkTheme } from "thirdweb/react";

import { api } from "~/trpc/react";
// Functions for logging in and out, Auth
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "../actions/authFront";
// The Thirdweb client and chain
import { chain, client } from "../thirdwebClient";

export function Login() {
  const utils = api.useUtils();

  const handlePrefetchUser = (walletId: string) => {
    if (!walletId) {
      console.error("Wallet ID is undefined or not found in cookies.");
      return;
    }
    void utils.user.byWallet.prefetch({ walletId });
  };

  const router = useRouter();

  return (
    <>
      <ConnectButton
        connectButton={{ label: "Start pumping tasks" }}
        client={client}
        chain={chain}
        theme={darkTheme({
          colors: {
            primaryButtonBg: "#2aa72a",
          },
        })}
        auth={{
          isLoggedIn: async (address) => {
            const result = await isLoggedIn();
            if (result) {
              handlePrefetchUser(address);
              router.push("/auth");
            }
            return false;
          },
          doLogin: async (params) => {
            console.log("logging in!");
            await login(params);
          },
          getLoginPayload: async ({ address }) => generatePayload({ address }),
          doLogout: async () => {
            console.log("logging out!");
            await logout();
          },
        }}
      />
    </>
  );
}
