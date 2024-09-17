import Image from "next/image";
import { ConnectButton } from "thirdweb/react";

import HotKeyEventListeners from "../_components/navbar/HotKeyEventListeners";
import NavLink from "../_components/navbar/NavLink";
import NavProjectDropdown from "../_components/navbar/NavProjectDropdown";
import NavUserDropdown from "../_components/navbar/NavUserDropdown";
import { createServerSideFetch } from "../actions/createServerSideFetchHelper";
import { client } from "../thirdwebClient";

export default async function GlobalNavbarLayout(props: {
  children: React.ReactNode;
}) {
  // Get the tRPC caller
  const caller = await createServerSideFetch();

  // Fetch user data using the caller
  const userData = await caller.user.all();

  // From here you can pass the userData to the children components to render the user data

  // This will show up on the server console NOT the browser console
  console.log(userData);

  return (
    <>
      <div className="bg-custom-bg min-h-screen bg-cover bg-center">
        <div className="flex flex-row justify-between gap-4 px-12 pb-4 pt-8">
          {/* This is the Pump Logo */}
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

          <ConnectButton client={client} />

          <div className="flex gap-10 hover:cursor-pointer">
            {/* Project dropdown, I should properly make this conditional in the future so if the user doesn't have any projects it renders a button to create a new project */}
            <NavProjectDropdown />
            {/* User dropdown */}
            <NavUserDropdown />
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

        {/* This is the event listener for hotkeys profile, setting, logout */}
        <HotKeyEventListeners />

        {/* Render children components */}
        {props.children}
      </div>
    </>
  );
}
