"use client";

import { useState } from "react";
import Image from "next/image";

import type { ProjectClass } from "@acme/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

interface NavProjectDropdownProps {
  projects: ProjectClass[];
}

export default function NavProjectDropdown({
  projects,
}: NavProjectDropdownProps) {
  const [currentProject, setCurrentProject] = useState(
    projects[0]?.name ?? "No Projects Available",
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
          <h6 className="text-sm">{currentProject}</h6>
          <Image
            src="/chevron-down.svg"
            alt="Chevron Down"
            width={16}
            height={16}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {projects.length > 0 ? (
          projects.map((project) => (
            <DropdownMenuItem
              key={project.name}
              className="flex flex-row items-center gap-4 hover:cursor-pointer"
              onClick={() => setCurrentProject(project.name ?? "")}
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
        <DropdownMenuItem className="hover:cursor-pointer">
          Create New Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
