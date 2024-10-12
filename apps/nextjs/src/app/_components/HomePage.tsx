"use client";

import { useRouter } from "next/navigation";
import { ConnectButton, darkTheme } from "thirdweb/react";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "../actions/authFront";
import { chain, client } from "../thirdwebClient";

export function Login() {
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
            const response = await isLoggedIn();
            if (response) {
              router.push("/auth");
            }
            console.log("user has JWT", response);
            return true;
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
