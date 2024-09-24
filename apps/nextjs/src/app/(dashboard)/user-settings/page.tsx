import AccountSettings from "~/app/_components/userSettingsPage/AccountSettings";
import DeleteAccount from "~/app/_components/userSettingsPage/DeleteAccount";
import EmailNotifications from "~/app/_components/userSettingsPage/EmailNotifications";
import Security from "~/app/_components/userSettingsPage/Security";

export default function Page() {
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
