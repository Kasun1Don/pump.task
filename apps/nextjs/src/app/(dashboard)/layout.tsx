// Import React and Next.js modules
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

// Import UserClass and ProjectClass from Typegoose models
import type { ProjectClass, UserClass } from "@acme/db";
import { Button } from "@acme/ui/button";

// Import api for trpc backend calls from a client component
import { api } from "~/trpc/server";
// Import Client Components
import HotKeyEventListeners from "../_components/_navbar/HotKeyEventListeners";
import NavLink from "../_components/_navbar/NavLink";
import NavProjectDropdown from "../_components/_navbar/NavProjectDropdown";
import NavUserDropdown from "../_components/_navbar/NavUserDropdown";

/**
 * @author Benjamin davies
 *
 * @description
 * This component is used to create the Layout component that is used in the Dashboard. The Layout component is used to create the Navbar. The Layout component is used to wrap the content of the Dashboard and provide a consistent layout for all children routes.
 *
 *
 * @returns The Layout Component including the Navbar and the children components.
 */
export default async function Layout({ children }: { children: ReactNode }) {
  const projectIdCookie = cookies().get("projectId");
  const projectId = projectIdCookie?.value;
  // Get wallet ID from cookies
  const walletId: string = cookies().get("wallet")?.value ?? "";

  // Log error if wallet ID is not found
  if (!walletId) {
    console.error("Wallet ID is undefined or not found in cookies.");
  }

  // Fetch user data with wallet ID
  const response = await api.user.byWallet({ walletId });

  // Destructure user data from response
  const userData: UserClass | null = response as unknown as UserClass;

  return (
    <section className="bg-custom-bg min-h-screen bg-cover bg-center">
      {/* Navbar section */}
      <div className="fixed left-0 right-0 top-0 z-10">
        <div className="flex flex-row justify-between gap-4 bg-zinc-950 px-12 pb-2 pt-5">
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

          {/* Navbar section right-hand side */}
          <div className="mt-1 flex max-h-8 gap-10 hover:cursor-pointer">
            {/* Pass projects to Project dropdown make sure to add ProjectClass */}
            {userData.projects ? (
              <NavProjectDropdown
                projects={userData.projects as ProjectClass[]}
              />
            ) : (
              <Link href="/projects">
                <Button className="hover:bg-zesty-green h-fit rounded-md bg-zinc-800 px-8 py-[0.375em] text-sm text-lime-500 hover:bg-opacity-50 hover:text-white">
                  Start a Project...
                </Button>
              </Link>
            )}
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
          <NavLink href={projectId ? `/users/${projectId}` : "/missingproject"}>
            Users
          </NavLink>
          {/* <NavLink href={`/users/66fdf1c172285f6bc485b20c`}>{projectId}</NavLink> */}
          <NavLink href="/settings">Settings</NavLink>
        </div>
      </div>

      {/* Hotkeys Event Listener */}
      <HotKeyEventListeners />

      {/* Main content - adjusted margin to avoid overlap with navbar and navlinks */}
      <main>{children}</main>
    </section>
  );
}
