import AccountSettings from "~/app/_components/userSettings/AccountSettings";
import DeleteAccount from "~/app/_components/userSettings/DeleteAccount";
import EmailNotifications from "~/app/_components/userSettings/EmailNotifications";
import Security from "~/app/_components/userSettings/Security";

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
