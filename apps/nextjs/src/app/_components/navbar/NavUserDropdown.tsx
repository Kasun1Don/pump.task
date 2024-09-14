"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { logout } from "~/app/actions/authFront";

interface NavUserDropdownProps {
  username: string;
  profileImage: string;
}

export default function NavUserDropdown({
  username,
  profileImage,
}: NavUserDropdownProps) {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  async function handleLogout() {
    if (wallet) {
      disconnect(wallet);
      console.log("disconnecting");
    }
    await logout();
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex cursor-default select-none items-center rounded-md border px-4 py-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
        <div className="flex flex-row items-center gap-4">
          <Image
            className="inline-block h-4 w-4 rounded-full"
            src={profileImage}
            alt="profile"
            width={12}
            height={12}
          />
          <h6 className="text-sm">{username}</h6>
          <Image
            src="/chevron-down.svg"
            alt="Chevron Down"
            width={16}
            height={16}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full min-w-full">
        <DropdownMenuItem className="flex flex-row justify-between hover:cursor-pointer">
          <div className="flex flex-row gap-4">
            <Image src="/userIcon.png" alt="userIcon" width={20} height={20} />
            <Link href="/dashboard/profile">
              <h5>My Profile</h5>
            </Link>
          </div>
          <div className="text-xxs">⇧⌘P</div>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex flex-row justify-between gap-16 hover:cursor-pointer">
          <div className="flex flex-row gap-4">
            <Image
              src="/SettingsIcon.png"
              alt="Settings"
              width={20}
              height={20}
            />
            <Link href="/dashboard/settings">
              <h5>Settings</h5>
            </Link>
          </div>
          <div className="text-xxs">⌘S</div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex flex-row justify-between gap-16 hover:cursor-pointer"
        >
          <div className="flex flex-row gap-4">
            <Image src="/LogoutIcon.png" alt="Logout" width={20} height={20} />
            <h5>Log out</h5>
          </div>
          <div className="text-xxs">⇧Q</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
