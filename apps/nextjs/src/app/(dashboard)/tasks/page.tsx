"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

import type { ObjectIdString, StatusColumn } from "@acme/validators";
import { StatusSchema, validateObjectIdString } from "@acme/validators";

import NewStatusColumn from "~/app/_components/_task/new-status-column";
import TaskStatusColumn from "~/app/_components/_task/task-status-column";
import TaskBoardSkeleton from "~/app/_components/_task/TaskBoardLoader";
import { api } from "~/trpc/react";

export default function TasksPage() {
  // const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [statusColumns, setStatusColumns] = useState<StatusColumn[]>([]);
  const [projectId, setProjectId] = useState<ObjectIdString | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Retrieve projectId from URL
  const rawProjectId = searchParams.get("projectId");

  // Validate projectId inside useEffect
  useEffect(() => {
    try {
      // Validate projectId once during the component lifecycle
      const validatedProjectId = validateObjectIdString(
        rawProjectId,
        "projectId",
      );
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
  }, [rawProjectId]);

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

  if (!projectId) {
    return <TaskBoardSkeleton />;
  }

  return (
    <div>
      <h1 className="flex justify-center">Tasks Page ({projectId})</h1>
      <div className="flex flex-row gap-3 p-6">
        {statusColumns.map((status) => (
          <TaskStatusColumn key={status._id} statusColumn={status} />
        ))}

        <NewStatusColumn
          projectId={projectId}
          onStatusCreated={handleNewStatusCreated}
        />
      </div>
    </div>
  );
}
