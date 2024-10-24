import { claimTo } from "thirdweb/extensions/erc1155";
import { useSendTransaction } from "thirdweb/react";

import { CONTRACT } from "../thirdwebClient";

export default function SendNftToUser({ walletId }: { walletId: string }) {
  const { mutate: sendTransaction } = useSendTransaction();

  // Define the function to send the NFT
  const sendNft = () => {
    try {
      // Await the transaction from claimTo
      const transaction = claimTo({
        contract: CONTRACT,
        to: walletId,
        quantity: 1n,
        tokenId: 2n,
      });

      // Send the transaction
      sendTransaction(transaction);
    } catch (error) {
      console.error("Failed to send NFT:", error);
    }
  };

  return (
    <button onClick={sendNft} className="btn btn-primary">
      Send NFT to User
    </button>
  );
}
