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
import { toast } from "@acme/ui/toast";
import { StatusSchema, validateObjectIdString } from "@acme/validators";
import { Button } from "@acme/ui/button";

import NewStatusColumn from "~/app/_components/_task/new-status-column";
import TaskFilter from "~/app/_components/_task/task-filter";
import TaskStatusColumn from "~/app/_components/_task/task-status-column";
import TaskBoardSkeleton from "~/app/_components/_task/TaskBoardLoader";
import { api } from "~/trpc/react";

export default function TasksPage({
  params,
}: {
  params: { projectId: string };
}) {
  const [statusColumns, setStatusColumns] = useState<StatusColumn[]>([]);
  const [projectId, setProjectId] = useState<ObjectIdString | null>(
    params.projectId as ObjectIdString,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);

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

  const utils = api.useUtils();

  const updateStatusOrder = api.status.updateOrder.useMutation({
    onSuccess: () => {
      toast.success("Status order updated successfully");
      // invalidate and refetch the statuses
      void utils.status.getStatusesByProjectId.invalidate({
        projectId: projectId as string,
      });
    },
    onError: (error) => {
      toast.error(`Failed to update status order: ${error.message}`);
    },
  });

  // Retrieve the project object by projectId
  const { data: project } = api.project.byId.useQuery(
    { id: projectId as string },
    { enabled: Boolean(projectId) },
  );

  // Retrieve status columns
  const {
    data: statusData,
    error,
    isLoading,
  } = api.status.getStatusesByProjectId.useQuery(
    {
      projectId: projectId as string,
    },
    {
      enabled: Boolean(projectId), // Only run query if projectId is valid
    },
  );

  const { data: members, error: membersError } =
    api.member.byProjectId.useQuery(
      {
        projectId: projectId as string,
      },
      {
        enabled: Boolean(projectId),
      },
    );

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(mouseSensor);

  useEffect(() => {
    if (statusData) {
      const validationResult = StatusSchema.array().safeParse(statusData);
      if (validationResult.success) {
        const statuses = validationResult.data;

        // Find the 'Approved' column and move it to the end
        const approvedColumnIndex = statuses.findIndex(
          (col) => col.name === "Approved" && col.isProtected,
        );
        if (approvedColumnIndex !== -1) {
          const approvedColumn = statuses.splice(approvedColumnIndex, 1)[0]; // Remove 'Approved' column
          if (approvedColumn) {
            statuses.push(approvedColumn); // Add it to the end
          }
        }
        setStatusColumns(statuses);
      } else {
        console.error("Validation error:", validationResult.error.errors);
      }
    }
  }, [statusData]);

  // Callback function to handle when a new status column is created
  const handleNewStatusCreated = (newStatus: StatusColumn) => {
    setStatusColumns((prevStatusColumns) => {
      // find the protected column
      const approvedColumnIndex = prevStatusColumns.findIndex(
        (col) => col.name === "Approved" && col.isProtected,
      );

      if (approvedColumnIndex === -1) {
        // No 'Approved' column found, append to the end
        return [...prevStatusColumns, newStatus];
      }

      // insert the new status before the protected column
      return [
        ...prevStatusColumns.slice(0, approvedColumnIndex),
        newStatus,
        ...prevStatusColumns.slice(approvedColumnIndex),
      ];
    });
  };

  if (membersError) {
    return (
      <p>
        Error fetching members:{" "}
        {membersError instanceof Error ? membersError.message : "Unknown error"}
      </p>
    );
  }

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

  // Get wallet ID from cookie
  const cookieWallet = document.cookie
    .split("; ")
    .find((row) => row.startsWith("wallet="))
    ?.split("=")[1];

  const user = api.user.byWallet.useSuspenseQuery({
    walletId: cookieWallet ?? "",
  });
  const [userMemberships] = api.member.byUserId.useSuspenseQuery(
    {
      userId: user[0]._id,
    },
    {
      //fetch the latest members without requiring a page reload (required for member permissions)
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  );

  const isOwner = () => {
    return userMemberships.some(
      (member) =>
        member.projectId === projectId &&
        (member.role === "Owner" || member.role === "Admin"),
    );
  };

  const requestAccess = api.email.requestAccess.useMutation({
    onSuccess: () => {
      toast.success("Access request sent successfully");
      setIsRequestingAccess(false);
    },
    onError: () => {
      toast.error("Failed to send access request");
      setIsRequestingAccess(false);
    },
  });

  const isMember = userMemberships.some(
    (member) => member.projectId === projectId
  );

  if (validationError) return <p>{validationError}</p>;
  if (isLoading) return <TaskBoardSkeleton />;
  if (error) return <p>Error fetching statuses: {error.message}</p>;
  if (!projectId || !project) return <TaskBoardSkeleton />;
  if ("error" in project) return <p>Error fetching project: {project.error}</p>;

  // Function to handle drag and drop of status columns
  // over is the column that the active column is being dragged over
  // active is the column that is being dragged
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // find the active column
    const activeColumn = statusColumns.find((col) => col._id === active.id);
    const overColumn = statusColumns.find((col) => col._id === over.id);

    // prevent moving protected columns or moving columns to protected position
    if (activeColumn?.isProtected || overColumn?.isProtected) return;

    setStatusColumns((statusColumns) => {
      const activeIndex = statusColumns.findIndex(
        (column) => column._id === active.id,
      );
      const overIndex = statusColumns.findIndex(
        (column) => column._id === over.id,
      );

      const newOrder = arrayMove(statusColumns, activeIndex, overIndex);

      // Update the order on the server
      updateStatusOrder.mutate({
        projectId: projectId as string,
        statusIds: newOrder.map((status) => status._id),
      });

      return newOrder;
    });
  };

  // responsive scrolling for the task board
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
        <div className="flex h-[calc(100vh-12rem)] flex-col">
          <div className="relative flex items-center justify-center">
          {!isMember && !project.isPrivate && (
              <div className="absolute-left left-0 top-4 px-2">
                <Button
                  onClick={async (e) => {
                    e.preventDefault();
                    setIsRequestingAccess(true);
                    
                    // Get the project owner's email
                    const owner = members?.find(member => member.role === "Owner");
                    if (!owner?.userData.email) {
                      toast.error("Project owner has not set an email address");
                      setIsRequestingAccess(false);
                      return;
                    }

                    if (!user[0].email) {
                      toast.error("Please add an email address to your profile to request access");
                      setIsRequestingAccess(false);
                      return;
                    }

                    // Log the email request details
                    console.log("Access Request Details:", {
                      projectId,
                      requesterEmail: user[0].email,
                      requesterName: (user[0].name ?? user[0].walletId) ?? "Unknown User",
                      ownerEmail: owner.userData.email,
                      projectName: project.name,
                    });

                    await requestAccess.mutateAsync({
                      projectId: projectId as string,
                      requesterEmail: user[0].email,
                      requesterName: (user[0].name ?? user[0].walletId) ?? "Unknown User",
                      ownerEmail: owner.userData.email,
                      projectName: project.name,
                    });
                  }}
                  disabled={isRequestingAccess}
                  className="bg-[#72D524] text-[#18181B] hover:bg-[#5CAB1D]"
                  size="sm">
                  {isRequestingAccess ? "Sending Request..." : "Request Access"}
                </Button>
              </div>
            )}
            <div className="mb-3 flex-1 justify-center">
              {isEditing && isOwner() ? (
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={40}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={() => {
                      if (editedName.trim() && editedName !== project.name) {
                        updateProjectName.mutate({
                          projectId: projectId as string,
                          name: editedName.trim(),
                        });
                      } else {
                        setIsEditing(false);
                        setEditedName(project.name);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur();
                      } else if (e.key === "Escape") {
                        setIsEditing(false);
                        setEditedName(project.name);
                      }
                    }}
                    className="border-b border-gray-500 bg-transparent text-center text-5xl font-extrabold text-white outline-none focus:border-[#72D524]"
                    autoFocus
                  />
                </div>
              ) : (
                <h1
                  onDoubleClick={() => {
                    // only allow editing if the user is an owner or admin
                    if (isOwner()) {
                      setIsEditing(true);
                      setEditedName(project.name);
                    }
                  }}
                  className={`text-center text-xl font-extrabold leading-tight tracking-wide text-white shadow-lg sm:text-5xl ${
                    isOwner() ? "cursor-pointer hover:opacity-80" : ""
                  }`}
                >
                  {project.name}
                </h1>
              )}
            </div>
            <div className="absolute right-0 pr-8">
              <TaskFilter
                selectedMembers={selectedMembers}
                setSelectedMembers={setSelectedMembers}
                projectId={projectId}
                members={
                  members?.map((member) => ({
                    ...member,
                    projectId: projectId,
                  })) ?? []
                }
              />
            </div>
            
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex min-w-max gap-6 p-6">
              {statusColumns.map((status) => (
                <TaskStatusColumn
                  key={status._id}
                  statusColumn={status}
                  members={
                    members?.map((member) => ({
                      ...member,
                      projectId: projectId,
                    })) ?? []
                  }
                  selectedMembers={selectedMembers}
                />
              ))}
              {
                <NewStatusColumn
                  projectId={projectId}
                  onStatusCreated={handleNewStatusCreated}
                  disabled={!isOwner()}
                />
              }
            </div>
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}
