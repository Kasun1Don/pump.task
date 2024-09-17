"use client";

// Import the required libraries
import { useEffect } from "react";
import Image from "next/image";

// Import ProjectClass from Typegoose models
import type { ProjectClass } from "@acme/db";
// Import Client Components from @acme/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { useCurrentProject } from "~/app/context/CurrentProjectProvider";

// Define the Props interface
interface NavProjectDropdownProps {
  projects: ProjectClass[];
}

/**
 * @description
 * This component is used to create a Project Dropdown component that is used in the Navbar.
 * It displays the user's projects and allows the user to switch between them.
 *
 * @param {NavProjectDropdownProps} { projects }
 * @returns The Project Dropdown Component including the list of projects and the option to create a new project button.
 */
export default function NavProjectDropdown({
  projects,
}: NavProjectDropdownProps) {
  // Get current project context  and set the current project
  const { currentProject, setCurrentProject } = useCurrentProject();

  // Set the current project to the first project in the on component mount
  useEffect(() => {
    setCurrentProject(projects[0]?.name ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle project change by updating the current project Context
  const handleProjectChange = (projectName: string) => {
    try {
      setCurrentProject(projectName);
      console.log(projectName);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <DropdownMenu>
      {/* The Current selected Project */}
      <DropdownMenuTrigger className="relative flex cursor-default select-none items-center rounded-md border px-4 py-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
        <div className="flex flex-row items-center gap-4">
          <Image
            className="inline-block h-4 w-4 rounded-full"
            src="/badge.png"
            alt="badge"
            width={12}
            height={12}
          />
          <h6 className="text-sm">{currentProject}</h6>
          <Image
            src="/chevron-down.svg"
            alt="Chevron Down"
            width={16}
            height={16}
          />
        </div>
      </DropdownMenuTrigger>

      {/* A map of the user's Projects */}
      <DropdownMenuContent>
        {projects.length > 0 ? (
          projects.map((project) => (
            <DropdownMenuItem
              key={project.name}
              className="flex flex-row items-center gap-4 hover:cursor-pointer"
              onClick={() => handleProjectChange(project.name ?? "")}
            >
              <Image
                className="inline-block h-5 w-5 rounded-full"
                src={project.image ?? ""}
                alt={project.name ?? ""}
                width={20}
                height={20}
              />
              <h1 className="text-sm">{project.name}</h1>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="flex flex-row items-center gap-4">
            <h1 className="text-sm">No Projects Available</h1>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {/* Create new Project Button (needs functionality) */}
        <DropdownMenuItem className="hover:cursor-pointer">
          Create New Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
