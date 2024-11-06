"use client";

// filter the tasks on the task board by member name
import { FaFilter } from "react-icons/fa";

import type { UserClass } from "@acme/db";
import type { ObjectIdString } from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { api } from "~/trpc/react";

interface TaskFilterProps {
  selectedMembers: string[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<string[]>>;
  projectId: ObjectIdString | null;
  members:
    | {
        role: string;
        userData: UserClass;
        projectId: ObjectIdString;
      }[]
    | undefined;
}

export default function TaskFilter({
  selectedMembers,
  setSelectedMembers,
}: TaskFilterProps) {
  const projectId =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : undefined;

  const { data: members } = api.member.byProjectId.useQuery(
    {
      projectId: projectId ?? "",
    },
    {
      enabled: Boolean(projectId),
    },
  );

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="text-[#72D524] hover:bg-[#5CAB1D]">
          <FaFilter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by Member</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {members?.map((member) => {
          const walletId = member.userData.walletId;
          if (!walletId) return null;
          return (
            <DropdownMenuCheckboxItem
              key={walletId}
              checked={selectedMembers.includes(walletId)}
              onCheckedChange={() => handleMemberToggle(walletId)}
            >
              {member.userData.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
