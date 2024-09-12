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

// import { api } from "~/trpc/react";

export default function NavProjectDropdown() {
  /**
   * This is a mockup of the data that would be passed to the Navbar component just so that we can see how it would look.
   */
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
  );
}
