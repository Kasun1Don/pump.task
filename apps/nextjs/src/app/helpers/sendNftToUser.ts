import { claimTo } from "thirdweb/extensions/erc1155";
import { useSendTransaction } from "thirdweb/react";

import { CONTRACT } from "../thirdwebClient";

export default function SendNftToUser({ walletId }: { walletId: string }) {
  const { mutate: sendTransaction } = useSendTransaction();

  try {
    // Await the transaction from claimTo
    const transaction = claimTo({
      contract: CONTRACT,
      to: walletId,
      quantity: 1n,
      tokenId: 2n,
    });

    // Send the transaction
    const transactionHash = sendTransaction(transaction);
    return transactionHash;
  } catch (error) {
    console.error("Failed to send NFT:", error);
    return error;
  }
}
