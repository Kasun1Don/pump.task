"use client";

// import { CreatePostSchema } from "@acme/validators";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import { toast } from "@acme/ui/toast";

import { revalidate } from "~/app/actions/revalidate";
import { api } from "~/trpc/react";

export function EditMember({
  projectId,
  walletId,
  isOwner,
}: {
  projectId: string;
  walletId: string;
  isOwner: boolean;
}) {
  const router = useRouter();

  const removeMember = api.project.removeMember.useMutation({
    onSuccess: async () => {
      await revalidate(`/users/${projectId}`);
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "UNAUTHORIZED"
          ? "You must be logged in to post"
          : "Failed to create post",
      );
    },
  });

  function handleRemove() {
    removeMember.mutate({ walletId, projectId });
  }

  function handleViewProfile() {
    router.push(`/profile/${walletId}`);
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative flex w-auto cursor-default select-none items-center rounded-md border px-4 py-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          ...
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleViewProfile}>
            View Profile
          </DropdownMenuItem>
          {!isOwner && (
            <DropdownMenuItem onClick={handleRemove}>Remove</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
