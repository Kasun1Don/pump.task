"use client";

// Impor the necessary modules / hooks
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

// Import DropdownMenu components from @acme/ui/dropdown-menu
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

// Import logout function
import { logout } from "~/app/actions/authFront";

// Define the Props interface
interface NavUserDropdownProps {
  username: string;
  image: string;
}

// Define the NavUserDropdown component
export default function NavUserDropdown({
  username,
  image,
}: NavUserDropdownProps) {
  // Set the isMac state
  const [isMac, setIsMac] = useState<boolean>();

  // Check if the user is using a Mac on component mount
  useEffect(() => {
    if (navigator.platform.includes("Mac")) {
      setIsMac(true);
    }
  }, []);

  // Logout function
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const wallet = useActiveWallet();

  // Handle logout function
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
      {/* Username of the User and there Icon */}
      <DropdownMenuTrigger className="relative flex cursor-default select-none items-center rounded-md border px-4 py-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
        <div className="flex flex-row items-center gap-4">
          <Image
            className="inline-block h-4 w-4 rounded-full"
            src={image}
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

      {/* Dropdown Menu Content Profile, settings and logout function */}
      <DropdownMenuContent className="w-full min-w-full">
        <DropdownMenuItem className="flex flex-row justify-between hover:cursor-pointer">
          <div className="flex flex-row gap-4">
            <Image src="/userIcon.png" alt="userIcon" width={20} height={20} />
            <Link href="/dashboard/profile">
              <h5>My Profile</h5>
            </Link>
          </div>
          <div className="text-xxs">{isMac ? "⇧⌘P" : "⇧⌃P"}</div>
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
          <div className="text-xxs">{isMac ? "⌘S" : "⌃S"}</div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex flex-row justify-between gap-16 hover:cursor-pointer"
        >
          <div className="flex flex-row gap-4">
            <Image src="/LogoutIcon.png" alt="Logout" width={20} height={20} />
            <h5>Log out</h5>
          </div>
          <div className="text-xxs">{isMac ? "⇧Q" : "⇧⌃Q"}</div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
