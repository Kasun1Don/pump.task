import type { ReactNode } from "react";
import Image from "next/image";

import HotKeyEventListeners from "../_components/navbar/HotKeyEventListeners";
import NavLink from "../_components/navbar/NavLink";
import NavProjectDropdown from "../_components/navbar/NavProjectDropdown";
import NavUserDropdown from "../_components/navbar/NavUserDropdown";
import { createServerSideFetch } from "../actions/createServerSideFetchHelper";

// Interface definitions
interface Projects {
  _id: string; // Mongo ID
  name: string;
  user: string;
  image: string;
}

interface User {
  walletId: string;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  projects: Projects[];
}

// Main layout component
export default async function Layout({ children }: { children: ReactNode }) {
  // Fetch user data

  /*
    This is an example of how to use the createServerSideFetch helper function.
    The helper function automatically sets the correct headers for the server-side API.

    At the momemnt, the user.all() function returns all of the users in the database. so in order get the current user's data, we need to get the first user in the array.

  */
  const caller = await createServerSideFetch();

  const response = (await caller.user.all()) as User[] | null;

  const userData: User = response?.[0] ?? {
    walletId: "",
    name: "",
    email: "",
    image: "",
    emailVerified: false,
    projects: [],
  };

  return (
    <div className="bg-custom-bg min-h-screen bg-cover bg-center">
      {/* Hotkeys Event Listener */}
      <HotKeyEventListeners />

      {/* Navbar section */}
      <div className="flex flex-row justify-between gap-4 px-12 pb-4 pt-8">
        {/* Logo and title */}
        <div className="flex flex-row items-center justify-center gap-8">
          <div className="flex flex-row gap-4 text-xl">
            <Image
              src="/pump.taskLogo.png"
              alt="Chevron Down"
              width={26}
              height={18}
              className="h-auto w-auto"
            />
            <h1 className="text-2xl font-bold">pump.task</h1>
          </div>
          <h5 className="h-fit rounded-md bg-zinc-800 px-2 py-1 text-xs text-lime-500">
            Web3 Project Tracker
          </h5>
        </div>

        <div className="flex gap-10 hover:cursor-pointer">
          {/* Pass projects to Project dropdown */}
          <NavProjectDropdown projects={userData.projects} />
          {/* Pass user data to User dropdown */}
          <NavUserDropdown
            username={userData.name}
            profileImage={userData.image}
          />
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex flex-wrap border-b-2">
        <NavLink href="/dashboard/projects">Projects</NavLink>
        <NavLink href="/dashboard/tasks">Tasks</NavLink>
        <NavLink href="/dashboard/profile">My Profile</NavLink>
        <NavLink href="/dashboard/users">Users</NavLink>
        <NavLink href="/dashboard/settings">Settings</NavLink>
      </div>

      {/* Page content */}
      <main>{children}</main>
    </div>
  );
}
