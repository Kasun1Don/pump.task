"use server";

import { prepareContractCall, sendTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";

import { client, CONTRACT } from "../thirdwebClient";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, turbo/no-undeclared-env-vars
const privateKey = process.env.CLIENT_PRIVATE_KEY!;

if (!privateKey) {
  throw new Error("Private Key is not defined");
}

// Create an account from the private key to sign the transaction
const ACCOUNT = privateKeyToAccount({
  client,
  privateKey: privateKey,
});

// Function to mint an NFT to a user
export default async function mintNftToUser({
  to,
  tokenId,
}: {
  to: string;
  tokenId: number;
}) {
  const nftId = BigInt(tokenId);
  // List of NFT image URLS
  const nftImages = [
    "ipfs://QmeRVxW6PnC2XAhvtJApPsUtY5fj3EtgMdYzAvPJAqT1W6/0",
    "ipfs://QmeRVxW6PnC2XAhvtJApPsUtY5fj3EtgMdYzAvPJAqT1W6/1",
    "ipfs://QmeRVxW6PnC2XAhvtJApPsUtY5fj3EtgMdYzAvPJAqT1W6/2",
    "ipfs://QmeRVxW6PnC2XAhvtJApPsUtY5fj3EtgMdYzAvPJAqT1W6/3",
    "ipfs://QmeRVxW6PnC2XAhvtJApPsUtY5fj3EtgMdYzAvPJAqT1W6/4",
    "ipfs://QmeRVxW6PnC2XAhvtJApPsUtY5fj3EtgMdYzAvPJAqT1W6/5",
    "ipfs://QmeRVxW6PnC2XAhvtJApPsUtY5fj3EtgMdYzAvPJAqT1W6/6",
    "ipfs://QmeRVxW6PnC2XAhvtJApPsUtY5fj3EtgMdYzAvPJAqT1W6/7",
  ];

  // Get the URI for the token ID
  const uri = nftImages[tokenId];

  // Check if the token ID is valid
  if (!uri) {
    throw new Error("Invalid Token ID");
  }

  // Prepare the contract call to mint the NFT to the user
  const transaction = prepareContractCall({
    contract: CONTRACT,
    method: "mintTo",
    params: [to, nftId, uri, 1n],
  });

  // Send the transaction to mint the NFT to the user
  const { transactionHash } = await sendTransaction({
    transaction,
    account: ACCOUNT,
  });

  return transactionHash;
}
