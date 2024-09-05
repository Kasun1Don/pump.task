"use client";

import { useState } from "react";
import Image from "next/image";

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

  const [currentProjectState, setCurrentProjectState] = useState(
    projects[0]?.projectName ?? "",
  );

  return (
    <div>
      <div className="flex flex-row justify-between gap-4 px-12 py-12">
        <div className="flex flex-row justify-center gap-20 align-middle">
          <div className="flex flex-row gap-4 text-3xl">
            <Image
              src="/PumpLogo.png"
              alt="Chevron Down"
              width={36}
              height={36}
            />
            <h1 className="font-bold">pump.task</h1>
          </div>
          <h5 className="h-fit rounded-md bg-zinc-800 px-3 py-1 text-lime-500">
            Web3 Project Tracker
          </h5>
        </div>
        <div className="flex gap-20 hover:cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger className="align flex flex-row justify-between gap-7">
              <div className="flex flex-row gap-4">
                <Image
                  className="inline-block h-5 w-5 rounded-full"
                  src="/badge.png"
                  alt="badge"
                  width={20}
                  height={20}
                />
                <h6>{currentProjectState}</h6>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {projects.map((project, index) => (
                <DropdownMenuItem
                  className="flex flex-row justify-start align-middle"
                  key={index}
                  onClick={() => setCurrentProjectState(project.projectName)}
                >
                  <div className="flex h-8 flex-row justify-start gap-4 align-middle hover:cursor-pointer">
                    <Image
                      className="inline-block h-5 w-5 rounded-full"
                      src="/badge.png"
                      alt="badge"
                      width={20}
                      height={20}
                    />
                    <h1 className="text-base">{project.projectName}</h1>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:cursor-pointer">
                Create New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="align flex flex-row justify-between gap-7">
              <div className="flex flex-row gap-4">
                <Image
                  className="inline-block h-5 w-5 rounded-full"
                  src="/profileimage1.png"
                  alt="badge"
                  width={20}
                  height={20}
                />
                <h6>{username}</h6>
              </div>

              <Image
                src="/chevron-down.svg"
                alt="Chevron Down"
                width={20}
                height={20}
              />
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
                  alt="Chevron Down"
                  width={30}
                  height={30}
                />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row gap-12 hover:cursor-pointer">
                <div className="flex flex-row gap-4">
                  icon <h5>Settings</h5>
                </div>
                <h6>Shortcut</h6>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-row gap-12 hover:cursor-pointer">
                <div className="flex flex-row gap-4">
                  icon <h5>Log out</h5>
                </div>
                <h6>Shortcut</h6>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {props.children}
    </div>
  );
}
