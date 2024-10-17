import { useEffect, useState } from "react";
import { useReadContract } from "thirdweb/react";

import { CONTRACT } from "~/app/thirdwebClient";

interface Nft {
  id: number;
  name: string;
}

export function useUserNfts(walletId: string): Nft[] {
  const [nftValues, setNftValues] = useState<Nft[]>([]);
  const [allnftValues, setAllNftValues] = useState<number[]>([]);

  //----------------------------------------------------------------------------//

  // Calling useReadContract once using the balanceOfBatch method
  const { data: contractDataAll } = useReadContract({
    contract: CONTRACT,
    method: "balanceOfBatch",
    params: [
      [
        walletId,
        walletId,
        walletId,
        walletId,
        walletId,
        walletId,
        walletId,
        walletId,
      ],
      [
        BigInt(0),
        BigInt(1),
        BigInt(2),
        BigInt(3),
        BigInt(4),
        BigInt(5),
        BigInt(6),
        BigInt(7),
      ],
    ],
  });

  useEffect(() => {
    if (contractDataAll) {
      const numericValues = contractDataAll.map((data) => Number(data));
      setAllNftValues(numericValues);
    } else {
      setAllNftValues([]);
    }
  }, [contractDataAll]);

  console.log("all values", allnftValues);

  //----------------------------------------------------------------------------//

  // Calling useReadContract multiple times using the balanceOf method
  const { data: contractData0 } = useReadContract({
    contract: CONTRACT,
    method: "balanceOf",
    params: [walletId, BigInt(0)],
  });

  const { data: contractData1 } = useReadContract({
    contract: CONTRACT,
    method: "balanceOf",
    params: [walletId, BigInt(1)],
  });

  const { data: contractData2 } = useReadContract({
    contract: CONTRACT,
    method: "balanceOf",
    params: [walletId, BigInt(2)],
  });

  const { data: contractData3 } = useReadContract({
    contract: CONTRACT,
    method: "balanceOf",
    params: [walletId, BigInt(3)],
  });

  const { data: contractData4 } = useReadContract({
    contract: CONTRACT,
    method: "balanceOf",
    params: [walletId, BigInt(4)],
  });

  const { data: contractData5 } = useReadContract({
    contract: CONTRACT,
    method: "balanceOf",
    params: [walletId, BigInt(5)],
  });

  const { data: contractData6 } = useReadContract({
    contract: CONTRACT,
    method: "balanceOf",
    params: [walletId, BigInt(6)],
  });

  const { data: contractData7 } = useReadContract({
    contract: CONTRACT,
    method: "balanceOf",
    params: [walletId, BigInt(7)],
  });

  useEffect(() => {
    const updatedValues = [
      contractData0,
      contractData1,
      contractData2,
      contractData3,
      contractData4,
      contractData5,
      contractData6,
      contractData7,
    ].map((data, index) => ({
      id: index,
      name: data?.toString() ?? "0",
    }));

    setNftValues(updatedValues);
  }, [
    contractData0,
    contractData1,
    contractData2,
    contractData3,
    contractData4,
    contractData5,
    contractData6,
    contractData7,
  ]);

  return nftValues;
}
