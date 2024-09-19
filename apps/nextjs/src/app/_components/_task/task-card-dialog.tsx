"use client";

import type { z } from "zod";
import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useFieldArray, useForm } from "react-hook-form";

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

import { taskCardSchema } from "./task-card-schema";

// TaskDialogProps updated to accept Zod form inputs
export interface TaskCardDialogProps {
  initialValues?: z.infer<typeof taskCardSchema>;
  onSubmit: (taskData: z.infer<typeof taskCardSchema>) => void;
  dialogTrigger?: React.ReactNode;
  dialogButtonText?: string;
  submitButtonText?: string;
}

const TaskCardDialog: React.FC<TaskCardDialogProps> = ({
  initialValues,
  onSubmit,
  dialogTrigger,
  dialogButtonText = "Dialog Button",
  submitButtonText = "Submit Button",
}) => {
  const defaultTags = [
    "Frontend",
    "Backend",
    "Design",
    "Smart Contracts",
    "Integration",
  ];
  const [userTags, setUserTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState<boolean>(false);

  const [newFieldName, setNewFieldName] = useState("");

  // Setup form with React Hook Form and Zod validation
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<z.infer<typeof taskCardSchema>>({
    resolver: zodResolver(taskCardSchema),
    defaultValues: initialValues ?? {
      title: "",
      description: "",
      dueDate: "",
      status: "To Do",
      assignee: "Un Assigned",
      tags: {
        defaultTags: [],
        userGeneratedTags: [],
      },
      customFields: [],
    },
  });

  // Use useFieldArray to manage custom fields dynamically
  const { fields, append, remove } = useFieldArray({
    control, // control object from useForm
    name: "customFields", // the field name for custom fields array
  });

  // Watch form values
  const dueDate = watch("dueDate");
  const status = watch("status");
  const selectedTags = watch("tags");

  // Toggle tag selection
  const toggleTagSelection = (tag: string) => {
    const currentDefaultTags = selectedTags.defaultTags;
    const currentUserTags = selectedTags.userGeneratedTags;

    const updatedTags = currentDefaultTags.includes(tag)
      ? currentDefaultTags.filter((t) => t !== tag)
      : [...currentDefaultTags, tag];

    const updatedUserTags = currentUserTags.includes(tag)
      ? currentUserTags.filter((t) => t !== tag)
      : [...currentUserTags, tag];

    if (defaultTags.includes(tag)) {
      setValue("tags.defaultTags", updatedTags);
    } else {
      setValue("tags.userGeneratedTags", updatedUserTags);
    }

    void trigger("tags");
  };

  // Add new custom tag
  const handleAddTag = () => {
    if (newTag.trim() && !userTags.includes(newTag)) {
      setUserTags([...userTags, newTag]);
      toggleTagSelection(newTag);
      setNewTag("");
      setIsTagDialogOpen(false); // Close the add tag dialog when a tag is added
    }
  };

  // Remove user-generated tag
  const handleRemoveTag = (tagToRemove: string) => {
    setUserTags(userTags.filter((tag) => tag !== tagToRemove));
    setValue(
      "tags.userGeneratedTags",
      userTags.filter((tag) => tag !== tagToRemove),
    );
    void trigger("tags");
  };

  const handleAddCustomField = () => {
    // Append a new field with empty value to the form array
    append({ fieldName: newFieldName, fieldValue: "" });

    // Reset the input field for the custom field name
    setNewFieldName("");

    // Close the custom field dialog
    setIsFieldDialogOpen(false);
  };

  // Handle removing a custom field
  const handleRemoveCustomField = (index: number) => {
    // Remove the specific field from the array
    remove(index);

    // Optionally trigger validation after removing
    void trigger("customFields");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {dialogTrigger ?? (
          <Button className="max-h-[40px] w-full bg-transparent text-white hover:bg-[#27272a]">
            {dialogButtonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[50vw] flex-col overflow-auto rounded-lg bg-gray-900 p-6 text-white">
        <DialogHeader>
          <DialogTitle>Task</DialogTitle>
        </DialogHeader>

        {/* Tags */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="mb-2">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {/* Preset Tags (Cannot be deleted) */}
            {defaultTags.map((tag) => (
              <Button
                key={tag}
                onClick={() => toggleTagSelection(tag)}
                className={`cursor-pointer rounded-md px-3 py-1 text-sm ${
                  selectedTags.defaultTags.includes(tag)
                    ? "bg-zesty-green text-black"
                    : "bg-gray-700 text-white"
                }`}
              >
                {tag}
              </Button>
            ))}

            {/* User-added Tags */}
            {userTags.map((tag) => (
              <div key={tag} className="flex items-center">
                <Button
                  onClick={() => toggleTagSelection(tag)}
                  className={`cursor-pointer rounded-md px-3 py-1 text-sm ${
                    selectedTags.userGeneratedTags.includes(tag)
                      ? "bg-zesty-green text-black"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {tag}
                </Button>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}

            {/* Add New Tag Button */}
            <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTag(); // Trigger add tag function on Enter key press
                    }
                  }}
                />
                <DialogFooter>
                  <Button onClick={handleAddTag} className="bg-zesty-green">
                    Add Tag
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {errors.tags?.defaultTags && (
            <p className="text-red-500">{errors.tags.defaultTags.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="mb-4 flex-grow">
          <h3 className="mb-2">TITLE</h3>
          <Input
            placeholder="Enter short task title."
            className="h-24"
            {...register("title")}
          />
          {errors.title?.message && (
            <p className="text-red-500">{String(errors.title.message)}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4 flex-grow">
          <h3 className="mb-2">DESCRIPTION</h3>
          <Input
            placeholder="Enter detailed task description."
            className="h-24 flex-wrap"
            {...register("description")}
          />
          {errors.description?.message && (
            <p className="text-red-500">{String(errors.description.message)}</p>
          )}
        </div>

        {/* Due Date */}
        <div className="mb4 flex-shrink-0">
          <h3 className="mb2">DUE DATE</h3>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground",
                )}
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <Image
                  src="/calendar.png"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="mr-2 h-4 w-4"
                />
                {dueDate && !isNaN(Date.parse(dueDate)) ? (
                  format(new Date(dueDate), "PPP") // Display the formatted date if valid
                ) : (
                  <span>Pick a date</span> // Display "Pick a date" if no valid date
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  dueDate && !isNaN(Date.parse(dueDate))
                    ? new Date(dueDate)
                    : undefined
                }
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    setValue("dueDate", selectedDate.toISOString()); // Store as date string
                    setIsCalendarOpen(false);
                    void trigger("dueDate");
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dueDate?.message && (
            <p className="text-red-500">{String(errors.dueDate.message)}</p>
          )}
        </div>

        {/* Status and Assignee */}
        <div className="mb-6 flex flex-shrink-0 gap-4">
          <div className="w-1/2">
            <h3 className="mb-2">STATUS</h3>
            <Select
              value={status} // Watch form value using "watch" from useForm
              onValueChange={(value) =>
                setValue(
                  "status",
                  value as
                    | "To Do"
                    | "In Progress"
                    | "In QA"
                    | "Done"
                    | "Approved",
                )
              }
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
            {errors.status?.message && (
              <p className="text-red-500">{String(errors.status.message)}</p>
            )}
          </div>

          <div className="w-1/2">
            <h3 className="mb-2">ASSIGNEE</h3>
            <Select
              value={watch("assignee")} // Watch form value using "watch"
              onValueChange={(value) => setValue("assignee", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Assign To Me">Assign To Me</SelectItem>
                <SelectItem value="Un Assigned">Un Assigned</SelectItem>
              </SelectContent>
            </Select>
            {errors.assignee?.message && (
              <p className="text-red-500">{String(errors.assignee.message)}</p>
            )}
          </div>
        </div>

        {/* Extra Fields */}
        {fields.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2">CUSTOM FIELDS</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-2 flex items-center gap-2">
                <span className="w-1/4">{field.fieldName}</span>
                <Input
                  className="w-full"
                  {...register(`customFields.${index}.fieldValue`, {
                    required: "Field value is required",
                  })}
                  placeholder={`Enter ${field.fieldName} field value.`}
                />
                <button
                  onClick={() => handleRemoveCustomField(index)}
                  className="text-red-500"
                >
                  &times;
                </button>

                {errors.customFields?.[index]?.fieldValue && (
                  <p className="text-red-500">
                    {errors.customFields[index].fieldValue.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Extra Fields Button */}
        <div className="mb-4 flex-shrink-0">
          <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddCustomField(); // Add custom field on Enter key press
                  }
                }}
              />
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button
                    onClick={handleAddCustomField}
                    className="bg-zesty-green"
                  >
                    Add Field
                  </Button>
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Submit Button */}
        <DialogFooter>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="bg-zesty-green w-full text-black"
          >
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCardDialog;
