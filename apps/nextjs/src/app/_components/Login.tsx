"use client";

// import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { ConnectButton, darkTheme } from "thirdweb/react";

import {
  generatePayload,
  isLoggedIn,
  login,
  logout,
} from "../actions/authFront";
import { client } from "../thirdwebClient";

// import { useTheme } from "@acme/ui/theme";

export function Login() {
  // const activeAccount = useActiveAccount();
  // const router = useRouter();

  //   const { theme } = useTheme();
  //   const connectButtonTheme = theme as "dark" | "light" | undefined;
  // if (activeAccount) router.push("/secure");
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
            return await isLoggedIn();
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
