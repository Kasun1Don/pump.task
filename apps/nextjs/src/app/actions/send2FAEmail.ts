"use server";

import { api } from "~/trpc/server";

export default async function Send2FAEmail(wallet: string) {
  const walletId = wallet;

  const response = await api.email.sendEmail({
    walletId,
  });

  return response;
}
