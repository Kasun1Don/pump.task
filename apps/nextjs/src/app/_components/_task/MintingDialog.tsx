import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { UserClass } from "@acme/db";
import type { ObjectIdString, TaskCardSchema } from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";

type TaskCardData = z.infer<typeof TaskCardSchema>;

interface TaskCardProps {
  task: TaskCardData;
  projectId: ObjectIdString;
  statusId: ObjectIdString;
  statusColumnName: string;
  members:
    | {
        role: string;
        userData: UserClass;
      }[]
    | undefined;
  tagBeingMinted: string;
}

interface MintingDialogProps extends TaskCardProps {
  setViewTaskMinting: Dispatch<SetStateAction<boolean>>;
  bagsCreated: number;
}

export default function MintingDialog({
  task,
  setViewTaskMinting,
  bagsCreated,
  tagBeingMinted,
}: MintingDialogProps) {
  const getBadges = api.badge.getbadge.useQuery(task._id);
  const [retrying, setRetrying] = useState<string | null>(null);

  const utils = api.useUtils();

  const mutateRetryBadge = api.badge.retryMint.useMutation({
    onSuccess: () => {
      toast.success(`Badge Minted successfully`);
      void utils.badge.invalidate();
      void utils.task.getTaskByStatusId.invalidate();
    },
    onError: (error) => {
      toast.error("Error creating badge");
      console.error("Error creating badge:", error);
    },
  });

  const tagTotitles = {
    Frontend: "Frontend Beast",
    Backend: "Backend Master",
    Design: "Design Specialist",
    "Smart Contracts": "Smart Contract Wizz",
    Integration: "Integration Legend",
    Javascript: "Javascript Ninja",
    Misc: "Misc",
  };

  const tranHash = (tag: string): string => {
    const title = tagTotitles[tag as keyof typeof tagTotitles];

    if (!getBadges.data) {
      return "Error Minting NFT";
    }

    const badge = getBadges.data.find((item) => item.NFTTitle === title);

    if (badge?.transactionHash === "Failed") {
      return "Failed";
    }

    if (!badge) {
      return "In Queue";
    }

    return badge.transactionHash ?? "Error";
  };

  const retryMint = async (tag: string) => {
    setRetrying(tag);

    try {
      const result = await mutateRetryBadge.mutateAsync({
        taskId: task._id,
        tag: tag,
        walletId: task.assigneeId ?? "",
      });

      if (!result.success) {
        toast.error(`Error creating badge for tag: ${tag}`);
      }
    } catch (error) {
      console.error(`Error creating badge for tag: ${tag}`, error);
      toast.error(
        `Failed to mint badge for tag: ${tag}, moving to the next tag.`,
      );
    } finally {
      setRetrying(null);
    }
  };

  return (
    <DialogContent className="max-h-[700px] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Rewards</DialogTitle>
      </DialogHeader>
      <Link className="flex gap-4" href={`/profile/${task.assigneeId}`}>
        Recipient:
        <div className="flex gap-2 hover:cursor-pointer hover:underline">
          {task.assigneeId?.slice(0, 10)}.....
          <Image
            src={"/external-link-svgrepo-com.svg"}
            alt="Link to user's profile"
            height={20}
            width={20}
          />
        </div>
      </Link>
      <div>
        <div className="flex gap-4">
          Minting status:
          {task.isMinted ||
          bagsCreated ===
            task.tags.defaultTags.length +
              task.tags.userGeneratedTags.length ? (
            <div className="text-zesty-green font-bold">Minted</div>
          ) : (
            <div className="flex gap-4">
              {`${bagsCreated} / ${task.tags.defaultTags.length + (task.tags.userGeneratedTags.length > 0 ? 1 : 0)}`}
              <span className="loader"></span>
            </div>
          )}
        </div>
      </div>
      {task.tags.defaultTags.map((tag) => (
        <div
          key={tag}
          className="border-1 flex justify-start gap-4 rounded-lg border-zinc-600 p-2"
        >
          <Image
            src={`/nfts/${tag}.png`}
            alt={`NFT Image for ${tag}`}
            height={150}
            width={150}
            className="rounded-lg"
          />
          <div className="flex flex-col justify-center gap-2">
            <span className="pb-4 text-base">{tag}</span>
            {tranHash(tag) === "Failed" ? (
              <>
                <div className="flex flex-col text-red-500">Failed</div>
                <Button
                  variant="outline"
                  onClick={() => retryMint(tag)}
                  disabled={retrying === tag}
                  className="h-6 w-fit bg-red-500 text-xs hover:bg-red-600"
                >
                  {retrying === tag ? "Retrying..." : "Retry"}
                </Button>
              </>
            ) : (
              <Link
                className="flex flex-col"
                target="_blank"
                href={`https://sepolia.etherscan.io/tx/${tranHash(tag)}`}
              >
                Transaction Hash:
                <div className="flex gap-2 text-xs hover:cursor-pointer hover:underline">
                  {tag === tagBeingMinted
                    ? "Minting"
                    : tranHash(tag).slice(0, 30)}
                  ..
                  <Image
                    src={"/external-link-svgrepo-com.svg"}
                    alt="Link to user's profile"
                    height={15}
                    width={15}
                  />
                </div>
              </Link>
            )}
          </div>
        </div>
      ))}
      {task.tags.userGeneratedTags.length > 0 && (
        <div className="border-1 flex justify-start gap-4 rounded-lg border-zinc-600 p-2">
          <Image
            src={"/nfts/Misc.png"}
            alt="Misc NFT Image"
            height={150}
            width={150}
            className="rounded-lg"
          />
          <div className="flex flex-col justify-center">
            <span className="pb-4 text-base">Misc</span>
            {tranHash("Misc") === "Failed" ? (
              <>
                <div className="flex flex-col text-red-500">Failed</div>
                <Button
                  variant="outline"
                  onClick={() => retryMint("Misc")}
                  disabled={retrying === "Misc"}
                  className="h-6 w-fit bg-red-500 text-xs hover:bg-red-600"
                >
                  {retrying === "Misc" ? "Retrying..." : "Retry"}
                </Button>
              </>
            ) : (
              <Link
                className="flex flex-col"
                target="_blank"
                href={`https://sepolia.etherscan.io/tx/${tranHash("Misc")}`}
              >
                Transaction Hash:
                <div className="flex gap-2 text-xs hover:cursor-pointer hover:underline">
                  {tranHash("Misc").slice(0, 30)}..
                  <Image
                    src={"/external-link-svgrepo-com.svg"}
                    alt="Link to user's profile"
                    height={15}
                    width={15}
                  />
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={() => setViewTaskMinting(false)}>
          Exit
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
