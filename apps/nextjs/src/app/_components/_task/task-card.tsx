"use client";

import type { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaClock } from "react-icons/fa";

import type { UserClass } from "@acme/db";
import type {
  NewTaskCard,
  ObjectIdString,
  TaskCard,
  TaskCardSchema,
} from "@acme/validators";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";
import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";
import TrashIcon from "./icons/TrashIcon";
import MintingDialog from "./MintingDialog";
import TaskCardDialog from "./task-card-dialog";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" })
    .format(date)
    .replace(" ", "-");
};

type TaskCardData = z.infer<typeof TaskCardSchema>;

interface TaskCardProps {
  task: TaskCardData;
  projectId: ObjectIdString;
  statusId: ObjectIdString;
  statusColumnName: string;
  members:
    | {
        role: string;
        userData: UserClass;
        projectId: ObjectIdString;
      }[]
    | undefined;
  currentUserWalletId: string;
}

const TaskCard = ({
  task,
  projectId,
  statusId,
  members,
  currentUserWalletId,
  statusColumnName,
}: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState("Submit");
  const [viewTaskMinting, setViewTaskMinting] = useState(false);
  const [bagsCreated, setBagsCreated] = useState(0);

  const utils = api.useUtils();

  const mutateCreateBadge = api.badge.create.useMutation({
    onSuccess: () => {
      setBagsCreated((prevCount) => prevCount + 1);
      toast.success(`Badge Minted successfully`);
      void utils.badge.getbadge.invalidate();
      void utils.task.getTaskByStatusId.invalidate();
    },
    onError: (error) => {
      toast.error("Error creating badge");
      console.error("Error creating badge:", error);
    },
  });

  const deleteTask = api.task.deleteTask.useMutation({
    onSuccess: (task) => {
      console.log("Task deleted successfully");
      void utils.task.getTaskByStatusId.invalidate();
      toast.success(`Task ${task.task.title} deleted successfully`);
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Error deleting task:", error.message);
        toast.error("Error deleting task");
      } else {
        console.error("Unknown error deleting task");
        toast.error("Unknown error deleting task");
      }
    },
  });

  const updateTaskMutation = api.task.updateTask.useMutation({
    onSuccess: (updatedTask) => {
      // Handle success
      console.log("Task updated successfully", updatedTask);
      setSubmitButtonText("Updated");
      void utils.task.getTaskByStatusId.invalidate();
      if (String(updatedTask.statusId) !== statusId) {
        toast.success(`Task moved to new status`);
      } else {
        toast.success(`Task ${updatedTask.title} updated successfully`);
      }
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error("Error creating task");
    },
  }); // Initialize your mutation

  const handleDelete = () => {
    deleteTask.mutate({ taskId: task._id });
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = async (taskData: TaskCard | NewTaskCard) => {
    try {
      console.log("running handle submit function");
      // Send the task data (validated in TaskCardDialog) to the tRPC mutation
      await updateTaskMutation.mutateAsync(taskData as TaskCard);
      void utils.task.getTaskByStatusId.invalidate();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const assignee = members?.find(
    (member) => member.userData.walletId === task.assigneeId,
  )?.userData;

  const canEdit = members?.some(
    (member) =>
      member.userData.walletId === currentUserWalletId &&
      member.projectId === projectId &&
      (member.role === "Admin" || member.role === "Owner"),
  );

  const handleMintingClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    console.log("assigned", task.assigneeId);

    if (task.assigneeId === "unassigned") {
      toast.error("Task must be assigned to a user to claim rewards");
      return;
    }

    setViewTaskMinting(true);

    let tagToBeMinted = [...task.tags.defaultTags];

    if (task.tags.userGeneratedTags.length > 0) {
      tagToBeMinted = [...tagToBeMinted, "Misc"];
    }
    try {
      for (let i = 0; i < tagToBeMinted.length; i++) {
        const tag = tagToBeMinted[i];
        await mutateCreateBadge.mutateAsync({
          taskId: task._id,
          walletId: task.assigneeId ?? "",
          tags: [tag ?? ""],
          receivedDate: new Date(),
        });

        // Add delay only if it's not the last iteration
        if (i < tagToBeMinted.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }
      }

      updateTaskMutation.mutate({
        ...task,
        isMinted: true,
      });

      toast.success("All Rewards Minted Successfully");
    } catch (error) {
      console.error("Error creating badges:", error);
    }
  };

  return (
    <div {...attributes} ref={setNodeRef} {...listeners} style={style}>
      <TaskCardDialog
        members={members}
        loading={updateTaskMutation.isPending}
        initialValues={task}
        projectId={projectId}
        statusId={statusId}
        onSubmit={handleSubmit}
        submitButtonText={submitButtonText}
        setSubmitButtonTextState={setSubmitButtonText}
        isEditable={canEdit} //conditional based on user role
        dialogTrigger={
          <div className="group relative max-w-[350px] rounded-2xl border border-zinc-900 bg-zinc-950 p-4 text-white drop-shadow-md hover:cursor-pointer hover:border-[#27272a] hover:bg-[#0d0d0f]">
            {/* Delete Icon */}
            <button
              className="absolute right-2 top-2 stroke-gray-500 opacity-0 transition-opacity duration-300 hover:stroke-rose-500 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the TaskCardDialog
                setIsDeleteModalOpen(true); // Open the Delete Confirmation Dialog
              }}
              aria-label="Delete Task"
            >
              <TrashIcon />
            </button>

            <div className="mb-3 flex flex-wrap gap-2">
              {task.tags.defaultTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-300 px-2 py-1 text-xs text-black"
                >
                  {tag}
                </span>
              ))}
              {task.tags.userGeneratedTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-indigo-400 px-2 py-1 text-xs text-black"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="line-clamp-2 text-sm text-zinc-400">
              {task.description}
            </p>

            {task.isMinted && statusColumnName === "Approved" ? (
              <Button
                className="bg-zesty-green hover:bg-zesty-green mt-3 h-6 px-1 py-0 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewTaskMinting(true);
                }}
              >
                Rewards Claimed
              </Button>
            ) : statusColumnName === "Approved" ? (
              <Button
                className="bg-labrys-s hover:bg-labrys-s mt-3 h-6 px-1 py-0 text-xs"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  handleMintingClick(e)
                }
              >
                Claim Rewards
              </Button>
            ) : null}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {assignee?.image && (
                  <Image
                    src={assignee.image}
                    alt="Assignee Avatar"
                    width={12}
                    height={12}
                    onError={(e) => {
                      console.log("Error loading image", e);
                      e.currentTarget.src = "/userIcons/green.png";
                    }}
                  />
                )}
                <span className="text-sm">
                  {assignee?.name ?? "Unnassigned"}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <FaClock />
                <span className="text-white">
                  {formatDate(new Date(task.dueDate))}
                </span>
              </div>
            </div>
          </div>
        }
      />

      <Dialog open={viewTaskMinting} onOpenChange={setViewTaskMinting}>
        <MintingDialog
          task={task}
          projectId={projectId}
          statusId={statusId}
          statusColumnName={statusColumnName}
          members={members}
          setViewTaskMinting={setViewTaskMinting}
          bagsCreated={bagsCreated}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              <p>Are you sure you want to remove this task?</p>
              <p>(This action cannot be undone)</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskCard;
