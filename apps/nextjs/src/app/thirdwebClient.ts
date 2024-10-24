import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

import { PUMP_TASK_ABI, PUMP_TASK_ADDRESS } from "./constants";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID!;

export const chain = defineChain(11155111);

export const client = createThirdwebClient({
  clientId: client_id,
});

export const CONTRACT = getContract({
  client: client,
  chain: chain,
  address: PUMP_TASK_ADDRESS,
  abi: PUMP_TASK_ABI,
});
