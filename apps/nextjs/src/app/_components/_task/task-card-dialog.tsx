"use client";

// Current testing URL for project board
// http://localhost:3000/tasks/6720293fcbf4d733c85b5975
import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useFieldArray, useForm } from "react-hook-form";

import type { NewTaskCard, ObjectIdString, TaskCard } from "@acme/validators";
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
import { Textarea } from "@acme/ui/textarea";
import { NewTaskCardSchema, TaskCardSchema } from "@acme/validators";

import { api } from "~/trpc/react";
import EditIcon from "./icons/EditIcon";

// TaskDialogProps updated to accept Zod form inputs
export interface TaskCardDialogProps {
  initialValues?: TaskCard;
  onSubmit: (taskData: TaskCard | NewTaskCard) => void;
  dialogTrigger?: React.ReactNode;
  dialogButtonText?: string;
  submitButtonText?: string;
  projectId: ObjectIdString;
  statusId: ObjectIdString;
  isEditable?: boolean;
}

const TaskCardDialog = ({
  initialValues,
  onSubmit,
  dialogTrigger,
  dialogButtonText = "Dialog Button",
  submitButtonText = "Submit Button",
  projectId,
  statusId,
  isEditable = false,
}: TaskCardDialogProps) => {
  const defaultTags = [
    "Frontend",
    "Backend",
    "Design",
    "Smart Contracts",
    "Integration",
  ];

  const isNewTask = !initialValues?._id;

  const [isEditMode, setIsEditMode] = useState<boolean>(isNewTask);
  const [newTag, setNewTag] = useState<string>("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
  } = useForm<NewTaskCard | TaskCard>({
    resolver: zodResolver(isNewTask ? NewTaskCardSchema : TaskCardSchema),
    // resolver: zodResolver(NewTaskCardSchema),
    defaultValues: initialValues ?? {
      title: "",
      description: "",
      dueDate: new Date(NaN),
      statusId: statusId,
      assigneeId: undefined,
      projectId: projectId,
      order: 0,
      tags: {
        defaultTags: [],
        userGeneratedTags: [],
      },
      customFields: [],
    },
  });

  // if (initialValues) console.log(initialValues);
  // console.log("statusId prop:", statusId);

  // Fetch statuses based on projectId
  const {
    data: statuses,
    isLoading: isStatusesLoading,
    error: statusesError,
  } = api.task.getStatusesByProjectId.useQuery({
    projectId,
  });

  // Use useFieldArray to manage custom fields dynamically
  const { fields, append, remove } = useFieldArray({
    control, // control object from useForm
    name: "customFields", // the field name for custom fields array
  });

  // Watch form values
  const dueDate = watch("dueDate");
  const selectedTags = watch("tags");
  const selectedStatusId = watch("statusId");

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
    if (newTag.trim() && !selectedTags.userGeneratedTags.includes(newTag)) {
      setValue("tags.userGeneratedTags", [
        ...selectedTags.userGeneratedTags,
        newTag,
      ]);
      setNewTag("");
      setIsTagDialogOpen(false); // Close the add tag dialog when a tag is added
      void trigger("tags"); // Trigger validation
    }
  };

  // Remove user-generated tag
  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags.userGeneratedTags",
      selectedTags.userGeneratedTags.filter((tag) => tag !== tagToRemove),
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

    // Trigger validation after removing
    void trigger("customFields");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {dialogTrigger ?? (
          <Button
            className="text-xxl max-h-[40px] w-full justify-start bg-transparent text-white hover:bg-[#27272a]"
            onClick={() => setIsDialogOpen(true)}
          >
            {dialogButtonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[800px] flex-col overflow-auto rounded-lg bg-black p-6 text-white">
        <DialogHeader className="flex w-full items-start justify-center">
          <DialogTitle className="text-2xl font-semibold">
            {initialValues?.title ?? "New Task"}
            {/* Add an Edit button to toggle edit mode */}
            {!isNewTask && isEditable && (
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`ml-4 mt-2 ${isEditMode ? "stroke-amber-300 hover:stroke-green-400" : "stroke-gray-400 hover:stroke-amber-300"}`}
              >
                <EditIcon />
              </button>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Tags */}
        <div className="mb-4 flex-shrink-0">
          <h3 className="mb-2 text-xs font-semibold text-slate-400">TAGS</h3>
          <div className="flex flex-wrap gap-2">
            {/* Preset Tags (Cannot be deleted) */}
            {defaultTags.map((tag) => (
              <Button
                key={tag}
                onClick={() => toggleTagSelection(tag)}
                className={`border-1 h-fit w-fit cursor-pointer rounded-md border-white border-opacity-30 bg-black bg-transparent px-2 py-1 text-xs text-white hover:bg-[#27272a] ${
                  selectedTags.defaultTags.includes(tag)
                    ? "bg-zesty-green hover:bg-zesty-green text-black"
                    : "text-white"
                }`}
                disabled={!isEditMode} // Disable tag selection if not in edit mode
              >
                {tag}
              </Button>
            ))}

            {/* User-added Tags */}
            {selectedTags.userGeneratedTags.map((tag) => (
              <div key={tag} className="flex items-center">
                <Button
                  onClick={() => toggleTagSelection(tag)}
                  disabled={!isEditMode}
                  className={`bg-zesty-green border-1 h-fit w-fit cursor-pointer rounded-md border-white border-opacity-30 px-2 py-1 text-xs hover:bg-[#27272a] ${
                    selectedTags.userGeneratedTags.includes(tag)
                      ? "bg-zesty-green hover:bg-zesty-green text-black"
                      : "text-white"
                  }`}
                >
                  {tag}
                </Button>
                {isEditMode && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}

            {/* Add New Tag Button */}
            {isEditMode && (
              <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="border-1 ml-2 h-fit w-fit cursor-pointer rounded-md border-white border-opacity-30 bg-blue-400 bg-transparent px-1 py-1 text-xs text-white hover:bg-[#27272a]">
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
                    <Button
                      onClick={handleAddTag}
                      className="bg-zesty-green hover:bg-zesty-green"
                    >
                      Add Tag
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {errors.tags?.defaultTags && (
            <p className="text-red-500">{errors.tags.defaultTags.message}</p>
          )}
        </div>
        {/* Title */}
        {isEditMode && (
          <div className="mb-4 flex-grow">
            <h3 className="mb-2 text-xs font-semibold text-slate-400">TITLE</h3>
            <Input
              placeholder="Enter short task title."
              {...register("title")}
            />
            {errors.title?.message && (
              <p className="text-red-500">{String(errors.title.message)}</p>
            )}
          </div>
        )}
        {/* Description */}
        <div className="mb-4 flex-grow">
          {isEditMode && (
            <h3 className="mb-2 text-xs font-semibold text-slate-400">
              DESCRIPTION
            </h3>
          )}
          <Textarea
            placeholder="Enter detailed task description."
            disabled={!isEditMode}
            className="h-24"
            {...register("description")}
          />
          {errors.description?.message && (
            <p className="text-red-500">{String(errors.description.message)}</p>
          )}
        </div>
        {/* Due Date */}
        <div className="mb4 flex-shrink-0">
          <h3 className="mb-2 text-xs font-semibold text-slate-400">
            DUE DATE
          </h3>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                disabled={!isEditMode}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  isNaN(dueDate.getTime()) && "text-muted-foreground",
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
                {dueDate instanceof Date && !isNaN(dueDate.getTime()) ? (
                  format(new Date(dueDate), "PPP") // Display the formatted date if valid
                ) : (
                  <span>Pick a date</span> // Display "Pick a date" if no valid date
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={isNaN(dueDate.getTime()) ? new Date(NaN) : dueDate}
                onSelect={(selectedDate) => {
                  setValue("dueDate", selectedDate ?? new Date(NaN));
                  setIsCalendarOpen(false);
                  void trigger("dueDate");
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
          {/* Status */}
          <div className="w-1/2">
            <h3 className="mb-2 text-xs font-semibold text-slate-400">
              STATUS
            </h3>
            {isStatusesLoading ? (
              <p>Loading statuses...</p>
            ) : statusesError ? (
              <p>Error loading statuses</p>
            ) : (
              <Select
                value={selectedStatusId}
                onValueChange={(value: ObjectIdString) => {
                  setValue("statusId", value);
                  void trigger("statusId");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses?.map((status) => (
                    <SelectItem
                      // key={status._id}
                      value={status._id}
                    >
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.statusId?.message && (
              <p className="text-red-500">{String(errors.statusId.message)}</p>
            )}
          </div>

          {/* Assignee */}
          <div className="w-1/2">
            <h3 className="mb-2 text-xs font-semibold text-slate-400">
              ASSIGNEE
            </h3>
            <Select
              value={watch("assigneeId") ?? "unassigned"}
              onValueChange={(value: ObjectIdString) => {
                setValue(
                  "assigneeId",
                  value === "unassigned" ? undefined : value,
                );
                void trigger("assigneeId");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {/* Add options for available assignees */}
              </SelectContent>
            </Select>
            {errors.assigneeId?.message && (
              <p className="text-red-500">
                {String(errors.assigneeId.message)}
              </p>
            )}
          </div>
        </div>
        {/* Extra Fields */}
        {fields.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-xs font-semibold text-slate-400">
              CUSTOM FIELDS
            </h3>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-2 flex items-center gap-2">
                <span className="w-1/4 text-sm">{field.fieldName}</span>
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
        {isEditMode && (
          <div className="mb-4 flex-shrink-0">
            <Dialog
              open={isFieldDialogOpen}
              onOpenChange={setIsFieldDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="border-1 ml-2 h-fit w-fit cursor-pointer rounded-md border-white border-opacity-30 bg-blue-400 bg-transparent px-2 py-2 text-xs text-white hover:bg-[#27272a]">
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
                      className="bg-zesty-green hover:bg-zesty-green"
                    >
                      Add Field
                    </Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {/* Submit Button */}
        <DialogFooter>
          <Button
            onClick={handleSubmit((taskData) => {
              console.log("Attempting to submit a task:", taskData); // This will now log the form data

              if (isNewTask) {
                const newTaskData: NewTaskCard = taskData;
                onSubmit(newTaskData);
                setIsDialogOpen(false);
              } else {
                const updatedTaskData = {
                  ...taskData,
                  _id: initialValues._id as ObjectIdString,
                };

                onSubmit(updatedTaskData as TaskCard);
                setIsDialogOpen(false);
              }
            })}
            className="bg-zesty-green hover:bg-zesty-green w-full text-black"
          >
            {submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCardDialog;
