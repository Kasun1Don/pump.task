"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

import { useTheme } from "@acme/ui/theme";

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID!;

const client = createThirdwebClient({
  clientId: client_id,
});

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
