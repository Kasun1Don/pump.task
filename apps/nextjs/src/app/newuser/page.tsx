import { cookies } from "next/headers";

import NewUserPage from "../_components/NewUserPage";

export default function Page() {
  const walletId: string = cookies().get("wallet")?.value ?? "";

  return <NewUserPage wallet={walletId} />;
}
