"use client";

// Import the required libraries
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import type { Project } from "@acme/validators";
// Import ProjectClass from Typegoose models
// Import Client Components from @acme/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { CreateProjectDialog } from "~/app/_components/_projects/create-project-dialog";
import { revalidate } from "~/app/actions/revalidate";
import { api } from "~/trpc/react";

// Define the Props interface
interface NavProjectDropdownProps {
  projects: string[];
  walletId: string;
}

// Define a union type for project result
type ProjectResult = Project | { error: string };

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
  walletId,
}: NavProjectDropdownProps) {
  console.log("--projects:", projects);
  const router = useRouter();
  const [currentProject, setCurrentProject] = useState<string>("");

  const utils = api.useUtils();

  // Use `api.useQueries` to fetch data for each project ID
  const projectQueries = api.useQueries((t) =>
    projects.map((id) => t.project.byId({ id })),
  );

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

  // Check if any of the queries are loading or have errors
  const isLoading = projectQueries.some((query) => query.isLoading);
  const isError = projectQueries.some((query) => query.isError);

  // Extract and process project data from the queries
  const projectData = projectQueries
    .map((query) => {
      const data = query.data as ProjectResult | undefined;
      if (!data) {
        return undefined;
      }
      if ("error" in data) {
        console.error("Error fetching project:", data.error);
        return undefined;
      } else {
        const project = data;
        // Process the project data to match ProjectSchema
        const processedProject: Project = {
          ...project,
          _id: project._id.toString() as string & { __brand: "ObjectIdString" },
          // Optionally, convert date fields if needed
        };
        return processedProject;
      }
    })
    .filter((project): project is Project => project !== undefined);

  // Handle project change by updating the current project state
  const handleProjectChange = async (project: Project) => {
    try {
      setCurrentProject(project.name);
      await updateActiveProjectsMutation.mutateAsync({
        walletId: walletId,
        projectId: project._id.toString(),
      });
      await utils.user.byWallet.invalidate();
      await revalidate("/");
      // Navigate to the project's task page
      router.push(`/tasks/${project._id}`);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // new state variable for the create project dialog
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  // UseEffect to set the current project when data is loaded
  useEffect(() => {
    if (!isLoading && projectData.length > 0) {
      // The currently active project ID is the last item in the projects array
      const activeProjectId = projects[projects.length - 1];
      // Find the project with this ID in projectData
      const activeProject = projectData.find(
        (project) => project._id === activeProjectId,
      );
      if (activeProject) {
        setCurrentProject(activeProject.name);
      }
    } else if (!isLoading) {
      setCurrentProject("No selected project");
    }
  }, [isLoading, projectData, projects]);

  return (
    <>
      <DropdownMenu>
        {/* The Current selected Project */}
        <DropdownMenuTrigger className="relative flex cursor-default select-none items-center rounded-md border px-4 py-2 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
          <div className="flex flex-row items-center gap-4">
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
          {isLoading ? (
            <DropdownMenuItem className="flex flex-row items-center gap-4">
              <h1 className="text-sm">Loading Projects...</h1>
            </DropdownMenuItem>
          ) : isError ? (
            <DropdownMenuItem className="flex flex-row items-center gap-4">
              <h1 className="text-sm text-red-500">Error loading projects</h1>
            </DropdownMenuItem>
          ) : projectData.length > 0 ? (
            projectData.reverse().map((project) => (
              <DropdownMenuItem
                key={project._id}
                className="flex flex-row items-center gap-4 hover:cursor-pointer"
                onClick={async () => {
                  try {
                    await handleProjectChange(project);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <h1 className="text-sm">{project.name}</h1>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem className="flex flex-row items-center gap-4">
              <h1 className="text-sm">No selected project</h1>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => setIsCreateProjectOpen(true)}
          >
            Create New Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateProjectDialog
        isModalOpen={isCreateProjectOpen}
        setIsModalOpen={setIsCreateProjectOpen}
        walletId={walletId}
      />
    </>
  );
}
