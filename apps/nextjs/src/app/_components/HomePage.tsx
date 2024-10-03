"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton, darkTheme } from "thirdweb/react";

import { Button } from "@acme/ui/button";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "../actions/authFront";
import { client } from "../thirdwebClient";

export function Login() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const router = useRouter();
  return (
    <>
      <ConnectButton
        connectButton={{ label: "Start pumping tasks" }}
        client={client}
        theme={darkTheme({
          colors: {
            primaryButtonBg: "#2aa72a",
          },
        })}
        auth={{
          isLoggedIn: async (address) => {
            console.log("checking if logged in!", { address });
            const response = await isLoggedIn();
            if (response) {
              setUserLoggedIn(true);
            }
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
      {userLoggedIn && (
        <Button className="bg-zesty-green" onClick={() => router.push("/auth")}>
          {" "}
          Login Now!
        </Button>
      )}
    </>
  );
}
