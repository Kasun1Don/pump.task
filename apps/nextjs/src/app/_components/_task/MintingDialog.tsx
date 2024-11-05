import type { Dispatch, SetStateAction } from "react";
import type { z } from "zod";
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

import { api } from "~/trpc/react";

type TaskCardData = z.infer<typeof TaskCardSchema>;

// Interface for TaskCardProps
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
}

// Extended interface for MintingDialog props
interface MintingDialogProps extends TaskCardProps {
  setViewTaskMinting: Dispatch<SetStateAction<boolean>>;
  bagsCreated: number;
}

// MintingDialog component
export default function MintingDialog({
  task,
  setViewTaskMinting,
  bagsCreated,
}: MintingDialogProps) {
  const getBadges = api.badge.getbadge.useQuery(task._id);
  const tagTotitles = {
    Frontend: "Frontend Beast",
    Backend: "Backend Master",
    Design: "Design Specialist",
    "Smart Contracts": "Smart Contract Wizz",
    Integration: "Integration Legend",
    Javascript: "Javascript Ninja",
    Misc: "Misc",
  };

  // Function to get transaction hash based on tag
  const tranHash = (tag: string): string => {
    const title = tagTotitles[tag as keyof typeof tagTotitles];
    if (!getBadges.data || getBadges.isError) {
      return "Error Fetching Transaction Hash";
    }
    const badge = getBadges.data.find((item) => item.NFTTitle === title);

    if (!badge) {
      return "Loading...";
    }
     
    return badge.transactionHash ?? "Error";
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
          <div className="flex flex-col justify-center">
            <span className="pb-4 text-base">{tag}</span>
            <Link
              className="flex flex-col"
              target="_blank"
              href={`https://sepolia.etherscan.io/tx/${tranHash(tag)}`}
            >
              Transaction Hash:
              <div className="flex gap-2 text-xs hover:cursor-pointer hover:underline">
                {tranHash(tag).slice(0, 30)}..
                <Image
                  src={"/external-link-svgrepo-com.svg"}
                  alt="Link to user's profile"
                  height={15}
                  width={15}
                />
              </div>
            </Link>
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
