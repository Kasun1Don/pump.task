"use client";

// Import the required libraries
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";

import type { Project } from "@acme/validators";
// Import Client Components from @acme/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
// Import ProjectClass from Typegoose models
import { ProjectSchema } from "@acme/validators";

import { api } from "~/trpc/react";

// Define the Props interface
interface NavProjectDropdownProps {
  projects: string[];
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
  const activeAccount = useActiveAccount();
  const router = useRouter();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<string | undefined>(
    undefined,
  );

  // NEED TO CHANGE THIS
  const walletId = activeAccount?.address;

  // Initialize the mutation
  const updateActiveProjectsMutation =
    api.user.updateActiveProjects.useMutation({
      onSuccess: (data) => {
        console.log("Active projects updated:", data.activeProjects);
      },
      onError: (error) => {
        console.error("Error updating active projects:", error);
        // Optionally, display an error message to the user
      },
    });

  // retrieve all
  const allActiveProjects = api.useQueries((project) =>
    projects.map((id) => project.project.byId({ id: id })),
  );
  console.log("All projects call", allActiveProjects);

  // Check if any project query is loading or has an error
  const isLoading = allActiveProjects.some((query) => query.isLoading);
  const isError = allActiveProjects.some((query) => query.isError);

  useEffect(() => {
    const validatedActiveProjects = allActiveProjects
      .map((project) => {
        const validationResult = ProjectSchema.safeParse(project.data);
        console.log("Validation Result pre if statement:", validationResult);
        if (validationResult.success) {
          console.log("Validation Result", validationResult.data);
          return validationResult.data;
        }
      })
      .filter((project): project is Project => project !== undefined);

    console.log("Validated Projects:", validatedActiveProjects);

    const projectsChanged =
      validatedActiveProjects.length !== activeProjects.length ||
      validatedActiveProjects.some(
        (newProj, idx) => newProj._id !== activeProjects[idx]?._id,
      );

    if (projectsChanged) {
      setActiveProjects(validatedActiveProjects);
    }
  }, [allActiveProjects, activeProjects]);

  // Handle project change by updating the current project Context
  const handleProjectChange = async (project: Project) => {
    try {
      // Update active projects array in the state immediately for UI update
      setActiveProjects((prevProjects) => {
        // Remove the selected project if it allready exists
        const updatedProjects = prevProjects.filter(
          (p) => p._id !== project._id,
        );
        // Add the selected project at the end
        return [...updatedProjects, project];
      });
      // Update current project
      setCurrentProject(project.name);

      // Update active projects on backend
      await updateActiveProjectsMutation.mutateAsync({
        walletId: walletId ?? "",
        projectId: project._id,
      });

      // Navigate to project
      router.push(`/tasks/${project._id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating project:", error.message);
      } else {
        console.error("Error updating project:", String(error));
      }
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
          <h6 className="text-sm">
            {isLoading ? "Loading..." : currentProject ?? "Select a Project"}
          </h6>
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
        {isLoading ? (
          <DropdownMenuItem className="flex flex-row items-center gap-4">
            <h1 className="text-sm">Loading Projects...</h1>
          </DropdownMenuItem>
        ) : isError ? (
          <DropdownMenuItem className="flex flex-row items-center gap-4">
            <h1 className="text-sm text-red-500">Error loading projects</h1>
          </DropdownMenuItem>
        ) : activeProjects.length > 0 ? (
          activeProjects.map((project) => (
            <DropdownMenuItem
              key={project._id}
              className="flex flex-row items-center gap-4 hover:cursor-pointer"
              onClick={() => handleProjectChange(project)}
            >
              <Image
                className="inline-block h-5 w-5 rounded-full"
                src={project.image ?? ""}
                alt={project.name}
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
