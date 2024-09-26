import { cookies } from "next/headers";

import AccountSettings from "~/app/_components/userSettingsPage/AccountSettings";
import DeleteAccount from "~/app/_components/userSettingsPage/DeleteAccount";
import EmailNotifications from "~/app/_components/userSettingsPage/EmailNotifications";
import Security from "~/app/_components/userSettingsPage/Security";

export default function Page() {
  // Get wallet ID from cookies
  const walletId: string = cookies().get("wallet")?.value ?? "";

  // Log error if wallet ID is not found
  if (!walletId) {
    console.error("Wallet ID is undefined or not found in cookies.");
  }

  return (
    <section className="my-8 flex flex-col items-center justify-center gap-4 pb-48">
      {/* Account Settings */}
      <AccountSettings walletId={walletId} />

      {/* Email Notifications */}
      <EmailNotifications walletId={walletId} />

      {/* Security */}
      <Security />

      {/* Delete Account */}
      <DeleteAccount />
    </section>
  );
}
