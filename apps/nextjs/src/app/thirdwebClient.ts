import { createThirdwebClient } from "thirdweb";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID!;

export const client = createThirdwebClient({
  clientId: client_id,
});
