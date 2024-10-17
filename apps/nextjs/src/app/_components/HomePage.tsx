"use client";

// Thirdweb Wallet Type
import type { Wallet } from "thirdweb/wallets";
// Next.js Router Hook
import { useRouter } from "next/navigation";
// Thirdweb React Components
import {
  ConnectButton,
  darkTheme,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";

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
  // Thirdweb Hooks
  const router = useRouter();
  const disconnect = useDisconnect();
  const activeWallet = useActiveWallet();

  // Function to disconnect the wallet if user does not have a JWT
  const disconnectWallet = () => {
    disconnect.disconnect(activeWallet as Wallet);
  };

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
          isLoggedIn: async () => {
            // Check if the user is logged in & has a valid JWT
            const response = await isLoggedIn();

            // If the user has a valid JWT, redirect to the auth page
            if (response == true) {
              router.push("/auth");
              // If the user does not have a valid JWT, disconnect the wallet
            } else {
              disconnectWallet();
            }
            return true;
          },
          doLogin: async (params) => {
            await login(params);
          },
          getLoginPayload: async ({ address }) => generatePayload({ address }),
          doLogout: async () => {
            await logout();
            router.push("/");
          },
        }}
      />
    </>
  );
}
