 
"use server";

import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";

import { client } from "../thirdwebClient";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN ?? "",
  adminAccount: privateKeyToAccount({ client, privateKey }),
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    cookies().set("jwt", jwt);
    cookies().set("wallet", verifiedPayload.payload.address);
    redirect("/newuser");
  }
}

export async function isLoggedIn() {
  const jwt = cookies().get("jwt");
  if (!jwt?.value) {
    return false;
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  if (!authResult.valid) {
    return false;
  }
  return true;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function logout() {
  cookies().delete("jwt");
}
