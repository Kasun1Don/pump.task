"use client";

// Next.js Router Hook
import { useState } from "react";
import { useRouter } from "next/navigation";
// Thirdweb React Components
import { ConnectButton, darkTheme } from "thirdweb/react";

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
  const [loading, setLoading] = useState<boolean>(false);
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
          isLoggedIn: async () => {
            const result = await isLoggedIn();
            if (result) {
              router.push("/auth");
            }
            return false;
          },
          doLogin: async (params) => {
            setLoading(true);
            console.log("logging in!");
            await login(params);
          },
          getLoginPayload: async ({ address }) => generatePayload({ address }),
          doLogout: async () => {
            console.log("logging out!");
            await logout();
          },
        }}
        signInButton={{
          label: !loading ? "Sign in" : "Loading...",
        }}
      />
    </>
  );
}
