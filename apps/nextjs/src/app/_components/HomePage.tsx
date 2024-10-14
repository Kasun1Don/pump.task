"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton, darkTheme } from "thirdweb/react";

import { api } from "~/trpc/react";
import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "../actions/authFront";
import { chain, client } from "../thirdwebClient";

export function Login() {
  const router = useRouter();

  const [triggerQuery, setTriggerQuery] = useState(false);

  const walletId = "0x123";

  const { data, isLoading } = api.email.sendEmail.useQuery(
    {
      walletId,
    },
    {
      enabled: triggerQuery,
    },
  );

  console.log(data);

  const sendCode = () => {
    setTriggerQuery(true);
  };

  return (
    <>
      <button onClick={sendCode} disabled={isLoading}></button>

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
