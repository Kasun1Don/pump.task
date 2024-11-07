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

export const generatePayload = async (
  ...args: Parameters<typeof thirdwebAuth.generatePayload>
) => {
  return thirdwebAuth.generatePayload(...args);
};

export async function login(payload: VerifyLoginPayloadParams) {
  try {
    const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
    if (verifiedPayload.valid) {
      const jwt = await thirdwebAuth.generateJWT({
        payload: verifiedPayload.payload,
      });

      cookies().set("jwt", jwt, {
        path: "/",
        secure: true,
        sameSite: "strict",
      });
      cookies().set("wallet", verifiedPayload.payload.address, {
        path: "/",
        secure: true,
        sameSite: "strict",
      });
      redirect("/auth");
    }
  } catch (error) {
    console.error("Error logging in", error);
  }
}

export async function isLoggedIn() {
  try {
    const jwt = cookies().get("jwt");
    if (!jwt?.value) {
      return false;
    }

    const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
    if (!authResult.valid) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking login status", error);
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function logout() {
  cookies().delete("jwt");
}
