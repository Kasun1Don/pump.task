import { cookies } from "next/headers";

import type { UserClass } from "@acme/db";

import AccountSettings from "~/app/_components/_userSettingsPage/AccountSettings";
import DeleteAccount from "~/app/_components/_userSettingsPage/DeleteAccount";
import EmailNotifications from "~/app/_components/_userSettingsPage/EmailNotifications";
import Security from "~/app/_components/_userSettingsPage/Security";
import { api } from "~/trpc/server";

export default async function Page() {
  const walletId = cookies().get("wallet")?.value;

  if (!walletId) {
    console.error("Wallet ID is undefined or not found in cookies.");
    return <div>Error: Wallet ID not found.</div>;
  }

  const response = await api.user.byWallet({ walletId });

  // Destructure user data from response
  const userData: UserClass | null = response as UserClass;

  return (
    <section className="my-2 flex flex-col items-center justify-center gap-4 pb-48">
      <AccountSettings
        language={userData.userSettings?.language}
        theme={userData.userSettings?.isThemeDark}
        walletId={walletId}
      />
      <EmailNotifications
        dueDate={userData.userSettings?.dueDate}
        email={userData.email}
        comments={userData.userSettings?.comments}
        assignToCard={userData.userSettings?.assignedToCard}
        removeFromCard={userData.userSettings?.removedFromCard}
        changeCardStatus={userData.userSettings?.changeCardStatus}
        newBadge={userData.userSettings?.newBadge}
        walletId={walletId}
      />
      <Security
        emailVerified={userData.emailVerified}
        authentication={userData.userSettings?.twoFactorAuth}
        walletId={walletId}
        email={userData.email}
      />
      <DeleteAccount walletId={walletId} />
    </section>
  );
}
