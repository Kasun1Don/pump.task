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

const NewTaskModal = () => {
  const presetTags = [
    "Frontend",
    "Backend",
    "Design",
    "Smart Contracts",
    "Integration",
  ];

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [date, setDate] = useState<Date>();

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
      !presetTags.includes(newTag) &&
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 text-white">+ New task</Button>
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
            {presetTags.map((tag) => (
              <div key={tag} className="flex items-center">
                <button
                  onClick={() => toggleTagSelection(tag)}
                  style={
                    selectedTags.includes(tag)
                      ? {
                          backgroundColor: "var(--ZESTY-GREEN, #72D524)",
                          color: "black",
                        }
                      : {}
                  }
                  className={`cursor-pointer rounded-md px-3 py-1 text-sm ${
                    !selectedTags.includes(tag) ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  {tag}
                </button>
              </div>
            ))}

            {/* User-added Tags (Can be deleted) */}
            {userTags.map((tag) => (
              <div key={tag} className="flex items-center">
                <button
                  onClick={() => toggleTagSelection(tag)}
                  style={
                    selectedTags.includes(tag)
                      ? {
                          backgroundColor: "var(--ZESTY-GREEN, #72D524)",
                          color: "black",
                        }
                      : {}
                  }
                  className={`cursor-pointer rounded-md px-3 py-1 text-sm ${
                    !selectedTags.includes(tag) ? "bg-gray-700 text-white" : ""
                  }`}
                >
                  {tag}
                </button>
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
                <button className="ml-2 rounded-md bg-blue-500 px-3 py-1 text-sm text-white">
                  + Add Tag
                </button>
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
                  <Button onClick={handleAddTag} className="bg-green-500">
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
          <Input placeholder="Enter short task title." className="h-24"></Input>
        </div>

        {/* Description */}
        <div className="mb-4 flex-grow">
          <h3 className="mb-2">DESCRIPTION</h3>
          <Input
            placeholder="Enter detailed task description."
            className="h-24 flex-wrap"
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
                  !date && "text-muted-foreground",
                )}
              >
                <Image
                  src="/calendar.png"
                  alt="Logo"
                  width={150}
                  height={150}
                  className="mr-2 h-4 w-4"
                />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Status and Assignee */}
        <div className="mb-6 flex flex-shrink-0 gap-4">
          <div className="w-1/2">
            <h3 className="mb-2">STATUS</h3>
            <Select defaultValue="to do">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to do">To Do</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="in qa">In QA</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2">
            <h3 className="mb-2">ASSIGNEE</h3>
            <Select defaultValue="un assigned">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assign to me">Assign To Me</SelectItem>
                <SelectItem value="un assigned">Un Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          style={{ backgroundColor: "var(--ZESTY-GREEN, #72D524)" }}
          className="w-full text-black"
        >
          Create task
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskModal;
