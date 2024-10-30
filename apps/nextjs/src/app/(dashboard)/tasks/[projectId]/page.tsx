"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { z } from "zod";

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

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);

  if (validationError) return <p>{validationError}</p>;
  if (isLoading) return <TaskBoardSkeleton />;
  if (error) return <p>Error fetching statuses: {error.message}</p>;
  if (!projectId || !project) return <TaskBoardSkeleton />;
  if ("error" in project) return <p>Error fetching project: {project.error}</p>;

  // Function to handle drag and drop of status columns
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setStatusColumns((statusColumns) => {
      const activeIndex = statusColumns.findIndex(
        (column) => column._id === active.id,
      );
      const overIndex = statusColumns.findIndex(
        (column) => column._id === over.id,
      );

      return arrayMove(statusColumns, activeIndex, overIndex);
    });
  };

  return (
    <DndContext
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
      sensors={sensors}
    >
      <SortableContext
        items={statusColumns.map((column) => column._id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="overflow-x-auto">
          <h1 className="mb-3 flex justify-center text-5xl font-extrabold leading-tight tracking-wide text-white shadow-lg">
            {project.name}
          </h1>
          <div className="flex justify-center gap-6 p-6">
            {statusColumns.map((status) => (
              <TaskStatusColumn key={status._id} statusColumn={status} />
            ))}

            <NewStatusColumn
              projectId={projectId}
              onStatusCreated={handleNewStatusCreated}
            />
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}
