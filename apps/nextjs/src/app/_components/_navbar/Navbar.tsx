// Import React and Next.js modules
import { cookies, headers } from "next/headers";
import Image from "next/image";

// Import UserClass and ProjectClass from Typegoose models
import type { UserClass } from "@acme/db";

// Import api for trpc backend calls from a client component
import { api } from "~/trpc/server";
// Import Client Components
import HotKeyEventListeners from "./HotKeyEventListeners";
import NavLink from "./NavLink";
import NavProjectDropdown from "./NavProjectDropdown";
import NavUserDropdown from "./NavUserDropdown";

/**
 * @author Benjamin davies
 *
 * @description
 * This component is used to create the Layout component that is used in the Dashboard. The Layout component is used to create the Navbar. The Layout component is used to wrap the content of the Dashboard and provide a consistent layout for all children routes.
 *
 *
 * @returns The Layout Component including the Navbar and the children components.
 */
export default async function Navbar() {
  // const projectIdCookie = cookies().get("projectId");
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

  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");
  const pathname = "/projects";
  const url = `${protocol}://${host}${pathname}`;

  // Extract the active project IDs
  const activeProjectIds = userData.activeProjects
    ? userData.activeProjects.map((id) => String(id))
    : [];

  const projectId = userData.activeProjects
    ? userData.activeProjects[userData.activeProjects.length - 1]?.toString()
    : "";

  const hasActiveProjects = projectId ? true : false;
  console.log(hasActiveProjects);

  return (
    <>
      {/* Navbar section */}
      <div className="fixed left-0 right-0 top-0 z-10 w-screen">
        <div className="flex flex-row justify-between gap-2 bg-zinc-950 px-6 pb-2 pt-5">
          {/* Logo and title */}
          <a href={url}>
            <div className="flex cursor-pointer flex-row items-center justify-center gap-4">
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
              <h5
                className="text-zesty-green hidden h-fit rounded-md px-1 py-1 text-xs md:block"
                style={{ backgroundColor: "#72D5240F" }}
              >
                Web3 Project Tracker
              </h5>
            </div>
          </a>

          {/* Navbar section right-hand side */}
          <div className="mt-1 flex max-h-8 gap-10 hover:cursor-pointer">
            {/* Pass projects to Project dropdown make sure to add ProjectClass */}
            <div className="hidden max-w-[250px] sm:block">
              <NavProjectDropdown
                projects={activeProjectIds}
                walletId={walletId}
              />
            </div>
            {/* Pass user data to User dropdown */}
            <NavUserDropdown
              username={userData.name ?? ""}
              image={userData.image ?? ""}
            />
          </div>
        </div>

        {/* Navigation links */}
        <div className="top-24 z-40 flex flex-wrap border-b-2 bg-zinc-950 px-2">
          <div className="flex w-full flex-nowrap gap-x-2 overflow-hidden sm:w-auto sm:gap-x-4">
            <NavLink href="/projects">Projects</NavLink>
            {hasActiveProjects && (
              <NavLink href={`/tasks/${projectId}`}>Tasks</NavLink>
            )}
            <NavLink href="/profile">Profile</NavLink>
            {hasActiveProjects && (
              <NavLink
                href={projectId ? `/users/${projectId}` : "/missingproject"}
              >
                Users
              </NavLink>
            )}

            {/* <NavLink href={`/users/66fdf1c172285f6bc485b20c`}>{projectId}</NavLink> */}
            <NavLink href="/settings">Settings</NavLink>
          </div>
        </div>
      </div>

      {/* Hotkeys Event Listener */}
      <HotKeyEventListeners />
    </>
  );
}
