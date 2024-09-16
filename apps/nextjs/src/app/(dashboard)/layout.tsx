// Import React and Next.js modules
import type { ReactNode } from "react";
import Image from "next/image";

// Import UserClass and ProjectClass from Typegoose models
import type { ProjectClass, UserClass } from "@acme/db";

// Import Client Components
import HotKeyEventListeners from "../_components/navbar/HotKeyEventListeners";
import NavLink from "../_components/navbar/NavLink";
import NavProjectDropdown from "../_components/navbar/NavProjectDropdown";
import NavUserDropdown from "../_components/navbar/NavUserDropdown";
// Import createServerSideFetch Helper function
import { createServerSideFetch } from "../actions/createServerSideFetchHelper";

export default async function Layout({ children }: { children: ReactNode }) {
  // Fetch user data with server-side fetch Helper function
  const caller = await createServerSideFetch();
  const response = await caller.user.all();

  // Destructure user data from response
  const userData: UserClass | null = response[0] as UserClass;

  return (
    <div className="bg-custom-bg min-h-screen bg-cover bg-center">
      {/* Navbar section lefthand side*/}
      <div className="flex flex-row justify-between gap-4 px-12 pb-4 pt-8">
        {/* Logo and title */}
        <div className="flex flex-row items-center justify-center gap-8">
          <div className="flex flex-row gap-4 text-xl">
            <Image
              src="/pump.taskLogo.png"
              alt="Pump Task Logo"
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

        {/* Navbar section right hand side */}
        <div className="flex gap-10 hover:cursor-pointer">
          {/* Pass projects to Project dropdown make sure to add ProjectClass */}
          <NavProjectDropdown projects={userData.projects as ProjectClass[]} />
          {/* Pass user data to User dropdown */}
          <NavUserDropdown
            username={userData.name ?? ""}
            image={userData.image ?? ""}
          />
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex flex-wrap border-b-2">
        <NavLink href="/projects">Projects</NavLink>
        <NavLink href="/tasks">Tasks</NavLink>
        <NavLink href="/profile">My Profile</NavLink>
        <NavLink href="/users">Users</NavLink>
        <NavLink href="/settings">Settings</NavLink>
      </div>

      {/* Hotkeys Event Listener */}
      <HotKeyEventListeners />

      {/* Where the page content will be rendered */}
      <main>{children}</main>
    </div>
  );
}
