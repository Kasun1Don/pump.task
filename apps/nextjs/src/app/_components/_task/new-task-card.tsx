"use client";

import React from "react";

import { api } from "~/trpc/react"; // Ensure you import your API hook
import TaskCardDialog from "./task-card-dialog";

interface TaskCardData {
  title: string;
  description: string;
  dueDate: Date | null;
  status: "To Do" | "In Progress" | "In QA" | "Done" | "Approved";
  assignee: string;
  tags: {
    defaultTags: string[];
    userGeneratedTags: string[];
  };
  customFields: {
    fieldName: string;
    fieldValue: string;
  }[];
}

const NewTaskCard: React.FC = () => {
  const addTaskMutation = api.task.addTask.useMutation(); // Initialize your mutation
  const initialValues: TaskCardData = {
    title: "",
    description: "",
    dueDate: null,
    status: "To Do",
    assignee: "Un Assigned",
    tags: {
      defaultTags: [],
      userGeneratedTags: [],
    },
    customFields: [],
  };

  const handleSubmit = async (taskData: TaskCardData) => {
    try {
      const selectedDefaultTags = taskData.tags.defaultTags;
      const selectedUserTags = taskData.tags.userGeneratedTags;

      // Prepare the data to be sent to the server
      const formattedTaskData = {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : "",
        status: taskData.status,
        assignee: taskData.assignee,
        tags: {
          defaultTags: selectedDefaultTags,
          userGeneratedTags: selectedUserTags,
        },
        customFields: taskData.customFields,
      };

      // Send the task data to the tRPC mutation
      await addTaskMutation.mutateAsync(formattedTaskData);

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
        initialValues={initialValues}
        onSubmit={handleSubmit}
        taskCardTriggerText="+ New task"
      />
    </div>
  );
};

export default NewTaskCard;
