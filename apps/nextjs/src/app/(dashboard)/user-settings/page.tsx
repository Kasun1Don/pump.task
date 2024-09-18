import AccountSettings from "~/app/_components/userSettings/AccountSettings";
import EmailNotifications from "~/app/_components/userSettings/EmailNotifications";
import Security from "~/app/_components/userSettings/Security";

export default function Page() {
  return (
    <>
      <section className="my-8 flex flex-col items-center justify-center gap-4">
        <AccountSettings />
        <EmailNotifications />
        <Security />
        delete account
      </section>
    </>
  );
}
