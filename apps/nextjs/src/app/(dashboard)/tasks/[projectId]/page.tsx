"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "@acme/ui/toast";

import type { ObjectIdString, StatusColumn } from "@acme/validators";
import { StatusSchema, validateObjectIdString } from "@acme/validators";

import NewStatusColumn from "~/app/_components/_task/new-status-column";
import TaskStatusColumn from "~/app/_components/_task/task-status-column";
import TaskBoardSkeleton from "~/app/_components/_task/TaskBoardLoader";

import { api } from "~/trpc/react";

export default function TasksPage({
  params,
}: {
  params: { projectId: string };
}) {
  // const [tasks, setTasks] = useState<TaskCardData[]>([]);
  // const [project, setProject] = useState<Project>();
  const [statusColumns, setStatusColumns] = useState<StatusColumn[]>([]);
  const [projectId, setProjectId] = useState<ObjectIdString | null>(
    params.projectId as ObjectIdString,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  // // Retrieve projectId from URL
  // const rawProjectId = searchParams.get("projectId");

  // Validate projectId inside useEffect
  useEffect(() => {
    try {
      // Validate projectId once during the component lifecycle
      const validatedProjectId = validateObjectIdString(projectId, "projectId");
      setProjectId(validatedProjectId);
      setValidationError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError("Invalid project ID");
      } else {
        console.error(error);
        setValidationError("An unexpected error occurred");
      }
    }
  }, [projectId]);

  // Retrieve the project object by projectId
  const { data: project } = api.project.byId.useQuery(
    { id: projectId as string },
    { enabled: Boolean(projectId) },
  );

  // useEffect(() => {
  //   if (projectData) {
  //     // Validate projectData using Zod schema
  //     const validationResult = ProjectSchema.safeParse(projectData);

  //     if (validationResult.success) {
  //       console.log("current project:", validationResult.data);
  //       setProject(validationResult.data);
  //     } else {
  //       console.error("Validation error:", validationResult.error.errors);
  //       setValidationError("Invalid project data");
  //     }
  //   }
  // }, [projectData]);

  // Retrieve status columns
  const {
    data: statusData,
    error,
    isLoading,
  } = api.task.getStatusesByProjectId.useQuery(
    {
      projectId: projectId as string,
    },
    {
      enabled: Boolean(projectId), // Only run query if projectId is valid
    },
  );

  useEffect(() => {
    if (statusData) {
      const validationResult = StatusSchema.array().safeParse(statusData);

      if (validationResult.success) {
        const statusColumnsCopy = [...validationResult.data]; // Create a copy of the array

        // Remove the status column at index 0 (which has isProtected flag)
        const protectedColumn = statusColumnsCopy.shift();

        // If the protected column exists, push it to the end
        if (protectedColumn?.isProtected) {
          statusColumnsCopy.push(protectedColumn);
        }

        setStatusColumns(statusColumnsCopy);
      } else {
        console.error("Validation error:", validationResult.error.errors);
      }
    }
  }, [statusData]);

  // Callback function to handle when a new status column is created
  const handleNewStatusCreated = (newStatus: StatusColumn) => {
    setStatusColumns((prevStatusColumns) => {
      const statusColumnsCopy = [...prevStatusColumns]; // Create a copy of the array

      // Remove the status column at index 0 (which has isProtected flag)
      const protectedColumn = statusColumnsCopy.shift();

      // Add the new status column
      statusColumns.push(newStatus);

      // If the protected column exists, push it to the end
      if (protectedColumn?.isProtected) {
        statusColumnsCopy.push(protectedColumn);
      }

      return statusColumnsCopy;
    });
  };

  const utils = api.useUtils();

  const updateProjectName = api.project.updateName.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      // refresh the data by invalidating the old project query
      void utils.project.byId.invalidate({ id: projectId as string });
      toast.success("Project name updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update project name: ${error.message}`);
    },
  });

  if (validationError) {
    return <p>{validationError}</p>;
  }

  if (isLoading) {
    // Display skeleton loading screen for status columns
    return <TaskBoardSkeleton />;
  }

  if (error) {
    return <p>Error fetching statuses: {error.message}</p>;
  }

  if (!projectId || !project) {
    return <TaskBoardSkeleton />;
  }

  if ("error" in project) {
    return <p>Error fetching project: {project.error}</p>;
  }

  // responsive scrolling for the task board
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex justify-center">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={() => {
              if (editedName.trim() && editedName !== project.name) {
                updateProjectName.mutate({
                  projectId: projectId as string,
                  name: editedName.trim()
                });
              } else {
                setIsEditing(false);
                setEditedName(project.name);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              } else if (e.key === 'Escape') {
                setIsEditing(false);
                setEditedName(project.name);
              }
            }}
            className="bg-transparent text-5xl font-extrabold text-white text-center border-b border-gray-500 focus:border-[#72D524] outline-none"
            autoFocus
          />
        ) : (
          <h1 
            onDoubleClick={() => setIsEditing(true)}
            className="text-5xl font-extrabold leading-tight tracking-wide text-white shadow-lg cursor-pointer hover:opacity-80"
          >
            {project.name}
          </h1>
        )}
      </div>
      <div className="flex-1 overflow-x-auto">
        <div className="flex min-w-max gap-6 p-6">
          {statusColumns.map((status) => (
            <TaskStatusColumn key={status._id} statusColumn={status} />
          ))}
          <NewStatusColumn
            projectId={projectId}
            onStatusCreated={handleNewStatusCreated}
          />
        </div>
      </div>
    </div>
  );
}
