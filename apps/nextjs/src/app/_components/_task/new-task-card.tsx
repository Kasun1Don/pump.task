"use client";

import type { z } from "zod";
import React from "react";

import type { taskCardSchema } from "./task-card-schema";
import { api } from "~/trpc/react"; // Ensure you import your API hook
import TaskCardDialog from "./task-card-dialog";

const NewTaskCard: React.FC = () => {
  const addTaskMutation = api.task.addTask.useMutation(); // Initialize your mutation

  const handleSubmit = async (taskData: z.infer<typeof taskCardSchema>) => {
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
      />
    </div>
  );
};

export default NewTaskCard;
