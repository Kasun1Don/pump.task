"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

import { useTheme } from "@acme/ui/theme";

// should be in own file
const CLIENT_ID = "d0038b53c5d72336428a00389e01b3f2";
const client = createThirdwebClient({ clientId: CLIENT_ID });

export function Login() {
  const activeAccount = useActiveAccount();
  const { theme } = useTheme();
  const connectButtonTheme = theme as "dark" | "light" | undefined;

  return (
    <>
      <ConnectButton client={client} theme={connectButtonTheme} />
      {activeAccount && (
        <h2>Logged in with wallet address: {activeAccount.address}</h2>
      )}
    </>
  );
}
