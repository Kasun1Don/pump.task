import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { UserClass } from "@acme/db";

import { api } from "~/trpc/server";
import UserLoginClient from "../_components/AuthPage";
import { getUserLocation } from "../actions/getUserLocation";

// Define the AuthPage component
export default async function AuthPage() {
  // Get wallet ID from cookies
  const walletId: string = cookies().get("wallet")?.value ?? "";

  // Redirect if wallet ID is undefined
  if (!walletId) {
    console.error("Wallet ID is undefined or not found in cookies.");
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Wallet ID Not Found</h1>
        <p className="mt-4">Please connect your wallet to continue.</p>
        <a href="/connect-wallet">
          <button className="mt-6 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Connect Wallet
          </button>
        </a>
      </div>
    );
  }

  // Fetch user data with wallet ID
  const response = await api.user.byWallet({ walletId }).catch((error) => {
    console.error("Error fetching user data:", error);
    redirect("/newuser");
  });

  // Destructure user data from response
  const userData: UserClass | null = response as UserClass;

  // Redirect if user does not have a name
  if (userData.name) {
    redirect("/newuser");
  }

  const userLocation = await getUserLocation();

  const location = userLocation.location.city + userLocation.location.country;

  return (
    <UserLoginClient
      wallet={walletId}
      locationData={location || "localhost:3000"}
      userHas2FAEnabled={userData.emailVerified}
    />
  );
}
