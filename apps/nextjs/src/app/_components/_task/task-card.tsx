"use client";

// http://localhost:3000/tasks?projectId=670e203762de6de8e32ed93b
import type { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

import { api } from "~/trpc/react";
import TrashIcon from "./icons/TrashIcon";
import TaskCardDialog from "./task-card-dialog";

type TaskCardData = z.infer<typeof TaskCardSchema>;

interface TaskCardProps {
  task: TaskCardData;
  projectId: ObjectIdString;
  statusId: ObjectIdString;
}

const TaskCard = ({ task, projectId, statusId }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const utils = api.useUtils();

  const deleteTask = api.task.deleteTask.useMutation({
    onSuccess: () => {
      console.log("Task deleted successfully");
      void utils.task.getTaskByStatusId.invalidate();
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Error deleting task:", error.message);
      } else {
        console.error("Unknown error deleting task");
      }
    },
  });

  const updateTaskMutation = api.task.updateTask.useMutation({
    onSuccess: (updatedTask) => {
      // Handle success
      console.log("Task updated successfully", updatedTask);
      void utils.task.getTaskByStatusId.invalidate(); // Invalidate tasks and refresh data
    },
    onError: (error) => {
      console.error("Error creating task:", error);
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
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div {...attributes} ref={setNodeRef} {...listeners} style={style}>
      <TaskCardDialog
        initialValues={task}
        projectId={projectId}
        statusId={statusId}
        onSubmit={handleSubmit}
        isEditable={true} // Need to change this to be conditional based on user role
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

            <div className="mb-3 flex space-x-2">
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

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Image
                  src="/userProfileIcon.png"
                  alt="Assignee Avatar"
                  width={12}
                  height={12}
                />
                <span className="text-sm">{task.assigneeId}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <span>🕒</span>
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        }
      />

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
