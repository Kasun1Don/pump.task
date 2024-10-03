"use client";

import type { z } from "zod";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { statusSchema } from "@acme/validators";

import NewStatusColumn from "~/app/_components/_task/new-status-column";
import TaskStatusColumn from "~/app/_components/_task/task-status-column";
import { api } from "~/trpc/react";

type StatusType = z.infer<typeof statusSchema>;

export default function TasksPage() {
  const [statusColumns, setStatusColumns] = useState<StatusType[]>([]);
  const searchParams = useSearchParams();

  // Retrieve projectId from url
  const projectId = searchParams.get("projectId") ?? "";

  // Retrieve status columns
  const {
    data: statusData,
    error,
    isLoading,
  } = api.task.getStatusesByProjectId.useQuery({
    projectId,
  });

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

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error fetching statuses: {error.message}</p>;

  return (
    <div>
      <h1 className="flex justify-center">Tasks Page ({projectId})</h1>
      <div className="flex flex-row gap-3 p-6">
        {statusColumns.map((status) => {
          console.log("Status object:", status.name); // Log the whole status object
          return (
            <TaskStatusColumn
              key={status._id}
              statusTitle={status.name || "Unnamed"}
            />
          );
        })}

        <NewStatusColumn
          projectId={projectId}
          onStatusCreated={handleNewStatusCreated}
        />
      </div>
    </div>
  );
}
