"use server";

import { api } from "~/trpc/server";

interface ApiResponse {
  success: boolean;
  message: string;
}

export async function send2FAEmail(wallet: string): Promise<ApiResponse> {
  try {
    const response = await api.email.sendEmail({ walletId: wallet });
    return response;
  } catch (error) {
    console.error("Error sending 2FA email:", error);
    return {
      success: false,
      message: "An unknown error occurred while sending the email.",
    };
  }
}

export async function verify2FACode(
  wallet: string,
  code: string,
): Promise<ApiResponse> {
  try {
    const response = await api.email.verifyCode({ walletId: wallet, code });
    return response; // This should already conform to ApiResponse
  } catch (error) {
    console.error("Error verifying 2FA code:", error);
    return {
      success: false,
      message: "An unknown error occurred while verifying the code.",
    };
  }
}
