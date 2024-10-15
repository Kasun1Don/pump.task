"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

import type { ObjectIdString } from "@acme/validators";
import { statusSchema, validateObjectIdString } from "@acme/validators";

import NewStatusColumn from "~/app/_components/_task/new-status-column";
import TaskStatusColumn from "~/app/_components/_task/task-status-column";
import { api } from "~/trpc/react";

type StatusType = z.infer<typeof statusSchema>;

function isValidStatus(
  status: StatusType,
): status is StatusType & { _id: ObjectIdString } {
  return typeof status._id === "string" && status._id.length > 0;
}

export default function TasksPage() {
  // const [tasks, setTasks] = useState<TaskCardData[]>([]);
  const [statusColumns, setStatusColumns] = useState<StatusType[]>([]);
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
      projectId: projectId ?? "",
    },
    {
      enabled: Boolean(projectId), // Only run query if projectId is valid
    },
  );

  useEffect(() => {
    if (statusData) {
      const validationResult = statusSchema.array().safeParse(statusData);

      if (validationResult.success) {
        setStatusColumns(validationResult.data);
      } else {
        console.error("Validation error:", validationResult.error.errors);
      }
    }
  }, [statusData]);

  // Callback function to handle when a new status column is created
  const handleNewStatusCreated = (newStatus: StatusType) => {
    setStatusColumns((prevStatusColumns) => [...prevStatusColumns, newStatus]);
  };

  if (validationError) {
    return <p>{validationError}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching statuses: {error.message}</p>;
  }

  if (!projectId) {
    return <p>Error: Invalid project ID</p>;
  }

  return (
    <div>
      <h1 className="flex justify-center">Tasks Page ({projectId})</h1>
      <div className="flex flex-row gap-3 p-6">
        {statusColumns.filter(isValidStatus).map((status) => (
          <TaskStatusColumn
            key={status._id}
            // task={task}
            statusName={status.name || "Unnamed"}
            projectId={projectId}
            statusId={status._id}
          />
        ))}

        <NewStatusColumn
          projectId={projectId}
          onStatusCreated={handleNewStatusCreated}
        />
      </div>
    </div>
  );
}
