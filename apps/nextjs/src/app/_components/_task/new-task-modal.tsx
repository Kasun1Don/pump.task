"use client";

import React, { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";

import { cn } from "@acme/ui";
import { Button } from "@acme/ui/button";
import { Calendar } from "@acme/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";

import { api } from "~/trpc/react";

const NewTaskModal = () => {
  const defaultTags = [
    "Frontend",
    "Backend",
    "Design",
    "Smart Contracts",
    "Integration",
  ];

  // Define the type for task status
  type TaskStatus = "To Do" | "In Progress" | "In QA" | "Done" | "Approved";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [assignee, setAssignee] = useState<string>("Un Assigned");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>();

  const [customFields, setCustomFields] = useState<
    { fieldName: string; fieldValue: string }[]
  >([]);
  const [newFieldName, setNewFieldName] = useState<string>("");

  const addTaskMutation = api.task.addTask.useMutation();

  const toggleTagSelection = (tag: string) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag],
    );
  };

  const handleAddTag = () => {
    if (
      newTag.trim() &&
      !defaultTags.includes(newTag) &&
      !userTags.includes(newTag)
    ) {
      setUserTags([...userTags, newTag]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setUserTags(userTags.filter((tag) => tag !== tagToRemove));
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove)); // Remove from selected if it was selected
  };

  // Handle adding new custom field
  const handleAddField = () => {
    if (newFieldName.trim()) {
      setCustomFields((prevFields) => [
        ...prevFields,
        { fieldName: newFieldName, fieldValue: "" },
      ]);
      setNewFieldName(""); // Reset the field name input
    }
  };

  // Handle removing a custom field
  const handleRemoveField = (index: number) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };

  // Handle field value change
  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...customFields];
    if (updatedFields[index]) {
      updatedFields[index].fieldValue = value;
      setCustomFields(updatedFields);
    }
  };

  // Handle form submission to add a new task
  const handleCreateTask = async () => {
    try {
      const selectedDefaultTags = selectedTags.filter((tag) =>
        defaultTags.includes(tag),
      );

      const selectedUserTags = selectedTags.filter((tag) =>
        userTags.includes(tag),
      );

      // Prepare the data to be sent to the server
      const taskData = {
        title, // You would collect the actual title from the form
        description, // You would collect the actual description from the form
        dueDate: dueDate ? dueDate.toISOString() : "", //date?.toISOString() || "" Ensure the date is formatted correctly
        status,
        assignee,
        tags: {
          defaultTags: selectedDefaultTags,
          userGeneratedTags: selectedUserTags,
        },
        customFields: customFields,
      };

      // Send the task data to the tRPC mutation
      await addTaskMutation.mutateAsync(taskData);

      // Handle success (you can display a success message or close the dialog)
      console.log("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-h=[40px] w-full bg-transparent text-white hover:bg-[#27272a]">
          + New task
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[50vw] flex-col overflow-auto rounded-lg bg-gray-900 p-6 text-white">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>

        {/* Tags */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="mb-2">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {/* Preset Tags (Cannot be deleted) */}
            {defaultTags.map((tag) => (
              <div key={tag} className="flex items-center">
                <Button
                  onClick={() => toggleTagSelection(tag)}
                  className={`cursor-pointer rounded-md px-3 py-1 text-sm ${
                    !selectedTags.includes(tag)
                      ? "bg-gray-700 text-white"
                      : "bg-zesty-green text-black"
                  }`}
                >
                  {tag}
                </Button>
              </div>
            ))}

            {/* User-added Tags (Can be deleted) */}
            {userTags.map((tag) => (
              <div key={tag} className="flex items-center">
                <Button
                  onClick={() => toggleTagSelection(tag)}
                  className={`cursor-pointer rounded-md px-3 py-1 text-sm ${
                    !selectedTags.includes(tag)
                      ? "bg-gray-700 text-white"
                      : "bg-zesty-green text-black"
                  }`}
                >
                  {tag}
                </Button>
                {/* Remove button for user-added tags */}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}

            {/* Add New Tag Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-2 rounded-md bg-blue-400 px-3 py-1 text-sm text-black">
                  + Add Tag
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Tag</DialogTitle>
                </DialogHeader>
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter new tag"
                  className="w-full rounded-md border border-gray-300 px-2 py-1"
                />
                <DialogFooter>
                  <Button onClick={handleAddTag} className="bg-zesty-green">
                    Add Tag
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Title */}
        <div className="mb-4 flex-grow">
          <h3 className="mb-2">TITLE</h3>
          <Input
            placeholder="Enter short task title."
            className="h-24"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Input>
        </div>

        {/* Description */}
        <div className="mb-4 flex-grow">
          <h3 className="mb-2">DESCRIPTION</h3>
          <Input
            placeholder="Enter detailed task description."
            className="h-24 flex-wrap"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Input>
        </div>

        {/* Due Date */}
        <div className="mb4 flex-shrink-0">
          <h3 className="mb2">DUE DATE</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground",
                )}
              >
                <Image
                  src="/calendar.png"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="mr-2 h-4 w-4"
                />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Status and Assignee */}
        <div className="mb-6 flex flex-shrink-0 gap-4">
          <div className="w-1/2">
            <h3 className="mb-2">STATUS</h3>
            <Select
              defaultValue="To Do"
              onValueChange={(value) => setStatus(value as TaskStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="In QA">In QA</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2">
            <h3 className="mb-2">ASSIGNEE</h3>
            <Select defaultValue="Un Assigned" onValueChange={setAssignee}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Assign To Me">Assign To Me</SelectItem>
                <SelectItem value="Un Assigned">Un Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Extra Fields */}
        {customFields.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2">CUSTOM FIELDS</h3>
            {customFields.map((field, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <span className="w-1/4">{field.fieldName}</span>
                <Input
                  className="w-full"
                  value={field.fieldValue}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  placeholder={`Enter ${field.fieldName}`}
                />
                <button
                  onClick={() => handleRemoveField(index)}
                  className="text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Extra Fields Button */}
        <div className="mb-4 flex-shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-auto rounded-md bg-blue-400 px-3 py-1 text-sm text-black">
                + Add Custom Field
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Custom Field</DialogTitle>
              </DialogHeader>
              <Input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Enter field name"
                className="w-full rounded-md border border-gray-300 px-2 py-1"
              />
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button onClick={handleAddField} className="bg-zesty-green">
                    Add Field
                  </Button>
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleCreateTask}
          className="bg-zesty-green w-full text-black"
        >
          Create task
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModal;
