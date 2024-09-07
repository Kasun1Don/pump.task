"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

export default function GlobalNavbarLayout(props: {
  children: React.ReactNode;
}) {
  /**
   * This is a mockup of the data that would be passed to the Navbar component just so that we can see how it would look.
   */
  const username = "Ben Davies";

  interface Project {
    projectName: string;
    projectIcon: string;
  }

  const projects: Project[] = [
    { projectName: "Project 1", projectIcon: "projectImage1" },
    { projectName: "Project 2", projectIcon: "projectImage2" },
    { projectName: "Project 3", projectIcon: "projectImage3" },
  ];
  // This is the current project state that is being displayed in the project dropdown
  const [currentProjectState, setCurrentProjectState] = useState(
    projects[0]?.projectName ?? "",
  );

  return (
    <div>
      <div className="flex flex-row justify-between gap-4 px-12 py-8">
        {/* This is the Pump Logo */}
        <div className="flex flex-row items-center justify-center gap-8">
          <div className="flex flex-row gap-4 text-xl">
            <Image
              src="/PumpLogo.png"
              alt="Chevron Down"
              width={26}
              height={18}
            />
            <h1 className="text-2xl font-bold">pump.task</h1>
          </div>
          <h5 className="h-fit rounded-md bg-zinc-800 px-2 py-1 text-xs text-lime-500">
            Web3 Project Tracker
          </h5>
        </div>

        {/* This is the Project dropdown Menu. Quick note will probably make this conditional rendered in the future so if users don't have any projects it just renders a button to create a new project. */}
        <div className="flex gap-10 hover:cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex cursor-default select-none items-center rounded-md border px-4 py-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
              <div className="flex flex-row items-center gap-4">
                <Image
                  className="inline-block h-4 w-4 rounded-full"
                  src="/badge.png"
                  alt="badge"
                  width={12}
                  height={12}
                />
                <h6 className="text-sm">{currentProjectState}</h6>
                <Image
                  src="/chevron-down.svg"
                  alt="Chevron Down"
                  width={16}
                  height={16}
                />
              </div>
            </DropdownMenuTrigger>

            {/* This is the map function to display the users projects inside the projects drop down menu*/}
            <DropdownMenuContent>
              {projects.map((project, index) => (
                <DropdownMenuItem
                  className="flex flex-row items-center gap-4 hover:cursor-pointer"
                  key={index}
                  onClick={() => setCurrentProjectState(project.projectName)}
                >
                  <div className="flex flex-row items-center gap-4 hover:cursor-pointer">
                    <Image
                      className="inline-block h-5 w-5 rounded-full"
                      src="/badge.png"
                      alt="badge"
                      width={20}
                      height={20}
                    />
                    <h1 className="text-sm">{project.projectName}</h1>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:cursor-pointer">
                Create New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* This is the users Drop down Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative flex cursor-default select-none items-center rounded-md border px-4 py-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
              <div className="flex flex-row items-center gap-4">
                <Image
                  className="inline-block h-4 w-4 rounded-full"
                  src="/userProfileIcon.png"
                  alt="badge"
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
            <DropdownMenuContent>
              <DropdownMenuItem className="flex flex-row justify-between hover:cursor-pointer">
                <div className="flex flex-row gap-4">
                  <Image
                    src="/userIcon.png"
                    alt="userIcon"
                    width={20}
                    height={20}
                  />
                  <h5>Profile</h5>
                </div>
                <Image
                  src="/ProfileShortcut.png"
                  alt="Profile"
                  width={32}
                  height={32}
                />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row justify-between gap-16 hover:cursor-pointer">
                <div className="flex flex-row gap-4">
                  <Image
                    src="/SettingsIcon.png"
                    alt="Settings"
                    width={20}
                    height={20}
                  />
                  <h5>Settings</h5>
                </div>
                <Image
                  src="/SettingShortcut.png"
                  alt="Settings"
                  width={20}
                  height={20}
                />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row justify-between gap-16 hover:cursor-pointer">
                <div className="flex flex-row gap-4">
                  <Image
                    src="/LogoutIcon.png"
                    alt="Chevron Down"
                    width={20}
                    height={20}
                  />
                  <h5>Log out</h5>
                </div>
                <Image
                  src="/LogoutShortcut.png"
                  alt="Chevron Down"
                  width={32}
                  height={32}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* This is the navigation bar at the bottom of the display it just creates links to each page */}
      <div className="flex flex-wrap border-b-2">
        <Link
          href="/dashboard/projects"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          Projects
        </Link>
        <Link
          href="/dashboard/tasks"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          Tasks
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          My Profile
        </Link>
        <Link
          href="/dashboard/users"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          Users
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex h-8 w-32 items-center justify-center text-center text-lg text-slate-500 hover:border-b-2 hover:border-white hover:text-slate-50"
        >
          Settings
        </Link>
      </div>

      {/* This just specifies where the children components will be rendered in application */}
      {props.children}
    </div>
  );
}
