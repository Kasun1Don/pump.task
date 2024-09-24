import type { UserClass } from "@acme/db";

import AccountSettings from "~/app/_components/userSettingsPage/AccountSettings";
import DeleteAccount from "~/app/_components/userSettingsPage/DeleteAccount";
import EmailNotifications from "~/app/_components/userSettingsPage/EmailNotifications";
import Security from "~/app/_components/userSettingsPage/Security";
import { createServerSideFetch } from "~/app/actions/createServerSideFetchHelper";

export default async function Page() {
  const caller = await createServerSideFetch();
  const response = await caller.user.all();

  // Destructure user data from response
  const userData: UserClass | null = response[0] as UserClass;

  console.log(userData);

  return (
    <section className="my-8 flex flex-col items-center justify-center gap-4 pb-48">
      {/* Account Settings */}
      <AccountSettings />

      {/* Email Notifications */}
      <EmailNotifications />

      {/* Security */}
      <Security />

      {/* Delete Account */}
      <DeleteAccount />
    </section>
  );
}
