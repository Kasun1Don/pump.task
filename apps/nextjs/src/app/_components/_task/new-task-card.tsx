"use client";

import type { z } from "zod";
import React from "react";

import type { ObjectIdString, TaskCardSchema } from "@acme/validators";

// import type { taskCardSchema } from "./task-card-schema";
import { api } from "~/trpc/react"; // Ensure you import your API hook
import TaskCardDialog from "./task-card-dialog";

interface NewTaskCardProps {
  projectId: ObjectIdString;
  statusId: ObjectIdString;
}

const NewTaskCard = ({ projectId, statusId }: NewTaskCardProps) => {
  const addTaskMutation = api.task.addTask.useMutation(); // Initialize your mutation
  console.log("new-task-card: statusId:", statusId);

  const handleSubmit = async (taskData: z.infer<typeof TaskCardSchema>) => {
    try {
      // Send the task data (validated in TaskCardDialog) to the tRPC mutation
      await addTaskMutation.mutateAsync(taskData);

      // Handle success
      console.log("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div>
      {/* Render the TaskCardDialog to create a new task */}
      <TaskCardDialog
        onSubmit={handleSubmit}
        dialogButtonText="+ New task"
        submitButtonText="Create task"
        projectId={projectId}
        statusId={statusId}
      />
    </div>
  );
};

export default NewTaskCard;
